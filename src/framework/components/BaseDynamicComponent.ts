import type { DisplayItem } from "../../ui/events/data/types/DisplayItem.ts";
import {
  createEvents,
  type EventHandlerConfig,
} from "../update/event/EventHandlerFactory.ts";
import { createComponentState } from "../state/ComponentStateManager.ts";
import { initStateOnLoad } from "../state/RequestStateManager.ts";
export abstract class BaseDynamicComponent extends HTMLElement {
  eventHandlerConfigs: EventHandlerConfig[];

  componentStateName?: string;

  constructor(
    eventHandlerConfigs?: EventHandlerConfig[],
    componentStateName?: string,
    loadConfig?: any,
  ) {
    super();
    this.eventHandlerConfigs = eventHandlerConfigs ?? [];

    if (componentStateName) {
      this.componentStateName = componentStateName;
      createComponentState(componentStateName, this);
    }

    if (loadConfig) {
      initStateOnLoad(loadConfig);
    }
  }

  updateData(data: any) {
    this.innerHTML = this.generateHTML(data);
    createEvents(this.eventHandlerConfigs, this?.componentStateName);
  }

  abstract generateHTML(data: Record<any, DisplayItem> | any): string;
}
