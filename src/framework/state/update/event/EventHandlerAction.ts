import { getComponentStore } from "../../data/ComponentStore.ts";
import type {FormSelector} from "../../../FormSelector.ts";

export class EventHandlerAction {
  eventHandler: (a: any, componentStore?: any) => any;
  eventComponentStoreName?: string;
  shadowRoot?: ShadowRoot;
  formSelector?:FormSelector
  constructor(
    eventHandler: (a: any) => any,
    componentStoreName?: string,
    shadowRoot?: ShadowRoot,
    formSelector?:FormSelector
  ) {
    this.eventHandler = eventHandler;
    this.eventComponentStoreName = componentStoreName;
    this.shadowRoot = shadowRoot;
    this.formSelector = formSelector;
  }

  retrieveData(params: Event): any {
    const shadowRoot = this.shadowRoot;
    const formSelector = this.formSelector;
    if (this.eventComponentStoreName) {
      return this.eventHandler({
        event: params,
        componentStore: getComponentStore(this.eventComponentStoreName),
        targetId: (params.target as HTMLElement).id,
        shadowRoot: shadowRoot,
        formSelector
      });
    }
    return this.eventHandler({
      event: params,
    });
  }
}
