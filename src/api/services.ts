import type { ApiResponse, Event } from "../types";
import { API_CONFIG } from "./constants";

// HTTP isteği yapıcı fonksiyon - yeni API response formatı için güncellenmiş
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T | null> {
  const url = `${API_CONFIG.BASE_URL}${endpoint}`;

  const config: RequestInit = {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  };

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.TIMEOUT);

  try {
    const response = await fetch(url, {
      ...config,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    let apiResponse: ApiResponse<T>;

    try {
      apiResponse = await response.json();
    } catch {
      // JSON parse hatası
      throw new Error(`Invalid response format. Status: ${response.status}`);
    }

    if (!response.ok) {
      // API'den gelen hata mesajını kullan
      throw new Error(
        apiResponse.message || `HTTP error! status: ${response.status}`
      );
    }

    return apiResponse.data;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Bilinmeyen bir hata oluştu");
  }
}

// Etkinlikleri getir
export async function fetchEvents(): Promise<Event[] | null> {
  return apiRequest<Event[] | null>(API_CONFIG.ENDPOINTS.EVENTS);
}

// Email gönderme servisi - sadece email parametresi
export async function addEventToCalendar(emailData: {
  email: string;
}): Promise<{ success: boolean; message: string }> {
  try {
    // API'yi çağır - yeni format: {message, data}
    const response = await apiRequest<ApiResponse<null>>(
      API_CONFIG.ENDPOINTS.SEND_EMAIL,
      {
        method: "POST",
        body: JSON.stringify(emailData),
      }
    );

    // Başarılı durumda standart format döndür
    return {
      success: true,
      message: response?.message || "Email başarıyla gönderildi",
    };
  } catch (error) {
    // Hata durumunda standart format döndür
    throw new Error(
      error instanceof Error ? error.message : "Email gönderilirken hata oluştu"
    );
  }
}
