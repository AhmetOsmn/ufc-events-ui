export interface Fighter {
  name: string;
  country: string;
  ranking?: number; // nullable int, TypeScript'te optional olarak tanımlanır
  record: string; // örn: "22-3-0"
}

export interface Fight {
  weightClass: string; // örn: "Lightweight", "Heavyweight"
  order: number; // dövüş sırası
  fighters: Fighter[];
}

export interface Event {
  id: string;
  eventDate: string; // ISO string formatında tarih
  eventTitle: string;
  eventLocation: string;
  fights: Fight[];
}

// API Response formatı
export interface ApiResponse<T> {
  message: string;
  data: T | null;
}
