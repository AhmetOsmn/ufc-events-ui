import { useEffect, useState } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { MdEventNote, MdWarning } from "react-icons/md";
import "./App.css";
import EventDetails from "./components/EventDetails";
import EventSidebar from "./components/EventSidebar";
import Header from "./components/Header";
import { useEvents } from "./hooks/useEvents";
import { useEventSelectionStore } from "./stores/eventSelectionStore";

function App() {
  // API'den etkinlikleri getir
  const { data: events, isLoading, isError, error } = useEvents();

  // Zustand store actions
  const setEvents = useEventSelectionStore((state) => state.setEvents);
  const setEventsLoading = useEventSelectionStore(
    (state) => state.setEventsLoading
  );
  const setEventsError = useEventSelectionStore(
    (state) => state.setEventsError
  );

  // İlk etkinliği seçili olarak ayarla (veriler yüklendiğinde)
  const [selectedEventId, setSelectedEventId] = useState<string>("");

  // Events'in array olduğundan emin ol
  const eventsArray = Array.isArray(events) ? events : [];

  // Store'u güncel tutmak için useEffect
  useEffect(() => {
    setEventsLoading(isLoading);
  }, [isLoading, setEventsLoading]);

  useEffect(() => {
    if (isError) {
      setEventsError(error?.message || "Eventler yüklenirken hata oluştu");
    } else {
      setEventsError(null);
    }
  }, [isError, error, setEventsError]);

  useEffect(() => {
    if (eventsArray.length > 0) {
      setEvents(eventsArray);
    }
  }, [eventsArray, setEvents]);

  // Etkinlikler yüklendiğinde ve henüz seçili etkinlik yoksa, ilk etkinliği seç
  if (eventsArray.length > 0 && !selectedEventId) {
    setSelectedEventId(eventsArray[0].id);
  }

  // Seçili etkinliği bul
  const selectedEvent =
    eventsArray.find((event) => event.id === selectedEventId) || eventsArray[0];

  const handleEventSelect = (eventId: string) => {
    setSelectedEventId(eventId);
  };

  // Yükleme durumu
  if (isLoading) {
    return (
      <div className="bg-background-light dark:bg-background-dark font-display">
        <div className="flex min-h-screen w-full flex-col">
          <Header />
          <main className="flex flex-1 items-center justify-center">
            <div className="text-center">
              <AiOutlineLoading3Quarters className="animate-spin h-12 w-12 text-primary-red mx-auto mb-4" />
              <p className="text-text-light dark:text-text-dark">
                Etkinlikler yükleniyor...
              </p>
            </div>
          </main>
        </div>
      </div>
    );
  }

  // Hata durumu
  if (isError) {
    return (
      <div className="bg-background-light dark:bg-background-dark font-display">
        <div className="flex min-h-screen w-full flex-col">
          <Header />
          <main className="flex flex-1 items-center justify-center">
            <div className="text-center">
              <div className="text-red-500 mb-4">
                <MdWarning className="w-16 h-16 mx-auto mb-4" />
              </div>
              <h3 className="text-lg font-semibold text-text-light dark:text-text-dark mb-2">
                Bağlantı Sorunu
              </h3>
              <p className="text-text-light/70 dark:text-text-dark/70 mb-4">
                {error?.message ||
                  "Sunucuya bağlanılamıyor. Lütfen internet bağlantınızı kontrol edin."}
              </p>
              <button
                onClick={() => window.location.reload()}
                className="bg-primary-red text-white px-6 py-3 rounded-lg hover:bg-primary-red/90 transition-colors font-medium"
              >
                Tekrar Dene
              </button>
            </div>
          </main>
        </div>
      </div>
    );
  }

  // Veri var ama boş ise
  if (eventsArray.length === 0 && !isLoading) {
    return (
      <div className="bg-background-light dark:bg-background-dark font-display">
        <div className="flex min-h-screen w-full flex-col">
          <Header />
          <main className="flex flex-1 items-center justify-center">
            <div className="text-center">
              <div className="text-gray-400 mb-4">
                <MdEventNote className="w-16 h-16 mx-auto mb-4" />
              </div>
              <h3 className="text-lg font-semibold text-text-light dark:text-text-dark mb-2">
                Henüz etkinlik bulunmuyor
              </h3>
              <p className="text-text-light/70 dark:text-text-dark/70">
                Şu anda görüntülenecek etkinlik yok.
              </p>
            </div>
          </main>
        </div>
      </div>
    );
  }

  // Veriler yok ise hiçbir şey render etme
  if (!eventsArray.length && !isLoading && !isError) {
    return null;
  }

  return (
    <div className="bg-background-light dark:bg-background-dark font-display">
      <div className="flex min-h-screen w-full flex-col">
        <Header />
        <main className="flex flex-1">
          {/* Ana content area - responsive layout */}
          <div className="flex w-full">
            {/* Sol sidebar - Event listesi (masaüstünde) */}
            <div className="hidden lg:block">
              <EventSidebar
                events={eventsArray}
                selectedEventId={selectedEventId || eventsArray[0]?.id}
                onEventSelect={handleEventSelect}
              />
            </div>

            {/* Event detayları - ana alan */}
            <div className="flex-1 w-full lg:w-auto">
              <EventDetails
                event={selectedEvent || eventsArray[0]}
                events={eventsArray}
                selectedEventId={selectedEventId || eventsArray[0]?.id}
                onEventSelect={handleEventSelect}
              />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
