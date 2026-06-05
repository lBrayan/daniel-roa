// src/app/api/chat/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getDanielContext } from "@/lib/danielContext"; // ← getDanielContext, no DANIEL_CONTEXT
import type { Locale } from "@/i18n/LanguageContext";

export const runtime = "edge";

interface GroqErrorBody {
    error?: { message?: string; type?: string; code?: string };
}

async function callGroq(
    apiKey: string,
    model: string,
    message: string,
    locale: Locale          // ← recibe locale
): Promise<string | null> {
    try {
        const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
                model,
                max_tokens: 512,
                messages: [
                    { role: "system", content: getDanielContext(locale) }, // ← locale-aware
                    { role: "user", content: message },
                ],
            }),
        });

        if (!res.ok) {
            const body: GroqErrorBody = await res.json().catch(() => ({}));
            console.warn(`[Groq Fallback] Falló ${model}: ${res.status} — ${body?.error?.message ?? "unknown"}`);
            return null;
        }

        const data = await res.json();
        return data.choices?.[0]?.message?.content ?? null;
    } catch (e) {
        console.error(`[Groq Fallback] Excepción de red con ${model}:`, e);
        return null;
    }
}

async function tryAIChain(message: string, locale: Locale): Promise<string | null> { // ← locale
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
        console.error("[AI] Falta GROQ_API_KEY");
        return null;
    }

    const fallbackChain = [
        "llama-3.3-70b-versatile",
        "llama-3.1-8b-instant",
        "gemma2-9b-it",
        "mixtral-8x7b-32768",
    ];

    for (const model of fallbackChain) {
        const result = await callGroq(apiKey, model, message, locale); // ← pasa locale
        if (result !== null) {
            console.log(`[AI] Respuesta con: ${model}`);
            return result;
        }
        console.log(`[AI] ${model} no respondió, siguiente...`);
    }

    console.error("[AI] Fallo crítico: ningún modelo respondió.");
    return null;
}

function parseModelResponse(text: string): Record<string, unknown> {
    try {
        let clean = text.replace(/```json\s*/gi, "").replace(/```\s*/gi, "").trim();
        const jsonStart = clean.indexOf("{");
        const jsonEnd = clean.lastIndexOf("}");
        if (jsonStart !== -1 && jsonEnd !== -1 && jsonEnd > jsonStart) {
            clean = clean.slice(jsonStart, jsonEnd + 1);
        }
        const parsed = JSON.parse(clean);
        if (!parsed.type || !parsed.data) throw new Error("Estructura inválida");
        return parsed;
    } catch {
        return {
            type: "general",
            message: "",
            data: { text: text.replace(/```json|```/g, "").trim() },
        };
    }
}

export async function POST(req: NextRequest) {
    try {
        // ← leer locale del body, default "es"
        const { message, locale = "es" }: { message: string; locale?: Locale } = await req.json();

        if (!message || typeof message !== "string") {
            return NextResponse.json({ error: "El mensaje es requerido" }, { status: 400 });
        }

        const text = await tryAIChain(message, locale); // ← pasa locale

        if (text === null) {
            return NextResponse.json({ error: "AI_UNAVAILABLE" }, { status: 503 });
        }

        return NextResponse.json(parseModelResponse(text));
    } catch (err) {
        console.error("[chat/route] Error no manejado:", err);
        return NextResponse.json({ error: "SERVER_ERROR" }, { status: 500 });
    }
}