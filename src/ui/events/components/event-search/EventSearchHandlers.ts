import {
  SEARCH_CITY_ID,
  SEARCH_COMPONENT_STATE,
  SEARCH_DAYS_ID,
  SEARCH_FORM_ID,
} from "./Constants.ts";
import { SEARCH_REQUEST_STATE } from "./Constants.ts";
import { getElementWithId } from "../../../../framework/components/utils/ComponentUtils.ts";
import type {
  EventHandlerConfig,
  EventHandlerData,
} from "../../../../framework/update/event/EventHandlerFactory.ts";
import { getElementWithSelector } from "../../../../framework/components/utils/ComponentUtils.ts";
export const SEARCH_EVENT_HANDLER_CONFIG: EventHandlerConfig = {
  eventName: "submit",
  selectorFunction: function (): Element {
    return getElementWithSelector(`#${SEARCH_FORM_ID}`);
  },
  eventHandler: function (params: EventHandlerData) {
    return {
      location: params.componentState.location,
      day: params.componentState.day,
    };
  },
  stateToUpdate: SEARCH_REQUEST_STATE,
};

export const UPDATE_CITY_CONFIG: EventHandlerConfig = {
  eventName: "change",
  selectorFunction: function (): Element {
    return getElementWithId(SEARCH_CITY_ID);
  },
  eventHandler: function (params: EventHandlerData) {
    return {
      location: (params.event?.target as HTMLInputElement).value,
    };
  },
  stateToUpdate: SEARCH_COMPONENT_STATE,
};

export const UPDATE_DAY_CONFIG: EventHandlerConfig = {
  eventName: "change",
  selectorFunction: function (): Element {
    return getElementWithId(SEARCH_DAYS_ID);
  },
  eventHandler: function (params: EventHandlerData) {
    return {
      day: (params.event?.target as HTMLInputElement).value,
    };
  },
  stateToUpdate: SEARCH_COMPONENT_STATE,
};
