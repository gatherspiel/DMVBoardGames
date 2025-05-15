import type { DisplayItem } from "../../ui/events/data/types/DisplayItem.ts";

export abstract class BaseDynamicComponent extends HTMLElement {
  abstract updateData(data: any): void;
  abstract generateHTML(data: Record<any, DisplayItem> | any): string;
}
