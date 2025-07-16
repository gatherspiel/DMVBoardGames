import { BaseThunk } from "../BaseThunk.ts";
import type { BaseDispatcher } from "../BaseDispatcher.ts";
import { EventHandlerAction } from "./EventHandlerAction.ts";
import type { EventValidationResult } from "./types/EventValidationResult.ts";

export class EventThunk extends BaseThunk {
  constructor(dataFetch: EventHandlerAction, dispatchers: BaseDispatcher[]) {
    super(dataFetch, dispatchers);
  }

  async processEvent(e: Event, validator?: () => EventValidationResult) {
    if (validator) {
      const validationResult: EventValidationResult = validator();

      if (validationResult.errorMessage) {
        return validationResult;
      }
    }
    const response = await this.thunkAction.retrieveData(e);
    this.updateStore(response);
  }
}
