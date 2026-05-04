export enum UserRole {
  OWNER = 'OWNER',
  ADMIN = 'ADMIN',
  AGENT = 'AGENT',
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  tenantId: string;

  // 👇 ADICIONA ISSO
  permissions?: string[];

  avatarUrl: string | null;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface TokenPayload {
  sub: string;
  name: string;
  email: string;
  role: UserRole;
  tenantId: string;
  iat: number;
  exp: number;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  accessToken: string;
}

export interface RefreshTokenResponse {
  accessToken: string;
}
