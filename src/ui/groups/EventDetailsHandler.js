
import {
  END_TIME_INPUT,
  EVENT_DESCRIPTION_INPUT, EVENT_LOCATION_INPUT,
  EVENT_NAME_INPUT, EVENT_URL_INPUT,
  START_DATE_INPUT, START_TIME_INPUT,
} from "./Constants.js";
import {combineDateAndTime, validateAddress, validateDateFormat} from "../../shared/EventDataUtils.js";
import {DAY_OF_WEEK_INPUT} from "../../shared/html/SelectGenerator.js";

export function getEventDetailsFromForm(formData){
  const startDate = formData[START_DATE_INPUT]
  const startTime =  formData[START_TIME_INPUT]
  const endTime =   formData[END_TIME_INPUT]
  return  {
    id:formData.id,
    name: formData[EVENT_NAME_INPUT],
    description: formData[EVENT_DESCRIPTION_INPUT],
    url: formData[EVENT_URL_INPUT],
    startDate: startDate,
    startTime: startTime,
    endDate: startDate,
    endTime: endTime,
    location: formData[EVENT_LOCATION_INPUT],
    isRecurring: formData["isRecurring"],
    day: formData[DAY_OF_WEEK_INPUT],
    image:formData["image"],
    imageFilePath: formData["imageFilePath"]
  };
}

export function validate(formData) {
  const errorMessages={};

  if(!formData[EVENT_NAME_INPUT]){
    errorMessages[EVENT_NAME_INPUT] = "Event name is required";
  }

  if(!formData[EVENT_DESCRIPTION_INPUT]){

    errorMessages[EVENT_DESCRIPTION_INPUT] = "Event description is required";
  }

  if(formData[EVENT_URL_INPUT]){
    if(!formData[EVENT_URL_INPUT].toLowerCase().startsWith("http")){
      errorMessages[EVENT_URL_INPUT] = (`Invalid event url ${formData[EVENT_URL_INPUT]}`)
    }
  }

  const startDate = formData[START_DATE_INPUT];
  const startTime = formData[START_TIME_INPUT];
  const endTime = formData[END_TIME_INPUT];

  if(!startDate && !formData["isRecurring"]){
    errorMessages[START_DATE_INPUT] = "Start date is required";
  }

  if(!startTime){
    errorMessages[START_TIME_INPUT] = "Start time is required";
  }

  if(!endTime){
    errorMessages[END_TIME_INPUT] = "End time is required";
  }

  if(formData["isRecurring"]){
    if(!formData[DAY_OF_WEEK_INPUT]){
      errorMessages[DAY_OF_WEEK_INPUT] = "Day of week is required"
    }
  }

  if(startDate && startTime && endTime) {
    try {
      validateDateFormat(startDate)
      combineDateAndTime(startDate, startTime)
    } catch (e){
      errorMessages[START_DATE_INPUT] = e.message;
    }
  }

  if(!formData[EVENT_LOCATION_INPUT]){
    errorMessages[EVENT_LOCATION_INPUT]= "Event location is required";
  } else {
    try {
      validateAddress(formData[EVENT_LOCATION_INPUT]);
    } catch(e){
      errorMessages[EVENT_LOCATION_INPUT] = e.message;
    }
  }
  return {
    "formValidationErrors": errorMessages
  }
}
