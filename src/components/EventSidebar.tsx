import { MdChevronRight } from "react-icons/md";
import type { Event } from "../types";

interface EventSidebarProps {
  events: Event[];
  selectedEventId: string;
  onEventSelect: (eventId: string) => void;
}

function EventSidebar({
  events,
  selectedEventId,
  onEventSelect,
}: EventSidebarProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("tr-TR", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <aside className="flex w-full md:w-80 shrink-0 flex-col border-r border-primary/20 dark:border-primary/30 h-full">
      <h2 className="px-4 pb-3 pt-5 text-xl font-bold text-slate-900 dark:text-white flex-shrink-0">
        Etkinlikler
      </h2>
      <div className="flex-1 overflow-y-auto min-h-0">
        <nav className="flex flex-col gap-1 p-2">
          {events.map((event) => {
            const isActive = event.id === selectedEventId;
            return (
              <button
                key={event.id}
                onClick={() => onEventSelect(event.id)}
                className={`group flex cursor-pointer items-center justify-between rounded-lg px-3 md:px-4 py-3 text-left transition-colors ${
                  isActive
                    ? "bg-primary/10 text-primary dark:bg-primary/20"
                    : "text-slate-700 hover:bg-slate-200/50 dark:text-slate-300 dark:hover:bg-slate-800/50"
                }`}
              >
                <div className="flex flex-col min-w-0 flex-1">
                  <p className="font-medium truncate">{event.eventTitle}</p>
                  <p
                    className={`text-sm truncate ${
                      isActive
                        ? "text-primary/80 dark:text-primary/70"
                        : "text-slate-500"
                    }`}
                  >
                    {event.eventLocation}
                  </p>
                  <p
                    className={`text-xs ${
                      isActive
                        ? "text-primary/60 dark:text-primary/50"
                        : "text-slate-400"
                    }`}
                  >
                    {formatDate(event.eventDate)}
                  </p>
                </div>
                <div
                  className={`opacity-0 transition-opacity group-hover:opacity-100 ${
                    isActive ? "opacity-100" : "text-slate-400"
                  }`}
                >
                  <MdChevronRight size={20} />
                </div>
              </button>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}

export default EventSidebar;
