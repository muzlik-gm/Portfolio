import * as jose from 'jose';
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from 'next/server';
import { IUser } from "./models";

export interface AuthUser {
  id: string;
  email: string;
  role: string;
  permissions: string[];
  firstName?: string;
  lastName?: string;
}

export interface AdminUser {
  username: string;
  role: string;
  iat: number;
  exp: number;
}

export async function verifyAdminToken(token: string): Promise<AdminUser | null> {
  try {
    console.log('[AUTH] Verifying admin token');
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      console.error('[AUTH] JWT_SECRET not configured');
      throw new Error("JWT_SECRET not configured");
    }

    const secret = new TextEncoder().encode(jwtSecret);
    const { payload } = await jose.jwtVerify(token, secret);
    console.log('[AUTH] Raw payload from JWT:', JSON.stringify(payload, null, 2));

    // Map JWT payload fields to AdminUser interface
    const decoded: AdminUser = {
      username: (payload as any).email || (payload as any).firstName || 'unknown',
      role: (payload as any).role,
      iat: payload.iat as number,
      exp: payload.exp as number,
    };

    console.log('[AUTH] Decoded as AdminUser:', JSON.stringify(decoded, null, 2));
    console.log('[AUTH] Admin token verified for user:', decoded.username);
    return decoded;
  } catch (error) {
    console.error("[AUTH] Admin token verification failed:", error);
    return null;
  }
}

export async function isTokenExpired(token: string): Promise<boolean> {
  try {
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      return true;
    }

    const secret = new TextEncoder().encode(jwtSecret);
    const { payload } = await jose.jwtVerify(token, secret);
    if (!payload || !payload.exp) return true;

    return payload.exp * 1000 < Date.now();
  } catch (error) {
    return true;
  }
}

// Password hashing functions
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 12;
  return bcrypt.hash(password, saltRounds);
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

// JWT token functions
export async function generateToken(user: AuthUser): Promise<string> {
  console.log('[AUTH] Generating token for user:', {
    id: user.id,
    email: user.email,
    role: typeof user.role + ' - ' + JSON.stringify(user.role),
    permissions: typeof user.permissions + ' - ' + JSON.stringify(user.permissions),
    firstName: user.firstName,
    lastName: user.lastName,
  });

  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    throw new Error("JWT_SECRET not configured");
  }

  const secret = new TextEncoder().encode(jwtSecret);

  try {
    // Ensure role is a string and permissions is an array for JWT serialization
    const role = typeof user.role === 'string' ? user.role : String(user.role);
    const permissions = Array.isArray(user.permissions) ? user.permissions : [];

    const jwt = await new jose.SignJWT({
      id: user.id,
      email: user.email,
      role: role,
      permissions: permissions,
      firstName: user.firstName,
      lastName: user.lastName,
    })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('24h')
    .sign(secret);
    console.log('[AUTH] Token generation successful');
    return jwt;
  } catch (error) {
    console.error('[AUTH] Token generation failed at SignJWT:', error);
    console.error('[AUTH] Payload inspection:', {
      role: typeof user.role + ' - ' + JSON.stringify(user.role),
      permissions: typeof user.permissions + ' - ' + JSON.stringify(user.permissions),
      fullPayload: {
        id: user.id,
        email: user.email,
        role: user.role,
        permissions: user.permissions,
        firstName: user.firstName,
        lastName: user.lastName,
      }
    });
    throw error;
  }
}

export async function verifyToken(token: string): Promise<AuthUser | null> {
  try {
    console.log('[AUTH] Verifying token in runtime:', typeof globalThis !== 'undefined' ? 'browser/edge' : 'node');
    console.log('[AUTH] Verifying token');
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      console.error('[AUTH] JWT_SECRET not configured');
      throw new Error("JWT_SECRET not configured");
    }

    const secret = new TextEncoder().encode(jwtSecret);
    const { payload } = await jose.jwtVerify(token, secret);
    const decoded = payload as unknown as AuthUser;
    console.log('[AUTH] Token verified for user:', decoded.email);
    console.log('[AUTH] About to call jwt.verify with token and secret');
    return decoded;
  } catch (error) {
    console.error("[AUTH] Token verification failed:", error);
    return null;
  }
}

// Permission checking
export function hasPermission(user: AuthUser, requiredPermission: string): boolean {
  if (user.role === 'admin') return true;
  return user.permissions.includes(requiredPermission);
}

export function hasRole(user: AuthUser, requiredRole: 'admin' | 'editor' | 'viewer'): boolean {
  const roles = ['viewer', 'editor', 'admin'];
  const userRoleIndex = roles.indexOf(user.role);
  const requiredRoleIndex = roles.indexOf(requiredRole);
  return userRoleIndex >= requiredRoleIndex;
}

export function getTokenFromRequest(request: Request): string | null {
  const authHeader = request.headers.get("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }

  return authHeader.substring(7);
}

// Cookie-based token functions for server-side usage
export async function setAuthCookie(token: string) {
  try {
    const response = NextResponse.next();
    response.cookies.set('adminToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24, // 24 hours
      path: '/'
    });
    console.log('[AUTH] Token cookie set successfully');
    return response;
  } catch (error) {
    console.error('[AUTH] Failed to set auth cookie:', error);
    throw error;
  }
}

export function getAuthCookie(request: NextRequest): string | null {
  try {
    const token = request.cookies.get('adminToken')?.value;
    console.log('[AUTH] Token cookie retrieved:', token ? 'present' : 'missing');
    return token || null;
  } catch (error) {
    console.error('[AUTH] Failed to get auth cookie:', error);
    return null;
  }
}

export function clearAuthCookie(response: NextResponse) {
  try {
    response.cookies.delete('adminToken');
    console.log('[AUTH] Token cookie cleared');
  } catch (error) {
    console.error('[AUTH] Failed to clear auth cookie:', error);
  }
}