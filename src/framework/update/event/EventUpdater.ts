import { BaseUpdater } from "../BaseUpdater.ts";
import type { BaseStateUpdate } from "../BaseStateUpdate.ts";
import { EventHandlerRequest } from "./EventHandlerRequest.ts";

export class EventUpdater extends BaseUpdater {
  constructor(dataFetch: EventHandlerRequest, stateUpdate: BaseStateUpdate[]) {
    super(dataFetch, stateUpdate);
  }

  async processEvent(e: Event) {
    const response = await this.dataFetch.retrieveData(e);
    this.updateData(response);
  }
}
