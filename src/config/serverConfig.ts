import dotenv from "dotenv";

dotenv.config();

export const PORT: number = Number(process.env.PORT) || 3000;
export const NODE_ENV = process.env.NODE_ENV || "development";
export const LOG_LEVEL =
  process.env.LOG_LEVEL || (NODE_ENV === "development" ? "debug" : "info");
export const DATEBASE_URL = process.env.DATABASE_URL;
export const BCRYPT_SALT_ROUNDS = process.env.BCRYPT_SALT_ROUNDS || "10";

export const JWT_CONFIG = {
  JWT_SECRET: process.env.JWT_SECRET || "jwt-secret-key",
  JWT_EXPIRES_IN: (process.env.JWT_EXPIRES_IN || "7d") as string,
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || "jwt-refresh-secret",
  JWT_REFRESH_EXPIRES_IN: (process.env.JWT_REFRESH_EXPIRES_IN ||
    "30d") as string,
};

const convertExpiryToMs = (expiry: string): number => {
  if (expiry.endsWith("d")) parseInt(expiry) * 24 * 60 * 60 * 1000;
  else if (expiry.endsWith("hr")) parseInt(expiry) * 60 * 60 * 1000;
  else if (expiry.endsWith("m")) parseInt(expiry) * 60 * 1000;

  return parseInt(expiry);
};

export const COOKIE_CONFIG = {
  maxAge: convertExpiryToMs(JWT_CONFIG.JWT_EXPIRES_IN),
  httpOnly: true,
  secure: NODE_ENV === "production",
  sameSite: "lax" as const,
};

export const REFRESH_COOKIE_CONFIG = {
  maxAge: convertExpiryToMs(JWT_CONFIG.JWT_REFRESH_EXPIRES_IN),
  httpOnly: true,
  secure: NODE_ENV === "production",
  sameSite: "lax" as const,
};
