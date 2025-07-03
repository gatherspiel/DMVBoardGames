import type { DisplayItem } from "./DisplayItem.ts";

export interface GameRestaurant extends DisplayItem {
  location: string;
  name: string;
  url: string;
}
