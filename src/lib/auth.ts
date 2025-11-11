import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
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

export function verifyAdminToken(token: string): AdminUser | null {
  try {
    console.log('[AUTH] Verifying admin token');
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      console.error('[AUTH] JWT_SECRET not configured');
      throw new Error("JWT_SECRET not configured");
    }

    const decoded = jwt.verify(token, jwtSecret) as AdminUser;
    console.log('[AUTH] Admin token verified for user:', decoded.username);
    return decoded;
  } catch (error) {
    console.error("[AUTH] Admin token verification failed:", error);
    return null;
  }
}

export function isTokenExpired(token: string): boolean {
  try {
    const decoded = jwt.decode(token) as AdminUser;
    if (!decoded || !decoded.exp) return true;
    
    return decoded.exp * 1000 < Date.now();
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
export function generateToken(user: AuthUser): string {
  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    throw new Error("JWT_SECRET not configured");
  }

  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
      permissions: user.permissions,
      firstName: user.firstName,
      lastName: user.lastName,
    },
    jwtSecret,
    { expiresIn: "24h" }
  );
}

export function verifyToken(token: string): AuthUser | null {
  try {
    console.log('[AUTH] Verifying token');
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      console.error('[AUTH] JWT_SECRET not configured');
      throw new Error("JWT_SECRET not configured");
    }

    const decoded = jwt.verify(token, jwtSecret) as AuthUser;
    console.log('[AUTH] Token verified for user:', decoded.email);
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