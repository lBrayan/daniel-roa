// src/app/api/chat/route.ts
import { NextRequest, NextResponse } from "next/server";
import { DANIEL_CONTEXT } from "@/lib/danielContext";

export const runtime = "edge";

// ─── Tipos ────────────────────────────────────────────────────────────────────

interface GroqErrorBody {
    error?: { message?: string; type?: string; code?: string };
}

// ─── Helper: llamada genérica a Groq con cualquier modelo ────────────────────

async function callGroq(apiKey: string, model: string, message: string): Promise<string | null> {
    try {
        const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
                model,
                max_tokens: 512, // reducido: la respuesta JSON es corta, no necesita más
                messages: [
                    { role: "system", content: DANIEL_CONTEXT },
                    { role: "user", content: message },
                ],
            }),
        });

        if (!res.ok) {
            const body: GroqErrorBody = await res.json().catch(() => ({}));
            const isRateLimit = res.status === 429 || body?.error?.code === "rate_limit_exceeded";
            console.warn(`[Groq:${model}] ${res.status} — ${body?.error?.message ?? "unknown"}`);
            // Retornar símbolo especial para distinguir rate-limit de error real
            return isRateLimit ? "__RATE_LIMITED__" : null;
        }

        const data = await res.json();
        return data.choices?.[0]?.message?.content ?? null;
    } catch (e) {
        console.error(`[Groq:${model}] fetch exception:`, e);
        return null;
    }
}

// ─── Cadena Groq: prueba modelos en orden hasta obtener respuesta ─────────────
//
// Orden elegido por TPM disponible en free tier:
//   1. gemma2-9b-it       → 15 000 TPM (2.5x más generoso, context 8K — suficiente)
//   2. llama-3.3-70b-versatile → 6 000 TPM, mejor calidad que 8b
//   3. llama-3.1-8b-instant   → 6 000 TPM, el más rápido/ligero de fallback
//
async function tryGroq(message: string): Promise<string | null> {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) return null;

    const models = [
        "llama-3.3-70b-versatile", // 6K TPM — mejor calidad
        "llama-3.1-8b-instant",    // 6K TPM — más rápido
    ];

    for (const model of models) {
        const result = await callGroq(apiKey, model, message);

        if (result === "__RATE_LIMITED__") {
            // Este modelo está saturado → intentar el siguiente
            console.warn(`[Groq] ${model} rate-limited, trying next model...`);
            continue;
        }

        if (result !== null) {
            console.log(`[Groq] responded with model: ${model}`);
            return result;
        }

        // Error no relacionado con rate-limit → saltar al proveedor siguiente
        console.warn(`[Groq] ${model} failed with non-rate-limit error, skipping chain.`);
        break;
    }

    return null;
}

// ─── Anthropic (último recurso) ───────────────────────────────────────────────

async function tryAnthropic(message: string): Promise<string | null> {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) return null;

    try {
        const res = await fetch("https://api.anthropic.com/v1/messages", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-api-key": apiKey,
                "anthropic-version": "2023-06-01",
            },
            body: JSON.stringify({
                model: "claude-haiku-4-5-20251001",
                max_tokens: 512,
                system: DANIEL_CONTEXT,
                messages: [{ role: "user", content: message }],
            }),
        });

        if (!res.ok) {
            console.error(`[Anthropic] ${res.status}`);
            return null;
        }

        const data = await res.json();
        return data.content?.[0]?.text ?? null;
    } catch (e) {
        console.error("[Anthropic] fetch exception:", e);
        return null;
    }
}

// ─── Parser JSON de la respuesta del modelo ───────────────────────────────────

function parseModelResponse(text: string): Record<string, unknown> {
    try {
        let clean = text.replace(/```json\s*/gi, "").replace(/```\s*/gi, "").trim();

        const jsonStart = clean.indexOf("{");
        const jsonEnd = clean.lastIndexOf("}");

        if (jsonStart !== -1 && jsonEnd !== -1 && jsonEnd > jsonStart) {
            clean = clean.slice(jsonStart, jsonEnd + 1);
        }

        const parsed = JSON.parse(clean);

        if (!parsed.type || !parsed.data) throw new Error("Invalid structure");

        return parsed;
    } catch {
        return {
            type: "general",
            message: "",
            data: { text: text.replace(/```json|```/g, "").trim() },
        };
    }
}

// ─── Handler principal ────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
    try {
        const { message } = await req.json();

        if (!message || typeof message !== "string") {
            return NextResponse.json({ error: "Message required" }, { status: 400 });
        }

        // Cadena: Groq (3 modelos) → Anthropic
        const text = (await tryGroq(message)) ?? (await tryAnthropic(message));

        if (text === null) {
            return NextResponse.json({ error: "AI_UNAVAILABLE" }, { status: 503 });
        }

        return NextResponse.json(parseModelResponse(text));
    } catch (err) {
        console.error("[chat/route] unhandled error:", err);
        return NextResponse.json({ error: "SERVER_ERROR" }, { status: 500 });
    }
}