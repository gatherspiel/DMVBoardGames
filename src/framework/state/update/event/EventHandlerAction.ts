import type {FormSelector} from "../../../FormSelector.ts";
import type {BaseDynamicComponent} from "../../../components/BaseDynamicComponent.ts";

export class EventHandlerAction {
  #eventHandler: (a: any, componentStore?: any) => any;
  #component?: BaseDynamicComponent
  #formSelector?:FormSelector;
  #params: any;
  constructor(
    eventHandler: (a: any) => any,
    component?: BaseDynamicComponent,
    formSelector?:FormSelector,
    params?: any
  ) {
    this.#eventHandler = eventHandler;
    this.#component = component;
    this.#formSelector = formSelector;
    this.#params = params;
  }

  retrieveData(event: Event): any {

    const formSelector = this.#formSelector;
    if (this.#component) {
      return this.#eventHandler({
        event: event,
        componentStore: this.#component.getComponentStore(),
        targetId: (event.target as HTMLElement).id,
        formSelector: formSelector,
        params: this.#params
      });
    }
    return this.#eventHandler({
      event: event,
    });
  }
}
