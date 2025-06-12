import type { EventHandlerData } from "./EventHandlerData.ts";

export interface EventHandlerThunkConfig {
  eventHandler: (e: EventHandlerData) => any;
  storeToUpdate?: string;
  componentReducer?: (a: any) => any; //Reducer function if the
}
