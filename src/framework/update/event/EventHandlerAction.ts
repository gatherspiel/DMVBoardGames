import { getComponentStore } from "../../store/ComponentStore.ts";

export class EventHandlerAction {
  eventHandler: (a: any, componentStore?: any) => any;
  eventComponentStoreName?: string;

  constructor(eventHandler: (a: any) => any, componentStoreName?: string) {
    this.eventHandler = eventHandler;
    this.eventComponentStoreName = componentStoreName;
  }

  retrieveData(params: Event): any {
    if (this.eventComponentStoreName) {
      return this.eventHandler({
        event: params,
        componentState: getComponentStore(this.eventComponentStoreName),
        targetId: (params.target as HTMLElement).id,
      });
    }
    return this.eventHandler({
      event: params,
    });
  }
}
