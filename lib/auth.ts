import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

const secretKey = process.env.JWT_SECRET_KEY || 'your-secret-key';
const key = new TextEncoder().encode(secretKey);
export async function encrypt(payload: any) {
    return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('24h')
    .sign(key);
}

export async function decrypt(token: string): Promise<any> {
  try {
    const { payload } = await jwtVerify(token, key);
    return payload;
  } catch (error) {
    return null;
  }
}

export async function login(formData: FormData) {
    // Verify credentials
const cookieStore = await cookies();
const token = await encrypt({
    email: formData.get('email'),
    role: 'user',
  });
  
  cookieStore.set('token', token, {
      httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 86400, // 24 hours
  });
}

export async function logout() {
    const cookieStore = await cookies();
    cookieStore.delete('token');
}

export async function getSession() {
const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  if (!token) return null;
  return await decrypt(token);
}

export async function updateSession(request: NextRequest) {
  const session = await getSession();
  if (!session) return;

  // Update session
  const response =  NextResponse.next();
  response.cookies.set({
    name: 'token',
    value: await encrypt(session),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 86400, // 24 hours
  });

  return response;
}