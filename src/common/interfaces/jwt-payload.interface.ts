export interface JwtPayload {
  sub: string;
  email: string;
}

export interface TokenValidationResponse {
  valid: boolean;
  payload?: JwtPayload;
  message?: string;
}
