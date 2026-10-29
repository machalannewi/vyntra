import { SignJWT, jwtVerify } from "jose";

// Edge-safe session helpers (used by middleware and server code).

export const SESSION_COOKIE = "vyntra_session";

export type SessionPayload = { userId: string; role: string };

function key() {
  const secret = process.env.AUTH_SECRET;
  if (!secret) throw new Error("AUTH_SECRET is not set");
  return new TextEncoder().encode(secret);
}

export async function signSession(payload: SessionPayload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(key());
}

export async function verifySession(token: string | undefined): Promise<SessionPayload | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, key());
    return { userId: String(payload.userId), role: String(payload.role) };
  } catch {
    return null;
  }
}
