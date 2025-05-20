import { BaseReducer } from "../BaseReducer.ts";
import type { BaseDispatcher } from "../BaseDispatcher.ts";
import { EventHandlerAction } from "./EventHandlerAction.ts";

export class EventReducer extends BaseReducer {
  constructor(dataFetch: EventHandlerAction, dispatchers: BaseDispatcher[]) {
    super(dataFetch, dispatchers);
  }

  async processEvent(e: Event) {
    const response = await this.reducerAction.retrieveData(e);
    this.updateStore(response);
  }
}
