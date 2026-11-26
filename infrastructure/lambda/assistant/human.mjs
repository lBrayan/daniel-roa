// Verificación "soy humano" sin servicios externos (prueba de trabajo).
//
// 1) El navegador pide un reto firmado (salt + dificultad + vencimiento).
// 2) Busca un número (nonce) tal que sha256(salt + nonce) empiece con N bits
//    en cero. A un navegador normal le toma uno o dos segundos; a un bot que
//    quiera abrir miles de sesiones le sale caro en CPU.
// 3) El servidor valida la firma, el vencimiento, la solución y que el reto no
//    se haya usado antes, y entrega un token de sesión firmado (2 horas).
// 4) El asistente solo responde con un token válido y cuenta los mensajes por
//    sesión.
import { createHmac, createHash, randomBytes, timingSafeEqual } from "node:crypto";
import { SecretsManagerClient, GetSecretValueCommand } from "@aws-sdk/client-secrets-manager";

export const DIFFICULTY = Number(process.env.POW_DIFFICULTY || 18);
const CHALLENGE_TTL_S = 5 * 60;
const SESSION_TTL_S = 2 * 60 * 60;

let keyPromise = null;
/** Llave HMAC guardada en Secrets Manager (se lee una vez por contenedor). */
export function getKey() {
    if (!keyPromise) {
        const sm = new SecretsManagerClient({});
        keyPromise = sm
            .send(new GetSecretValueCommand({ SecretId: process.env.SIGNING_SECRET_ARN }))
            .then((r) => Buffer.from(r.SecretString || "", "utf8"))
            .catch((e) => {
                keyPromise = null;
                throw e;
            });
    }
    return keyPromise;
}

const b64u = (buf) => Buffer.from(buf).toString("base64url");
const sign = (key, data) => createHmac("sha256", key).update(data).digest("base64url");

function safeEqual(a, b) {
    const x = Buffer.from(String(a));
    const y = Buffer.from(String(b));
    return x.length === y.length && timingSafeEqual(x, y);
}

export async function makeChallenge() {
    const key = await getKey();
    const salt = b64u(randomBytes(16));
    const expires = Math.floor(Date.now() / 1000) + CHALLENGE_TTL_S;
    const payload = `${salt}.${DIFFICULTY}.${expires}`;
    return { salt, difficulty: DIFFICULTY, expires, signature: sign(key, payload) };
}

function leadingZeroBits(buf) {
    let bits = 0;
    for (const byte of buf) {
        if (byte === 0) {
            bits += 8;
            continue;
        }
        bits += Math.clz32(byte) - 24;
        break;
    }
    return bits;
}

/** Valida la solución. Devuelve el salt si es válida (para marcarlo como usado). */
export async function checkSolution({ salt, difficulty, expires, signature, nonce }) {
    const key = await getKey();
    if (typeof salt !== "string" || typeof signature !== "string") return null;
    if (Number(difficulty) !== DIFFICULTY) return null;
    if (!Number.isFinite(Number(expires)) || Number(expires) < Date.now() / 1000) return null;
    if (!safeEqual(sign(key, `${salt}.${DIFFICULTY}.${Number(expires)}`), signature)) return null;
    if (!/^\d{1,12}$/.test(String(nonce))) return null;
    const digest = createHash("sha256").update(`${salt}${nonce}`).digest();
    return leadingZeroBits(digest) >= DIFFICULTY ? salt : null;
}

export async function makeToken(ip) {
    const key = await getKey();
    const body = b64u(
        JSON.stringify({ sid: b64u(randomBytes(12)), exp: Math.floor(Date.now() / 1000) + SESSION_TTL_S, ip }),
    );
    return `${body}.${sign(key, body)}`;
}

/** Devuelve { sid } si el token es válido y no ha vencido. */
export async function readToken(token) {
    if (typeof token !== "string" || !token.includes(".")) return null;
    const key = await getKey();
    const [body, sig] = token.split(".");
    if (!body || !sig || !safeEqual(sign(key, body), sig)) return null;
    try {
        const data = JSON.parse(Buffer.from(body, "base64url").toString("utf8"));
        if (!data.sid || data.exp < Date.now() / 1000) return null;
        return data;
    } catch {
        return null;
    }
}
