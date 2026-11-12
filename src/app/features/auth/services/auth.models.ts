export interface LoginCredentials {
  username: string;
  password: string;
}

export interface AuthenticatedUser {
  id: string;
  username: string;
  isEligibleToPlay: boolean;
}

export interface LoginResponse {
  accessToken: string;
  expiresAt: string;
  user: AuthenticatedUser;
}
