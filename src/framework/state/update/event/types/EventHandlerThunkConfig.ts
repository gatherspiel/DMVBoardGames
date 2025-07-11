import type { EventHandlerData } from "./EventHandlerData.ts";
import type { EventValidationResult } from "./EventValidationResult.ts";
import type {FormSelector} from "../../../../FormSelector.ts";

export interface EventHandlerThunkConfig {
  componentReducer?: (a: any) => any; //Reducer function
  eventHandler: (e: EventHandlerData) => any;
  requestStoreToUpdate?: string;
  validator?: (
    formSelector: FormSelector,
    componentData: any) => EventValidationResult;
}
