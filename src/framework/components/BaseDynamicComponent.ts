import type { DisplayItem } from "../../ui/events/data/types/DisplayItem.ts";

import { createComponentStore } from "../store/ComponentStore.ts";
import { initStoreOnLoad } from "../store/RequestStore.ts";
import { EventHandlerAction } from "../update/event/EventHandlerAction.ts";
import { BaseDispatcher } from "../update/BaseDispatcher.ts";
import { EventReducer } from "../update/event/EventReducer.ts";
import type { EventHandlerReducerConfig } from "../update/event/types/EventHandlerReducerConfig.ts";

type EventConfig = {
  eventType: string;
  eventFunction: (e: Event) => any;
};

export abstract class BaseDynamicComponent extends HTMLElement {
  componentStoreName?: string;
  eventHandlers: Record<string, EventConfig>;
  idCount = 0;

  constructor(componentStoreName?: string, loadConfig?: any) {
    super();
    this.eventHandlers = {};
    if (componentStoreName) {
      this.componentStoreName = componentStoreName;
      createComponentStore(componentStoreName, this);
    }

    if (loadConfig) {
      initStoreOnLoad(loadConfig);
    }
  }

  updateStore(data: any) {
    this.eventHandlers = {};
    this.idCount = 0;

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
    let id = `${this.getElementIdTag()}=${this.idCount}`;

    this.eventHandlers[this.idCount] = {
      eventType: eventType,
      eventFunction: eventFunction,
    };
    this.idCount++;

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
    componentStateName?: string,
  ) {
    const handler = function (e: Event) {
      e.preventDefault();
      const request: EventHandlerAction = new EventHandlerAction(
        eventConfig.eventHandler,
        componentStateName,
      );

      const stateUpdate = new BaseDispatcher(
        eventConfig.storeToUpdate,
        (a: any): any => {
          return a;
        },
      );
      const eventUpdater: EventReducer = new EventReducer(request, [
        stateUpdate,
      ]);
      eventUpdater.processEvent(e);
    };

    return handler;
  }

  abstract render(data: Record<any, DisplayItem> | any): string;
}
