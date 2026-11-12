export interface LoginCredentials {
  username: string;
  password: string;
}

export interface AuthenticatedUser {
  id: string;
  username: string;
  isEligibleToPlay: boolean;
  isOfLegalAge: boolean;
  walletBalance: number;
  country: string;
}

export interface LoginResponse {
  accessToken: string;
  expiresAt: string;
  user: AuthenticatedUser;
}
