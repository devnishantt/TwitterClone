import jwt, { type Secret } from "jsonwebtoken";
import { UnauthorizedError } from "../errors/error";
import { JWT_CONFIG } from "../../config/serverConfig";

interface TokenPayload {
  id: string;
  email?: string;
  username?: string;
}

function handleAuthError(error: any, tokenType: string): never {
  if (error instanceof UnauthorizedError) throw error;

  if (error instanceof jwt.JsonWebTokenError) {
    throw new UnauthorizedError(`Invalid or malformed ${tokenType} token.`);
  }
  if (error instanceof jwt.TokenExpiredError) {
    throw new UnauthorizedError(`${tokenType} token is expired.`);
  }
  throw new UnauthorizedError(`Error verifying ${tokenType} token.`);
}

export function generateAccessToken(payload: TokenPayload): string {
  return jwt.sign(payload, JWT_CONFIG.JWT_SECRET as Secret, {
    expiresIn: JWT_CONFIG.JWT_EXPIRES_IN as any,
  });
}

export function generateRefreshToken(payload: TokenPayload): string {
  return jwt.sign(payload, JWT_CONFIG.JWT_REFRESH_SECRET as Secret, {
    expiresIn: JWT_CONFIG.JWT_REFRESH_EXPIRES_IN as any,
  });
}
