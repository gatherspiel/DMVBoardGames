import { EventUpdater } from "./EventUpdater.ts";
import { EventHandlerRequest } from "./EventHandlerRequest.ts";
import { BaseStateUpdate } from "../BaseStateUpdate.ts";

export interface EventHandlerData {
  event?: Event;
  componentState?: any;
}

export interface EventHandlerConfig {
  eventName: string;
  selectorFunction: () => Element;
  eventHandler: (e: EventHandlerData) => any;
  stateToUpdate: string;
}

export function createEvents(
  eventData: EventHandlerConfig[],
  componentStateName?: string,
) {
  eventData.forEach(function (eventConfig: EventHandlerConfig) {
    const element: Element = eventConfig.selectorFunction();

    const eventHandlerRequest = new EventHandlerRequest(
      eventConfig.eventHandler,
      componentStateName,
    );

    //TODO: Figure out if state exists as a request state or a component state and update accordingly?

    const stateUpdate = new BaseStateUpdate(
      eventConfig.stateToUpdate,
      (a: any): any => {
        return a;
      },
    );

    new EventUpdater(
      eventHandlerRequest,
      [stateUpdate],
      element,
      eventConfig.eventName,
    );
  });
}
