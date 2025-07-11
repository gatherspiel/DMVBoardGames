import type {EventHandlerThunkConfig} from "../../../framework/state/update/event/types/EventHandlerThunkConfig";
import {
  CREATE_EVENT_REQUEST_STORE,
  DELETE_EVENT_REQUEST_STORE,
  END_TIME_INPUT,
  EVENT_DESCRIPTION_INPUT, EVENT_LOCATION_INPUT,
  EVENT_NAME_INPUT, EVENT_URL_INPUT,
  UPDATE_EVENT_REQUEST_STORE, START_DATE_INPUT, START_TIME_INPUT,
} from "../Constants.ts";
import {combineDateAndTime} from "../../../framework/utils/EventDataUtils.ts";
import type {EventValidationResult} from "../../../framework/state/update/event/types/EventValidationResult.ts";
import {validateEventFormData} from "./data/EventFormDataValidator.ts";
import type {FormSelector} from "../../../framework/FormSelector.ts";
import {getUrlParameter} from "../../../framework/utils/UrlParamUtils.ts";

export const CONFIRM_DELETE_EVENT_CONFIG: EventHandlerThunkConfig = {
  eventHandler: function(params: any) {
    return {
      id: params.componentStore.id,
      groupId: params.componentStore.groupId,
    }
  },
  requestStoreToUpdate: DELETE_EVENT_REQUEST_STORE,
  componentReducer: function (data: any) {
    return {
      errorMessage: data.error,
    };
  },
}

export const EDIT_EVENT_DETAILS_CONFIG: EventHandlerThunkConfig = {
  eventHandler: function() {
    return {
      isEditing: true,
    }
  }
}

export const DELETE_EVENT_CONFIG: EventHandlerThunkConfig = {
  eventHandler: function(){
    return {
      isDeleting: true,
    }
  }
}

export const CANCEL_DELETE_EVENT_CONFIG: EventHandlerThunkConfig = {
  eventHandler: function(){
    return {
      isDeleting: false,
    }
  }
}

const eventDataReducer = function (a: any) {
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

const eventDataHandler = function(params:any){
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

export const CREATE_EVENT_CONFIG: EventHandlerThunkConfig = {
  eventHandler: eventDataHandler,
  requestStoreToUpdate: CREATE_EVENT_REQUEST_STORE,
  componentReducer: eventDataReducer,
  validator: function(a: FormSelector):EventValidationResult{
    let errorMessages = validateEventFormData(a);
    if(errorMessages.length >= 1){
      return  {errorMessage:errorMessages}
    }
    return {};
  }
}

export const SAVE_EVENT_CONFIG: EventHandlerThunkConfig = {
  eventHandler: eventDataHandler,
  requestStoreToUpdate: UPDATE_EVENT_REQUEST_STORE,
  componentReducer: eventDataReducer
};

export const CANCEL_EDIT_EVENT_DETAILS_CONFIG: EventHandlerThunkConfig = {
  eventHandler: function() {
    return {
      isEditing: false,
    }
  }
}