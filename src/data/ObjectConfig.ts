export interface Event {
  id: number;
  title: string;
  day: string;
  location: string;
  summary: string;
}

export interface Group {
  id: number;
  events: Event[];
  locations: string;
  link: string;
  title: string;
  summary: string;
}

export interface Convention {
  id: number;
  link: string;
  title: string;
  days: string[];
}

export interface GameStore {
  id: number;
  location: string;
  name: string;
  link: string;
}

export interface GameRestaurant {
  id: number;
  location: string;
  name: string;
  link: string;
}
