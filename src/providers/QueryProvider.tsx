import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useState } from "react";

interface QueryProviderProps {
  children: React.ReactNode;
}

// QueryClient factory fonksiyonu
function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // Veriler 5 dakika boyunca fresh olarak kabul edilir
        staleTime: 5 * 60 * 1000,
        // Veriler 10 dakika boyunca cache'de tutulur
        gcTime: 10 * 60 * 1000,
        // Hata durumunda 1 kez daha dene
        retry: 1,
        // Yavaş ağlarda daha uzun timeout
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
        // Window focus olduğunda yeniden fetch etme
        refetchOnWindowFocus: false,
      },
      mutations: {
        // Mutation hataları için tekrar deneme yok (duplicate request'leri önlemek için)
        retry: false,
        // Network mode - her zaman dene
        networkMode: "always",
      },
    },
  });
}

export function QueryProvider({ children }: QueryProviderProps) {
  // QueryClient'ı component state'inde tutarak re-render'larda yeniden oluşturulmasını engelliyoruz
  const [queryClient] = useState(() => createQueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/* Development ortamında devtools'u göster */}
      {process.env.NODE_ENV === "development" && (
        <ReactQueryDevtools initialIsOpen={false} />
      )}
    </QueryClientProvider>
  );
}
