import type {EventHandlerThunkConfig} from "../../../framework/state/update/event/types/EventHandlerThunkConfig";
import {
  DELETE_EVENT_REQUEST_STORE,
  END_TIME_INPUT,
  EVENT_DESCRIPTION_INPUT, EVENT_LOCATION_INPUT,
  EVENT_NAME_INPUT, EVENT_URL_INPUT,
  SAVE_EVENT_REQUEST_STORE, START_DATE_INPUT, START_TIME_INPUT,
} from "../Constants.ts";
import {combineDateAndTime} from "../../../framework/utils/EventDataUtils.ts";


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

/**
 *
 */
export const SAVE_EVENT_CONFIG: EventHandlerThunkConfig = {
  eventHandler: function (params): any {

    const startDate = params.formSelector.getValue(START_DATE_INPUT)
    const startTime = params.formSelector.getValue(START_TIME_INPUT)
    const endTime =  params.formSelector.getValue(END_TIME_INPUT)

    console.log(params.formSelector.getValue(EVENT_NAME_INPUT));
    return {
      id: params.componentStore.id,
      name: params.formSelector.getValue(EVENT_NAME_INPUT),
      description: params.formSelector.getValue(EVENT_DESCRIPTION_INPUT),
      url: params.formSelector.getValue(EVENT_URL_INPUT),
      startTime: combineDateAndTime(startDate, startTime),
      endTime: combineDateAndTime(startDate, endTime),
      location: params.formSelector.getValue(EVENT_LOCATION_INPUT),
      groupId: params.componentStore.groupId
    };
  },
  requestStoreToUpdate: SAVE_EVENT_REQUEST_STORE,
  componentReducer: function (a: any) {
    console.log(a.startTime);
    return {
      name: a.name,
      description: a.description,
      url: a.url,
      startTime: a.startTime,
      endTime: a.endTime,
      location: a.location
    };
  },
};

export const CANCEL_EDIT_EVENT_DETAILS_CONFIG: EventHandlerThunkConfig = {
  eventHandler: function() {
    return {
      isEditing: false,
    }
  }
}