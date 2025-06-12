import type { DisplayItem } from "./DisplayItem.ts";

export interface Convention extends DisplayItem {
  days: string[];
  name: string;
  url: string;
}
