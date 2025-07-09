import type {FormSelector} from "../../../../framework/FormSelector.ts";
import {
  END_TIME_INPUT,
  EVENT_DESCRIPTION_INPUT, EVENT_LOCATION_INPUT,
  EVENT_NAME_INPUT,
  EVENT_URL_INPUT,
  START_DATE_INPUT,
  START_TIME_INPUT
} from "../../Constants.ts";

export function validateEventFormData(formSelector:FormSelector): string[] {
  const errorMessages = [];

  if(!formSelector.getValue(EVENT_NAME_INPUT)){
    errorMessages.push("Event name must be defined");
  }

  if(!formSelector.getValue(EVENT_DESCRIPTION_INPUT)){
    errorMessages.push("Event description must be defined");
  }

  if(!formSelector.getValue(EVENT_URL_INPUT)){
    errorMessages.push("Event url must be defined");
  } else {
    if(formSelector.getValue(EVENT_URL_INPUT).toLowerCase().startsWith("http")){
      errorMessages.push(`Invalid event url ${formSelector.getValue(EVENT_URL_INPUT)}`)
    }
  }

  if(!formSelector.getValue(START_DATE_INPUT)){
    errorMessages.push("Start date must be defined");
  }

  if(!formSelector.getValue(START_TIME_INPUT)){
    errorMessages.push("Start time must be defined");
  }

  if(!formSelector.getValue(END_TIME_INPUT)){
    errorMessages.push("End time must be defined");
  }

  if(!formSelector.getValue(EVENT_LOCATION_INPUT)){
    errorMessages.push("Event location must be defined");
  }

  return errorMessages;
}