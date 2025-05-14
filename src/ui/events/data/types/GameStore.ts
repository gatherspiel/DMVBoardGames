import type { DisplayItem } from "./DisplayItem.ts";

export interface GameStore extends DisplayItem {
  location: String;
  name: String;
  url: String;
}
