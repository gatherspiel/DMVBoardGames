import type { DisplayItem } from "./DisplayItem.ts";

export interface GameStore extends DisplayItem {
  location: string;
  name: string;
  url: string;
}
