// Verificación "soy humano" del asistente (prueba de trabajo, sin servicios externos).
// El servidor entrega un reto firmado; el navegador busca un número que haga que
// sha256(salt + número) empiece con N bits en cero y lo envía para obtener un
// token de sesión. Ver infrastructure/lambda/assistant/human.mjs.

const K = new Uint32Array([
    0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5, 0xd807aa98,
    0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174, 0xe49b69c1, 0xefbe4786,
    0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da, 0x983e5152, 0xa831c66d, 0xb00327c8,
    0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967, 0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13,
    0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85, 0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819,
    0xd6990624, 0xf40e3585, 0x106aa070, 0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a,
    0x5b9cca4f, 0x682e6ff3, 0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7,
    0xc67178f2,
]);
const W = new Uint32Array(64);

/** Primeras 32 bits de sha256(ascii). Solo para cadenas ASCII cortas (< 56 bytes). */
function sha256FirstWord(str: string): number {
    const len = str.length;
    const block = new Uint8Array(64);
    for (let i = 0; i < len; i++) block[i] = str.charCodeAt(i);
    block[len] = 0x80;
    const bits = len * 8;
    block[62] = (bits >>> 8) & 0xff;
    block[63] = bits & 0xff;
    for (let i = 0; i < 16; i++) {
        W[i] = ((block[i * 4]! << 24) | (block[i * 4 + 1]! << 16) | (block[i * 4 + 2]! << 8) | block[i * 4 + 3]!) >>> 0;
    }
    for (let i = 16; i < 64; i++) {
        const w15 = W[i - 15]!;
        const w2 = W[i - 2]!;
        const s0 = ((w15 >>> 7) | (w15 << 25)) ^ ((w15 >>> 18) | (w15 << 14)) ^ (w15 >>> 3);
        const s1 = ((w2 >>> 17) | (w2 << 15)) ^ ((w2 >>> 19) | (w2 << 13)) ^ (w2 >>> 10);
        W[i] = (W[i - 16]! + s0 + W[i - 7]! + s1) >>> 0;
    }
    let a = 0x6a09e667, b = 0xbb67ae85, c = 0x3c6ef372, d = 0xa54ff53a;
    let e = 0x510e527f, f = 0x9b05688c, g = 0x1f83d9ab, h = 0x5be0cd19;
    for (let i = 0; i < 64; i++) {
        const S1 = ((e >>> 6) | (e << 26)) ^ ((e >>> 11) | (e << 21)) ^ ((e >>> 25) | (e << 7));
        const ch = (e & f) ^ (~e & g);
        const t1 = (h + S1 + ch + K[i]! + W[i]!) >>> 0;
        const S0 = ((a >>> 2) | (a << 30)) ^ ((a >>> 13) | (a << 19)) ^ ((a >>> 22) | (a << 10));
        const maj = (a & b) ^ (a & c) ^ (b & c);
        const t2 = (S0 + maj) >>> 0;
        h = g; g = f; f = e; e = (d + t1) >>> 0; d = c; c = b; b = a; a = (t1 + t2) >>> 0;
    }
    return (0x6a09e667 + a) >>> 0;
}

export type Challenge = { salt: string; difficulty: number; expires: number; signature: string };

/** Resuelve el reto sin congelar la página (cede el hilo cada cierto número de intentos). */
export async function solve(ch: Challenge, onProgress?: (n: number) => void): Promise<number> {
    const mask = ch.difficulty >= 32 ? 0xffffffff : (0xffffffff << (32 - ch.difficulty)) >>> 0;
    for (let nonce = 0; nonce < 50_000_000; nonce++) {
        if ((sha256FirstWord(ch.salt + nonce) & mask) === 0) return nonce;
        if (nonce % 20000 === 0) {
            onProgress?.(nonce);
            await new Promise((r) => setTimeout(r, 0));
        }
    }
    throw new Error("no solution");
}

const TOKEN_KEY = "assistant-token-v1";

export function savedToken(): string | null {
    try {
        const raw = sessionStorage.getItem(TOKEN_KEY);
        if (!raw) return null;
        const { token, exp } = JSON.parse(raw) as { token: string; exp: number };
        return exp > Date.now() ? token : null;
    } catch {
        return null;
    }
}

export function clearToken() {
    try {
        sessionStorage.removeItem(TOKEN_KEY);
    } catch {
        /* ignorar */
    }
}

/** Pide el reto, lo resuelve y devuelve el token de sesión. */
export async function verifyHuman(honeypot: string, onProgress?: (n: number) => void): Promise<string> {
    const ch = (await fetch("/api/assistant/challenge", { method: "POST" }).then((r) => {
        if (!r.ok) throw new Error("challenge");
        return r.json();
    })) as Challenge;
    const nonce = await solve(ch, onProgress);
    const res = await fetch("/api/assistant/verify", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ ...ch, nonce, website: honeypot }),
    });
    if (!res.ok) throw new Error("verify");
    const { token } = (await res.json()) as { token: string };
    try {
        sessionStorage.setItem(TOKEN_KEY, JSON.stringify({ token, exp: Date.now() + 110 * 60 * 1000 }));
    } catch {
        /* ignorar */
    }
    return token;
}
