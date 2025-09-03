
import {
  END_TIME_INPUT,
  EVENT_DESCRIPTION_INPUT, EVENT_LOCATION_INPUT,
  EVENT_NAME_INPUT, EVENT_URL_INPUT,
  START_DATE_INPUT, START_TIME_INPUT,
} from "../Constants.ts";
import {combineDateAndTime, validateAddress, validateDateFormat} from "../../../shared/DateUtils.ts";

export function getEventDetailsFromForm(formData:Record<string,string>){
  const startDate = formData[START_DATE_INPUT]
  const startTime =  formData[START_TIME_INPUT]
  const endTime =   formData[END_TIME_INPUT]
  return  {
    id:formData.id,
    groupId:(new URLSearchParams(document.location.search)).get("groupId") ?? "",
    name: formData[EVENT_NAME_INPUT],
    description: formData[EVENT_DESCRIPTION_INPUT],
    url: formData[EVENT_URL_INPUT],
    startTime: combineDateAndTime(startDate, startTime),
    endTime: combineDateAndTime(startDate, endTime),
    location: formData[EVENT_LOCATION_INPUT],
  };
}

export function validateEventFormData(formData:Record<string,string>) {
  const errorMessages = [];

  if(!formData[EVENT_NAME_INPUT]){
    errorMessages.push("Event name must be defined");
  }

  if(!formData[EVENT_DESCRIPTION_INPUT]){
    errorMessages.push("Event description must be defined");
  }

  if(!formData[EVENT_URL_INPUT]){
    errorMessages.push("Event url must be defined");
  } else {
    if(!formData[EVENT_URL_INPUT].toLowerCase().startsWith("http")){
      errorMessages.push(`Invalid event url ${formData[EVENT_URL_INPUT]}`)
    }
  }

  const startDate = formData[START_DATE_INPUT];
  const startTime = formData[START_TIME_INPUT];
  const endTime = formData[END_TIME_INPUT];

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

  if(!formData[EVENT_LOCATION_INPUT]){
    errorMessages.push("Event location must be defined");
  } else {
    try {
      validateAddress(formData[EVENT_LOCATION_INPUT]);
    } catch(e: any){
      errorMessages.push(e.message);
    }
  }
  return {
    "errorMessage": errorMessages
  }
}
