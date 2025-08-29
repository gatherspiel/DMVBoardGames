import {
  type BaseDynamicComponent,
  validateAddress,
  validateDateFormat
} from "@bponnaluri/places-js";
import {
  END_TIME_INPUT,
  EVENT_DESCRIPTION_INPUT, EVENT_LOCATION_INPUT,
  EVENT_NAME_INPUT, EVENT_URL_INPUT,
  START_DATE_INPUT, START_TIME_INPUT,
} from "../Constants.ts";
import {combineDateAndTime} from "@bponnaluri/places-js";
import {getUrlParameter} from "@bponnaluri/places-js";

export function getEventDetailsFromForm(component:BaseDynamicComponent){
  const startDate = component.getFormValue(START_DATE_INPUT)
  const startTime =  component.getFormValue(START_TIME_INPUT)
  const endTime =   component.getFormValue(END_TIME_INPUT)
  return  {
    id: component.getComponentStore().id,
    groupId: getUrlParameter("groupId"),
    name: component.getFormValue(EVENT_NAME_INPUT),
    description: component.getFormValue(EVENT_DESCRIPTION_INPUT),
    url: component.getFormValue(EVENT_URL_INPUT),
    startTime: combineDateAndTime(startDate, startTime),
    endTime: combineDateAndTime(startDate, endTime),
    location: component.getFormValue(EVENT_LOCATION_INPUT),
  };
}


export function validateEventFormData(component:BaseDynamicComponent) {
  const errorMessages = [];

  if(!component.getFormValue(EVENT_NAME_INPUT)){
    errorMessages.push("Event name must be defined");
  }

  if(!component.getFormValue(EVENT_DESCRIPTION_INPUT)){
    errorMessages.push("Event description must be defined");
  }

  if(!component.getFormValue(EVENT_URL_INPUT)){
    errorMessages.push("Event url must be defined");
  } else {
    if(!component.getFormValue(EVENT_URL_INPUT).toLowerCase().startsWith("http")){
      errorMessages.push(`Invalid event url ${component.getFormValue(EVENT_URL_INPUT)}`)
    }
  }

  const startDate = component.getFormValue(START_DATE_INPUT);
  const startTime = component.getFormValue(START_TIME_INPUT);
  const endTime = component.getFormValue(END_TIME_INPUT);

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

  if(!component.getFormValue(EVENT_LOCATION_INPUT)){
    errorMessages.push("Event location must be defined");
  } else {
    try {
      validateAddress(component.getFormValue(EVENT_LOCATION_INPUT));
    } catch(e: any){
      errorMessages.push(e.message);
    }
  }
  return {
    "errorMessage": errorMessages
  }
}
