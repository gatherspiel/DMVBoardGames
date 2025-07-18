import { getComponentStore } from "../../data/ComponentStore.ts";
import type {FormSelector} from "../../../FormSelector.ts";

export class EventHandlerAction {
  eventHandler: (a: any, componentStore?: any) => any;
  eventComponentStoreName?: string;
  formSelector?:FormSelector;
  params: any;
  constructor(
    eventHandler: (a: any) => any,
    componentStoreName?: string,
    formSelector?:FormSelector,
    params?: any
  ) {
    this.eventHandler = eventHandler;
    this.eventComponentStoreName = componentStoreName;
    this.formSelector = formSelector;
    this.params = params;
  }

  retrieveData(event: Event): any {
    console.log(this.params);
    const formSelector = this.formSelector;
    if (this.eventComponentStoreName) {
      return this.eventHandler({
        event: event,
        componentStore: getComponentStore(this.eventComponentStoreName),
        targetId: (event.target as HTMLElement).id,
        formSelector: formSelector,
        params: this.params
      });
    }
    console.log("Test");
    return this.eventHandler({
      event: event,
    });
  }
}
