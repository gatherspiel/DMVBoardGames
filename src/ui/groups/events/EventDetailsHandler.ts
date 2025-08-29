import {
  type BaseDynamicComponent,
  type EventHandlerThunkConfig,
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
import {UPDATE_EVENT_REQUEST_THUNK} from "./data/UpdateEventThunk.ts";
import {DELETE_EVENT_REQUEST_THUNK} from "./data/DeleteEventRequestThunk.ts";
import {SUCCESS_MESSAGE_KEY} from "../../../shared/Constants.ts";


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

//TODO: Delete these

export const CONFIRM_DELETE_EVENT_CONFIG: EventHandlerThunkConfig = {
  eventHandler: (params: any) =>{
    return {
      id: params.componentStore.id,
      groupId: params.componentStore.groupId,
    }
  },
  apiRequestThunk: DELETE_EVENT_REQUEST_THUNK,
  componentReducer: (data: any) =>{
    return {
      errorMessage: data.error,
    };
  },
}

export const EDIT_EVENT_DETAILS_CONFIG: EventHandlerThunkConfig = {
  eventHandler: () =>{
    return {
      isEditing: true,
      [SUCCESS_MESSAGE_KEY]:''
    }
  }
}

export const DELETE_EVENT_CONFIG: EventHandlerThunkConfig = {
  eventHandler: () =>{
    return {
      isDeleting: true,
      [SUCCESS_MESSAGE_KEY]:''
    }
  }
}

export const CANCEL_DELETE_EVENT_CONFIG: EventHandlerThunkConfig = {
  eventHandler: ()=>{
    return {
      isDeleting: false,
      errorMessage: '',
      [SUCCESS_MESSAGE_KEY]:''
    }
  }
}

const eventDataReducer = (a: any) => {
  return {
    name: a.name,
    description: a.description,
    url: a.url,
    startTime: a.startTime,
    endTime: a.endTime,
    location: a.location,
    errorMessage: a.errorMessage
  };
}

const eventDataHandler = (params:any)=>{
  const startDate = params.formSelector.getValue(START_DATE_INPUT)
  const startTime = params.formSelector.getValue(START_TIME_INPUT)
  const endTime =  params.formSelector.getValue(END_TIME_INPUT)

  return {
    id: params.componentStore.id,
    groupId: getUrlParameter("groupId"),
    name: params.formSelector.getValue(EVENT_NAME_INPUT),
    description: params.formSelector.getValue(EVENT_DESCRIPTION_INPUT),
    url: params.formSelector.getValue(EVENT_URL_INPUT),
    startTime: combineDateAndTime(startDate, startTime),
    endTime: combineDateAndTime(startDate, endTime),
    location: params.formSelector.getValue(EVENT_LOCATION_INPUT),
  };
}


export const SAVE_EVENT_CONFIG: EventHandlerThunkConfig = {
  eventHandler: eventDataHandler,
  apiRequestThunk: UPDATE_EVENT_REQUEST_THUNK,
  componentReducer: eventDataReducer
};

export const CANCEL_EDIT_EVENT_DETAILS_CONFIG: EventHandlerThunkConfig = {
  eventHandler: () => {
    return {
      isEditing: false,
      errorMessage: ''
    }
  }
}