import type { EventHandlerData } from "./EventHandlerData.ts";

export interface EventHandlerReducerConfig {
  eventHandler: (e: EventHandlerData) => any;
  storeToUpdate: string;
}
