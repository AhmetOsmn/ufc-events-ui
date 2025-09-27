import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { QUERY_KEYS } from "../api/constants";
import { fetchEvents } from "../api/services";
import type { Event } from "../types";

/**
 * Hata mesajını kullanıcı dostu hale getiren fonksiyon
 */
function getErrorMessage(error: Error): string {
  // Online/offline durumunu kontrol et
  const isOffline = !navigator.onLine;

  if (isOffline) {
    return "İnternet bağlantınız yok. Lütfen bağlantınızı kontrol edin ve tekrar deneyin.";
  }

  // API'den gelen hata mesajları öncelikli
  // Eğer mesaj Türkçe karakterler içeriyorsa, büyük ihtimalle API'den gelen mesajdır
  if (/[çğıöşüÇĞIİÖŞÜ]/.test(error.message)) {
    return error.message;
  }

  // Network hataları için özel mesajlar
  if (
    error.message.includes("fetch") ||
    error.message.includes("Failed to fetch") ||
    error.message.includes("NetworkError") ||
    error.message.includes("ERR_NETWORK")
  ) {
    return "Sunucuya bağlanılamıyor. API servisi çalışmıyor olabilir. Lütfen daha sonra tekrar deneyin.";
  }

  if (error.message.includes("timeout") || error.message.includes("TIMEOUT")) {
    return "İstek zaman aşımına uğradı. Sunucu yanıt vermiyor. Lütfen tekrar deneyin.";
  }

  if (error.message.includes("404") || error.message.includes("Not Found")) {
    return "İstenen kaynak bulunamadı. API adresi değişmiş olabilir.";
  }

  if (
    error.message.includes("500") ||
    error.message.includes("Internal Server Error")
  ) {
    return "Sunucu hatası oluştu. Teknik ekip bilgilendirildi, lütfen daha sonra tekrar deneyin.";
  }

  if (error.message.includes("403") || error.message.includes("Forbidden")) {
    return "Bu kaynağa erişim iznin yok.";
  }

  if (error.message.includes("401") || error.message.includes("Unauthorized")) {
    return "Yetkilendirme hatası. Lütfen tekrar giriş yapın.";
  }

  // CORS hataları
  if (
    error.message.includes("CORS") ||
    error.message.includes("Cross-Origin")
  ) {
    return "Sunucu yapılandırma sorunu. Lütfen yöneticiye başvurun.";
  }

  // Veri bulunamadı hatası - API'den geldi
  if (error.message.includes("Veri bulunamadı")) {
    return error.message;
  }

  // Genel hata mesajı
  return "Veriler yüklenirken beklenmeyen bir sorun oluştu. Lütfen sayfayı yenileyin veya daha sonra tekrar deneyin.";
}

/**
 * Tüm etkinlikleri getiren hook
 * @returns UseQueryResult<Event[], Error>
 */
export function useEvents(): UseQueryResult<Event[], Error> {
  const query = useQuery({
    queryKey: QUERY_KEYS.EVENTS,
    queryFn: fetchEvents,
    staleTime: 5 * 60 * 1000, // 5 dakika
    gcTime: 10 * 60 * 1000, // 10 dakika
    retry: 2, // 2 kez tekrar dene
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff
  });

  // Hata mesajını kullanıcı dostu hale getir
  if (query.error) {
    const friendlyMessage = getErrorMessage(query.error);
    const friendlyError = new Error(friendlyMessage);
    return {
      ...query,
      error: friendlyError,
    };
  }

  return query;
}

/**
 * Etkinliklerin yüklenme durumunu kontrol eden hook
 * @returns boolean - Herhangi bir etkinlik query'si yükleniyor mu?
 */
export function useIsEventsLoading(): boolean {
  const eventsQuery = useEvents();
  return eventsQuery.isLoading;
}

/**
 * Etkinliklerin hata durumunu kontrol eden hook
 * @returns Error | null - Varsa hata objesi
 */
export function useEventsError(): Error | null {
  const eventsQuery = useEvents();
  return eventsQuery.error;
}
