export const isOverwolf = process.env.TARGET === "overwolf";
export const isOverwolfApp =
  isOverwolf ||
  (typeof navigator !== "undefined" &&
    navigator.userAgent.includes("Overwolf"));
export const API_BASE_URI = process.env.NEXT_PUBLIC_API_BASE_URI;
export const PATREON_BASE_URI = process.env.NEXT_PUBLIC_PATREON_BASE_URI;
export const OVERWOLF_APP_UID = process.env.NEXT_PUBLIC_OVERWOLF_APP_ID;
export const isDevelopment = process.env.NODE_ENV === "development";
