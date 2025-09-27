import { useState } from "react";
import { MdKeyboardArrowDown } from "react-icons/md";
import type { Event } from "../types";
import FightCard from "./FightCard";

interface EventDetailsProps {
  event: Event;
  events?: Event[];
  selectedEventId?: string;
  onEventSelect?: (eventId: string) => void;
}

function EventDetails({
  event,
  events,
  selectedEventId,
  onEventSelect,
}: EventDetailsProps) {
  const [showMobileEventList, setShowMobileEventList] = useState(false);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("tr-TR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <section className="flex flex-1 flex-col">
      <div className="p-3 sm:p-4 md:p-6 lg:p-8">
        {/* Mobil Event Selector */}
        {events &&
          Array.isArray(events) &&
          events.length > 0 &&
          onEventSelect && (
            <div className="lg:hidden mb-4">
              <button
                onClick={() => setShowMobileEventList(!showMobileEventList)}
                className="flex items-center justify-between w-full p-3 bg-slate-200/50 dark:bg-slate-800/50 rounded-lg border border-primary/20 dark:border-primary/30 cursor-pointer hover:bg-slate-200/70 dark:hover:bg-slate-800/70 transition-colors"
              >
                <div className="text-left">
                  <p className="font-medium text-slate-900 dark:text-white">
                    {event.eventTitle}
                  </p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {event.eventLocation}
                  </p>
                </div>
                <MdKeyboardArrowDown
                  className={`w-5 h-5 text-slate-500 transition-transform ${
                    showMobileEventList ? "rotate-180" : ""
                  }`}
                />
              </button>

              {showMobileEventList && (
                <div className="mt-2 bg-white dark:bg-slate-800 rounded-lg border border-primary/20 dark:border-primary/30 shadow-lg max-h-64 overflow-y-auto">
                  {events.map((evt) => (
                    <button
                      key={evt.id}
                      onClick={() => {
                        onEventSelect(evt.id);
                        setShowMobileEventList(false);
                      }}
                      className={`w-full p-3 text-left border-b border-primary/10 dark:border-primary/20 last:border-b-0 transition-colors cursor-pointer ${
                        evt.id === selectedEventId
                          ? "bg-primary/10 text-primary dark:bg-primary/20"
                          : "hover:bg-slate-100 dark:hover:bg-slate-700"
                      }`}
                    >
                      <p className="font-medium">{evt.eventTitle}</p>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        {evt.eventLocation}
                      </p>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

        <header className="mb-6 md:mb-8">
          <div className="flex flex-col gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">
                {event.eventTitle}
              </h1>
              <p className="text-base text-slate-500 dark:text-slate-400">
                {event.eventLocation}
              </p>
            </div>
          </div>
        </header>
        <div className="space-y-6 md:space-y-8">
          <div>
            <h3 className="mb-4 text-lg font-bold text-slate-900 dark:text-white">
              Etkinlik Detayları
            </h3>
            <div className="divide-y divide-primary/20 rounded-lg border border-primary/20 bg-slate-200/20 dark:divide-primary/30 dark:border-primary/30 dark:bg-slate-800/20">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-4 p-4">
                <p className="font-medium text-slate-600 dark:text-slate-400">
                  Tarih
                </p>
                <p className="md:col-span-2 text-slate-800 dark:text-slate-200">
                  {formatDate(event.eventDate)}
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-4 p-4">
                <p className="font-medium text-slate-600 dark:text-slate-400">
                  Konum
                </p>
                <p className="md:col-span-2 text-slate-800 dark:text-slate-200">
                  {event.eventLocation}
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-4 p-4">
                <p className="font-medium text-slate-600 dark:text-slate-400">
                  Toplam Maç Sayısı
                </p>
                <p className="md:col-span-2 text-slate-800 dark:text-slate-200">
                  {event.fights.length} maç
                </p>
              </div>
            </div>
          </div>
          <div>
            <FightCard fights={event.fights} />
          </div>
        </div>
      </div>
    </section>
  );
}

export default EventDetails;
