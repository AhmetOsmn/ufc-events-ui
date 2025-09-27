import { useMutation, type UseMutationResult } from "@tanstack/react-query";
import { MUTATION_KEYS } from "../api/constants";
import { addEventToCalendar } from "../api/services";
import type { Event } from "../types";

// Mutation için input tipi
export interface AddToCalendarInput {
  eventId: string;
  eventTitle: string;
  eventDate: string;
  eventLocation: string;
}

// Mutation response tipi
export interface AddToCalendarResponse {
  success: boolean;
  message: string;
}

/**
 * Takvime etkinlik ekleme mutation hook'u
 * @returns UseMutationResult<AddToCalendarResponse, Error, AddToCalendarInput>
 */
export function useAddToCalendarMutation(): UseMutationResult<
  AddToCalendarResponse,
  Error,
  AddToCalendarInput
> {
  return useMutation({
    mutationKey: MUTATION_KEYS.SEND_EMAIL,
    mutationFn: addEventToCalendar,
    onSuccess: (data, variables) => {
      // Başarılı ekleme sonrası işlemler
      console.log("Etkinlik başarıyla takvime eklendi:", {
        eventTitle: variables.eventTitle,
        response: data,
      });
    },
    onError: (error, variables) => {
      // Hata durumunda işlemler
      console.error("Takvime ekleme hatası:", {
        eventTitle: variables.eventTitle,
        error: error.message,
      });
    },
    // Retry ayarları - ağ hatalarında otomatik yeniden deneme
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}

/**
 * Event objesinden AddToCalendarInput oluşturan yardımcı fonksiyon
 * @param event - Event objesi
 * @returns AddToCalendarInput objesi
 */
export function createCalendarInput(event: Event): AddToCalendarInput {
  return {
    eventId: event.id,
    eventTitle: event.eventTitle,
    eventDate: event.eventDate,
    eventLocation: event.eventLocation,
  };
}

/**
 * Takvime ekleme işleminin durumunu kontrol eden hook
 * @returns boolean - Herhangi bir takvim ekleme işlemi devam ediyor mu?
 */
export function useIsAddingToCalendar(): boolean {
  const mutation = useAddToCalendarMutation();
  return mutation.isPending;
}

/**
 * Toast bildirimi ile birlikte takvime ekleme hook'u
 * @param options - Toast seçenekleri
 * @returns Mutation hook'u ve helper fonksiyonlar
 */
export function useAddToCalendarWithToast(options?: {
  onSuccessMessage?: string;
  onErrorMessage?: string;
}) {
  const mutation = useAddToCalendarMutation();

  const addToCalendar = (event: Event) => {
    const input = createCalendarInput(event);

    mutation.mutate(input, {
      onSuccess: (data) => {
        if (data.success) {
          // Burada toast kütüphanesi kullanılabilir
          console.log(
            options?.onSuccessMessage ||
              `"${event.eventTitle}" etkinliği takvime eklendi!`
          );
        } else {
          console.warn("Takvime ekleme başarısız:", data.message);
        }
      },
      onError: (error) => {
        console.error(
          options?.onErrorMessage ||
            `Takvime ekleme sırasında hata oluştu: ${error.message}`
        );
      },
    });
  };

  return {
    addToCalendar,
    isPending: mutation.isPending,
    isError: mutation.isError,
    isSuccess: mutation.isSuccess,
    error: mutation.error,
    data: mutation.data,
    reset: mutation.reset,
  };
}
