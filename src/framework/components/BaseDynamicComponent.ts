import type { DisplayItem } from "../../ui/events/data/types/DisplayItem.ts";

import { createComponentStore } from "../store/ComponentStore.ts";
import { initStoreOnLoad } from "../store/RequestStore.ts";
import { EventHandlerAction } from "../reducer/event/EventHandlerAction.ts";
import { BaseDispatcher } from "../reducer/BaseDispatcher.ts";
import { EventReducer } from "../reducer/event/EventReducer.ts";
import type { EventHandlerReducerConfig } from "../reducer/event/types/EventHandlerReducerConfig.ts";
import type { BaseReducer } from "../reducer/BaseReducer.ts";

type EventConfig = {
  eventType: string;
  eventFunction: (e: Event) => any;
};

export abstract class BaseDynamicComponent extends HTMLElement {
  componentStoreName?: string;
  eventHandlers: Record<string, EventConfig>;
  eventTagIdCount = 0;

  instanceId: number;

  static instanceCount = 1;
  constructor(componentStoreName?: string, loadConfig?: any) {
    super();

    /*
    TODO: Remove this warning and make componentStoreName a required property once all instances of BaseDynamicComponent
    pass a store name in the constructor.
     */
    this.instanceId = BaseDynamicComponent.instanceCount;
    BaseDynamicComponent.instanceCount++;
    this.eventHandlers = {};
    if (componentStoreName) {
      this.componentStoreName = `${componentStoreName}-${BaseDynamicComponent.instanceCount}`;
      createComponentStore(this.componentStoreName, this);
    }

    if (loadConfig) {
      initStoreOnLoad(loadConfig);
    }
  }

  updateStore(data: any) {
    this.eventHandlers = {};
    this.eventTagIdCount = 0;

    this.generateAndSaveHTML(data);

    const eventHandlers = this.eventHandlers;
    const elementIdTag = this.getElementIdTag();

    document.querySelectorAll(`[${elementIdTag}]`).forEach(function (
      item: Element,
    ) {
      const id = item.getAttribute(elementIdTag) ?? "";
      const eventConfig = eventHandlers[id];
      item.addEventListener(eventConfig.eventType, eventConfig.eventFunction);
    });
  }

  generateAndSaveHTML(data: any) {
    this.innerHTML = this.render(data);
  }

  getElementIdTag() {
    return `data-${this.componentStoreName}-element-id`;
  }
  //TODO: Handle case where there are multiple instances of the same component for generating the ids for event handlers.
  saveEventHandler(
    eventFunction: (e: Event) => any,
    eventType: string,
    targetId?: string,
  ): string {
    let id = `${this.getElementIdTag()}=${this.eventTagIdCount}`;

    this.eventHandlers[this.eventTagIdCount] = {
      eventType: eventType,
      eventFunction: eventFunction,
    };
    this.eventTagIdCount++;

    if (targetId) {
      id += ` id=${targetId}`;
    }
    return id;
  }

  /**
   * Subscribes to a reducer. The state is currently shared among all instances of the component.
   * If there are multiple instances of a component that each need different state
   * @param reducer
   * @param reducerFunction
   */
  subscribeToReducer(
    reducer: BaseReducer,
    reducerFunction: (a: any) => any,
    field?: string,
  ) {
    if (!this.componentStoreName || this.componentStoreName.length === 0) {
      throw new Error(
        "Cannot subscribe to reducer. Component store name has not been defined.",
      );
    }
    console.log(
      "Subscribing component to store with name:" + this.componentStoreName,
    );
    reducer.subscribeComponent(this.componentStoreName, reducerFunction, field);
  }

  createOnChangeEvent(eventConfig: any) {
    const eventHandler = BaseDynamicComponent.createHandler(
      eventConfig,
      this?.componentStoreName,
    );
    return this.saveEventHandler(eventHandler, "change");
  }

  createSubmitEvent(eventConfig: any) {
    const eventHandler = BaseDynamicComponent.createHandler(
      eventConfig,
      this?.componentStoreName,
    );
    return this.saveEventHandler(eventHandler, "submit");
  }

  createClickEvent(eventConfig: any, id?: string) {
    console.log(this.componentStoreName);
    const eventHandler = BaseDynamicComponent.createHandler(
      eventConfig,
      this?.componentStoreName,
    );
    return this.saveEventHandler(eventHandler, "click", id);
  }

  static createHandler(
    eventConfig: EventHandlerReducerConfig,
    componentStoreName?: string,
  ) {
    console.log(componentStoreName);
    console.log(eventConfig.storeToUpdate);
    const handler = function (e: Event) {
      const storeToUpdate =
        eventConfig?.storeToUpdate && eventConfig.storeToUpdate.length > 0
          ? eventConfig.storeToUpdate
          : componentStoreName;
      if (!storeToUpdate) {
        throw new Error("Event handler must be associated with a valid state");
      }
      e.preventDefault();
      const request: EventHandlerAction = new EventHandlerAction(
        eventConfig.eventHandler,
        componentStoreName,
      );

      const storeUpdate = new BaseDispatcher(storeToUpdate, (a: any): any => {
        return a;
      });
      const eventUpdater: EventReducer = new EventReducer(request, [
        storeUpdate,
      ]);
      eventUpdater.processEvent(e);
    };

    return handler;
  }

  abstract render(data: Record<any, DisplayItem> | any): string;
}
