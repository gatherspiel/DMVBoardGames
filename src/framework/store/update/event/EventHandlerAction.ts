import { getComponentStore } from "../../data/ComponentStore.ts";

export class EventHandlerAction {
  eventHandler: (a: any, componentStore?: any) => any;
  eventComponentStoreName?: string;
  shadowRoot?: ShadowRoot;
  constructor(
    eventHandler: (a: any) => any,
    componentStoreName?: string,
    shadowRoot?: ShadowRoot,
  ) {
    this.eventHandler = eventHandler;
    this.eventComponentStoreName = componentStoreName;
    this.shadowRoot = shadowRoot;
  }

  retrieveData(params: Event): any {
    const shadowRoot = this.shadowRoot;
    if (this.eventComponentStoreName) {
      return this.eventHandler({
        event: params,
        componentStore: getComponentStore(this.eventComponentStoreName),
        targetId: (params.target as HTMLElement).id,
        shadowRoot: shadowRoot,
      });
    }
    return this.eventHandler({
      event: params,
    });
  }
}
