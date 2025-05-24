import type { DisplayItem } from "../../ui/events/data/types/DisplayItem.ts";

import {
  createComponentStore,
  hasComponentStoreSubscribers,
} from "../store/ComponentStore.ts";
import {
  hasRequestStoreSubscribers,
  initRequestStoresOnLoad,
} from "../store/RequestStore.ts";
import { EventHandlerAction } from "../reducer/event/EventHandlerAction.ts";
import { BaseDispatcher } from "../reducer/BaseDispatcher.ts";
import { EventReducer } from "../reducer/event/EventReducer.ts";
import type { EventHandlerReducerConfig } from "../reducer/event/types/EventHandlerReducerConfig.ts";
import type {
  ComponentLoadConfig,
  ReducerFunctionConfig,
} from "./types/ComponentLoadConfig.ts";

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

  //TODO: Consider passing reducers here.
  constructor(componentStoreName: string, loadConfig?: ComponentLoadConfig) {
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
      initRequestStoresOnLoad(loadConfig);
      const componentStoreName = this.componentStoreName;
      if (!componentStoreName || componentStoreName.length === 0) {
        throw new Error(
          "Cannot subscribe to reducer. Component store name has not been defined.",
        );
      }

      // TODO: Handle case where there are multiple instances of a component that each need different state
      if (loadConfig.reducerSubscriptions) {
        loadConfig.reducerSubscriptions.forEach(function (
          config: ReducerFunctionConfig,
        ) {
          config.reducer.subscribeComponent(
            componentStoreName,
            config.reducerFunction,
            config.reducerField,
          );
        });
      }
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
  //TODO: Handle case where there are multiple instances of the same component when generating the ids for event handlers.
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
    const eventHandler = BaseDynamicComponent.createHandler(
      eventConfig,
      this?.componentStoreName,
    );
    return this.saveEventHandler(eventHandler, "click", id);
  }

  static createHandler(
    eventConfig: EventHandlerReducerConfig,
    storeName?: string,
  ) {
    const storeToUpdate =
      eventConfig?.storeToUpdate && eventConfig.storeToUpdate.length > 0
        ? eventConfig.storeToUpdate
        : storeName;
    if (!storeToUpdate) {
      throw new Error("Event handler must be associated with a valid state");
    }

    const handler = function (e: Event) {
      if (
        !hasRequestStoreSubscribers(storeToUpdate) &&
        !hasComponentStoreSubscribers(storeToUpdate)
      ) {
        throw new Error(`No subscribers for store ${storeToUpdate}`);
      }

      e.preventDefault();
      const request: EventHandlerAction = new EventHandlerAction(
        eventConfig.eventHandler,
        storeName,
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
