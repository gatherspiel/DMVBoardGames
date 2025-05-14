import type { DisplayItem } from "./DisplayItem.ts";
import type { Event } from "./Event.ts";

export interface GroupPageData extends DisplayItem {
  name: string;
  summary: string;
  url: string;
  eventData: Event[];
}
