import { getComponentState } from "../../state/ComponentStateManager.ts";

export class EventHandlerRequest {
  eventHandler: (a: any, componentState?: any) => any;
  componentStateName?: string;

  constructor(eventHandler: (a: any) => any, componentStateName?: string) {
    this.eventHandler = eventHandler;
    this.componentStateName = componentStateName;
  }

  retrieveData(params: Event): any {
    if (this.componentStateName) {
      return this.eventHandler({
        event: params,
        componentState: getComponentState(this.componentStateName),
      });
    }
    return this.eventHandler({
      event: params,
    });
  }
}
