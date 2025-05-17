import type { DisplayItem } from "../../ui/events/data/types/DisplayItem.ts";

import { createComponentState } from "../state/ComponentStateManager.ts";
import { initStateOnLoad } from "../state/RequestStateManager.ts";
import { EventHandlerRequest } from "../update/event/EventHandlerRequest.ts";
import { BaseStateUpdate } from "../update/BaseStateUpdate.ts";
import { EventUpdater } from "../update/event/EventUpdater.ts";
import type { EventHandlerConfig } from "../update/event/types/EventHandlerConfig.ts";

type EventConfig = {
  eventType: string;
  eventFunction: (e: Event) => any;
};

export abstract class BaseDynamicComponent extends HTMLElement {
  componentStateName?: string;
  eventHandlers: Record<string, EventConfig>;
  idCount = 0;

  constructor(componentStateName?: string, loadConfig?: any) {
    super();

    this.eventHandlers = {};
    if (componentStateName) {
      this.componentStateName = componentStateName;
      createComponentState(componentStateName, this);
    }

    if (loadConfig) {
      initStateOnLoad(loadConfig);
    }
  }

  updateData(data: any) {
    this.eventHandlers = {};
    this.idCount = 0;
    this.innerHTML = this.generateHTML(data);

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

  getElementIdTag() {
    return `data-${this.componentStateName}-element-id`;
  }
  //TODO: Handle case where there are multiple instances of the same component for generating the ids for event handlers.
  saveEventHandler(
    eventFunction: (e: Event) => any,
    eventType: string,
  ): string {
    const id = `${this.getElementIdTag()}=${this.idCount}`;

    this.eventHandlers[this.idCount] = {
      eventType: eventType,
      eventFunction: eventFunction,
    };
    this.idCount++;
    return id;
  }

  createOnChangeEvent(eventConfig: any) {
    const eventHandler = BaseDynamicComponent.createHandler(
      eventConfig,
      this?.componentStateName,
    );
    return this.saveEventHandler(eventHandler, "change");
  }

  createSubmitEvent(eventConfig: any) {
    const eventHandler = BaseDynamicComponent.createHandler(
      eventConfig,
      this?.componentStateName,
    );

    return this.saveEventHandler(eventHandler, "submit");
  }

  static createHandler(
    eventConfig: EventHandlerConfig,
    componentStateName?: string,
  ) {
    const handler = function (e: Event) {
      e.preventDefault();
      const request: EventHandlerRequest = new EventHandlerRequest(
        eventConfig.eventHandler,
        componentStateName,
      );

      const stateUpdate = new BaseStateUpdate(
        eventConfig.stateToUpdate,
        (a: any): any => {
          return a;
        },
      );
      const eventUpdater: EventUpdater = new EventUpdater(request, [
        stateUpdate,
      ]);
      eventUpdater.processEvent(e);
    };

    return handler;
  }

  abstract generateHTML(data: Record<any, DisplayItem> | any): string;
}
