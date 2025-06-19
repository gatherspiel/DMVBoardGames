import type { EventHandlerData } from "./EventHandlerData.ts";
import type { EventValidationResult } from "./EventValidationResult.ts";

export interface EventHandlerThunkConfig {
  componentReducer?: (a: any) => any; //Reducer function
  eventHandler: (e: EventHandlerData) => any;
  requestStoreToUpdate?: string;
  validator?: (
    eventHandlerResult: any,
    componentStore: any,
  ) => EventValidationResult;
}
