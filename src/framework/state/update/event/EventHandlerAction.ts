import { getComponentStore } from "../../data/ComponentStore.ts";
import type {FormSelector} from "../../../FormSelector.ts";

export class EventHandlerAction {
  eventHandler: (a: any, componentStore?: any) => any;
  eventComponentStoreName?: string;
  formSelector?:FormSelector
  constructor(
    eventHandler: (a: any) => any,
    componentStoreName?: string,
    formSelector?:FormSelector
  ) {
    this.eventHandler = eventHandler;
    this.eventComponentStoreName = componentStoreName;
    this.formSelector = formSelector;
  }

  retrieveData(params: Event): any {
    const formSelector = this.formSelector;
    if (this.eventComponentStoreName) {
      return this.eventHandler({
        event: params,
        componentStore: getComponentStore(this.eventComponentStoreName),
        targetId: (params.target as HTMLElement).id,
        formSelector: formSelector
      });
    }
    return this.eventHandler({
      event: params,
    });
  }
}
