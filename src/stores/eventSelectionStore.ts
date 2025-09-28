import { create } from "zustand";
import type { Event } from "../types";

interface EventSelectionState {
  // Event verileri
  events: Event[];
  isEventsLoading: boolean;
  eventsError: string | null;

  // Seçim durumu
  selectedEventIds: string[];

  // Actions
  setEvents: (events: Event[]) => void;
  setEventsLoading: (loading: boolean) => void;
  setEventsError: (error: string | null) => void;

  // Event seçim actions
  toggleEventSelection: (eventId: string) => void;
  selectAllEvents: () => void;
  clearAllSelections: () => void;
  setSelectedEventIds: (ids: string[]) => void;

  // Computed getters
  getSelectedEvents: () => Event[];
  isAllSelected: () => boolean;
  isSomeSelected: () => boolean;
  getSelectionText: () => string;
}

export const useEventSelectionStore = create<EventSelectionState>(
  (set, get) => ({
    // Initial state
    events: [],
    isEventsLoading: false,
    eventsError: null,
    selectedEventIds: [],

    // Event data actions
    setEvents: (events) => set({ events }),
    setEventsLoading: (isEventsLoading) => set({ isEventsLoading }),
    setEventsError: (eventsError) => set({ eventsError }),

    // Selection actions
    toggleEventSelection: (eventId) =>
      set((state) => ({
        selectedEventIds: state.selectedEventIds.includes(eventId)
          ? state.selectedEventIds.filter((id) => id !== eventId)
          : [...state.selectedEventIds, eventId],
      })),

    selectAllEvents: () =>
      set((state) => ({
        selectedEventIds: state.events.map((event) => event.id),
      })),

    clearAllSelections: () => set({ selectedEventIds: [] }),

    setSelectedEventIds: (selectedEventIds) => set({ selectedEventIds }),

    // Computed getters
    getSelectedEvents: () => {
      const { events, selectedEventIds } = get();
      return events.filter((event) => selectedEventIds.includes(event.id));
    },

    isAllSelected: () => {
      const { events, selectedEventIds } = get();
      return events.length > 0 && selectedEventIds.length === events.length;
    },

    isSomeSelected: () => {
      const { selectedEventIds } = get();
      return selectedEventIds.length > 0;
    },

    getSelectionText: () => {
      const { events, selectedEventIds } = get();

      if (events.length === 0) {
        return "Eventler yükleniyor...";
      }

      if (selectedEventIds.length === 0) {
        return "Event seçin";
      }

      if (selectedEventIds.length === events.length) {
        return "Tüm eventler";
      }

      return `${selectedEventIds.length} event seçili`;
    },
  })
);
