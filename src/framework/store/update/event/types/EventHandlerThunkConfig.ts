import type { EventHandlerData } from "./EventHandlerData.ts";

export interface EventHandlerThunkConfig {
  eventHandler: (e: EventHandlerData) => any;
  storeToUpdate?: string; //If no value is provided then the component store name will automatically be used.
}
