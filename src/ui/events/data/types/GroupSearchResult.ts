import type { Event } from "./Event.ts";
import type { DisplayItem } from "./DisplayItem.ts";
export interface GroupSearchResult extends DisplayItem {
  events: Event[];
  locations: string[];
  summary: string;
  title: string;
  url: string;
}
