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
  link: string;
  title: string;
  summary: string;
}

export interface Convention {
  id: number;
  link: string
  title: string;
  days: string[];
}

export interface GameStore {
  id: number;
  location: string;
  name: string;
  link: string;
}
