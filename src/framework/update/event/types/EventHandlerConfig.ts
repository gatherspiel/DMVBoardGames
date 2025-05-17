import type { EventHandlerData } from "./EventHandlerData.ts";

export interface EventHandlerConfig {
  eventHandler: (e: EventHandlerData) => any;
  stateToUpdate: string;
}
