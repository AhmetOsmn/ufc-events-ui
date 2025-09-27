// API konfigürasyonu sabitleri
export const API_CONFIG = {
  BASE_URL: "http://localhost:5230", // Gerçek API URL'inizi buraya ekleyin
  ENDPOINTS: {
    EVENTS: "/events",
    SEND_EMAIL: "/send-email",
  },
  TIMEOUT: 10000, // 10 saniye
} as const;

// API anahtarları (gerekirse)
export const API_KEYS = {
  // API_KEY: 'your-api-key-here', // Gerekirse API anahtarınızı ekleyin
} as const;

// Query keys (React Query için)
export const QUERY_KEYS = {
  EVENTS: ["events"] as const,
} as const;

// Mutation keys (React Query için)
export const MUTATION_KEYS = {
  SEND_EMAIL: ["sendEmail"] as const,
} as const;
