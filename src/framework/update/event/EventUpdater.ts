import { BaseUpdater } from "../BaseUpdater.ts";
import type { BaseStateUpdate } from "../BaseStateUpdate.ts";
import { EventHandlerRequest } from "./EventHandlerRequest.ts";

export class EventUpdater extends BaseUpdater {
  constructor(
    dataFetch: EventHandlerRequest,
    stateUpdate: BaseStateUpdate[],
    element: Element,
    eventName: string,
  ) {
    super(dataFetch, stateUpdate);

    const retrieveData = async (e: Event) => {
      e.preventDefault();

      const data = await this.retrieveData(e);
      this.updateData(data);
    };
    element.addEventListener(eventName, (e: Event) => retrieveData(e));
  }

  async retrieveData(e: Event) {
    return this.dataFetch.retrieveData(e);
  }
}
