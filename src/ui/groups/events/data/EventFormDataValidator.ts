import type {FormSelector} from "@bponnaluri/places-js";
import {
  END_TIME_INPUT,
  EVENT_DESCRIPTION_INPUT, EVENT_LOCATION_INPUT,
  EVENT_NAME_INPUT,
  EVENT_URL_INPUT,
  START_DATE_INPUT,
  START_TIME_INPUT
} from "../../Constants.ts";
import {combineDateAndTime, validateAddress, validateDateFormat} from "@bponnaluri/places-js";

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
    if(!formSelector.getValue(EVENT_URL_INPUT).toLowerCase().startsWith("http")){
      errorMessages.push(`Invalid event url ${formSelector.getValue(EVENT_URL_INPUT)}`)
    }
  }

  const startDate = formSelector.getValue(START_DATE_INPUT)
  const startTime = formSelector.getValue(START_TIME_INPUT)
  const endTime = formSelector.getValue(END_TIME_INPUT)

  if(!startDate){
    errorMessages.push("Start date must be defined");
  }

  if(!startTime){
    errorMessages.push("Start time must be defined");
  }

  if(!endTime){
    errorMessages.push("End time must be defined");
  }

  if(startDate && startTime && endTime) {
    try {
      validateDateFormat(startDate)
      combineDateAndTime(startDate, startTime)
    } catch (e:any){
      errorMessages.push(e.message)
    }
  }

  if(!formSelector.getValue(EVENT_LOCATION_INPUT)){
    errorMessages.push("Event location must be defined");
  } else {
    try {
      validateAddress(formSelector.getValue(EVENT_LOCATION_INPUT));
    } catch(e: any){
      errorMessages.push(e.message);
    }
  }

  return errorMessages;
}