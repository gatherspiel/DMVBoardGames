import { BaseThunk } from "../BaseThunk.ts";
import type { BaseDispatcher } from "../BaseDispatcher.ts";
import { EventHandlerAction } from "./EventHandlerAction.ts";
import type { EventValidationResult } from "./types/EventValidationResult.ts";

export class EventThunk extends BaseThunk {
  constructor(dataFetch: EventHandlerAction, dispatchers: BaseDispatcher[]) {
    super(dataFetch, dispatchers);
  }

  async processEvent(e: Event, validator?: (a: any) => EventValidationResult) {
    const response = await this.thunkAction.retrieveData(e);

    if (validator) {
      const validationResult: EventValidationResult = validator(response);

      if (validationResult.error) {
        return validationResult;
      }
    }

    this.updateStore(response);
  }
}
