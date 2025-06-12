import { BaseThunk } from "../BaseThunk.ts";
import type { BaseDispatcher } from "../BaseDispatcher.ts";
import { EventHandlerAction } from "./EventHandlerAction.ts";

export class EventThunk extends BaseThunk {
  constructor(dataFetch: EventHandlerAction, dispatchers: BaseDispatcher[]) {
    super(dataFetch, dispatchers);
  }

  async processEvent(e: Event) {
    const response = await this.thunkAction.retrieveData(e);
    this.updateStore(response);
  }
}
