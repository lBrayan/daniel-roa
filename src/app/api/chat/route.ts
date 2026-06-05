// src/app/api/chat/route.ts
import { NextRequest, NextResponse } from "next/server";
import { DANIEL_CONTEXT } from "@/lib/danielContext";

export const runtime = "edge";

interface GroqErrorBody {
    error?: { message?: string; type?: string; code?: string };
}

// ─── 1. Ejecutor individual (Intenta una vez, si falla retorna null) ──────────

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
                max_tokens: 512,
                messages: [
                    { role: "system", content: DANIEL_CONTEXT },
                    { role: "user", content: message },
                ],
            }),
        });

        if (!res.ok) {
            const body: GroqErrorBody = await res.json().catch(() => ({}));
            // Logueamos el error para monitoreo, pero NO reventamos la app
            console.warn(`[Groq Fallback] Falló el modelo ${model}: ${res.status} — ${body?.error?.message ?? "unknown"}`);
            return null;
        }

        const data = await res.json();
        return data.choices?.[0]?.message?.content ?? null;
    } catch (e) {
        console.error(`[Groq Fallback] Excepción de red con ${model}:`, e);
        return null;
    }
}

// ─── 2. Motor de Reintentos en Cascada (Chain of Fallbacks) ───────────────────

async function tryAIChain(message: string): Promise<string | null> {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
        console.error("[AI] Falta la variable de entorno GROQ_API_KEY");
        return null;
    }

    // Lista de modelos ordenados por prioridad:
    // 1. Llama 3.3 70B (Mejor razonamiento)
    // 2. Llama 3.1 8B (Súper rápido y con alto rate limit)
    // 3. Gemma 2 9B (Modelo open weights de Google, excelente respaldo)
    // 4. Mixtral 8x7B (Un tanque de guerra por si los Llama están caídos)
    const fallbackChain = [
        "llama-3.3-70b-versatile",
        "llama-3.1-8b-instant",
        "gemma2-9b-it",
        "mixtral-8x7b-32768"
    ];

    for (const model of fallbackChain) {
        const result = await callGroq(apiKey, model, message);

        // Si el resultado NO es null, el modelo funcionó perfectamente.
        // Rompemos el ciclo y devolvemos la respuesta al cliente.
        if (result !== null) {
            console.log(`[AI] Respuesta generada exitosamente con: ${model}`);
            return result;
        }

        // Si fue null, el ciclo 'for' continúa automáticamente con el siguiente modelo.
        console.log(`[AI] ${model} no respondió, intentando con el siguiente...`);
    }

    // Si llegamos aquí, significa que LOS 4 MODELOS fallaron (algo catastrófico en Groq)
    console.error("[AI] Fallo crítico: Ningún modelo de la cadena logró responder.");
    return null;
}

// ─── 3. Parser de seguridad JSON ──────────────────────────────────────────────

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
        // Fallback defensivo si el modelo decide no enviar JSON
        return {
            type: "general",
            message: "",
            data: {
                text: text.replace(/```json|```/g, "").trim() },
        };
    }
}

// ─── 4. Handler Principal ─────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
    try {
        const { message } = await req.json();

        if (!message || typeof message !== "string") {
            return NextResponse.json({ error: "El mensaje es requerido" }, { status: 400 });
        }

        // Ejecutamos nuestra cadena blindada de modelos
        const text = await tryAIChain(message);

        // Si text es null, devolvemos un 503.
        // OJO: Tu componente ChatInput.tsx ya está programado para atrapar este 503 
        // e inyectar las respuestas hardcodeadas de 'fallbacks.ts', por lo que el 
        // usuario final NUNCA verá un error en pantalla.
        if (text === null) {
            return NextResponse.json({ error: "AI_UNAVAILABLE" }, { status: 503 });
        }

        return NextResponse.json(parseModelResponse(text));
    } catch (err) {
        console.error("[chat/route] Error no manejado en el servidor:", err);
        return NextResponse.json({ error: "SERVER_ERROR" }, { status: 500 });
    }
}