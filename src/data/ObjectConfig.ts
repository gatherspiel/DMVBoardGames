export interface Event {
  title: string;
  dayOfWeek: number;
  location: string;
  summary: string;
}

export interface Group {
  events: Event[];
  link: string;
  title: string;
  summary: string;
}

export interface Convention {
  title: string;
  date: Date;
}

export interface EventListingData {
  groups: Group[];
  conventions: Convention[];
}
