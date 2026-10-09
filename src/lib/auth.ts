import { SignJWT, jwtVerify } from "jose";

const secretString = process.env.AUTH_SECRET;

if (!secretString) {
  throw new Error(
    "AUTH_SECRET belum diisi. Buat string acak minimal 32 karakter di environment variable Vercel."
  );
}

const secret = new TextEncoder().encode(secretString);

export const SESSION_COOKIE = "artikel_session";
export const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 hari

export async function createSessionToken(): Promise<string> {
  return new SignJWT({ role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_MAX_AGE}s`)
    .sign(secret);
}

export async function verifySessionToken(
  token?: string | null
): Promise<boolean> {
  if (!token) return false;
  try {
    await jwtVerify(token, secret);
    return true;
  } catch {
    return false;
  }
}

export function verifyAdminPassword(password: string): boolean {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) return false;
  if (password.length !== expected.length) return false;
  let diff = 0;
  for (let i = 0; i < password.length; i++) {
    diff |= password.charCodeAt(i) ^ expected.charCodeAt(i);
  }
  return diff === 0;
}
