export const EVENT_TYPES = [
  "LOGIN",
  "SIGNUP",
  "PURCHASE",
  "SEARCH",
  "LOGOUT",
  "API_ERROR",
] as const;

export const COUNTRIES = [
  "United States",
  "India",
  "United Kingdom",
  "Germany",
  "France",
  "Japan",
  "Brazil",
  "Canada",
  "Australia",
  "South Korea",
  "Mexico",
  "Netherlands",
  "Singapore",
  "Sweden",
  "Israel",
];

export const DEVICES = ["Desktop", "Mobile", "Tablet"];

export const BROWSERS = ["Chrome", "Firefox", "Safari", "Edge", "Opera"];

export const STATUS_COLORS: Record<string, string> = {
  LOGIN: "#22c55e",
  SIGNUP: "#3b82f6",
  PURCHASE: "#a855f7",
  SEARCH: "#f59e0b",
  LOGOUT: "#6b7280",
  API_ERROR: "#ef4444",
};

export const EVENT_ICONS: Record<string, string> = {
  LOGIN: "🔐",
  SIGNUP: "👤",
  PURCHASE: "💳",
  SEARCH: "🔍",
  LOGOUT: "🚪",
  API_ERROR: "⚠️",
};
