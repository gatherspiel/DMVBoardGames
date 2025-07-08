import type {EventHandlerThunkConfig} from "../../../framework/state/update/event/types/EventHandlerThunkConfig";
import {
  DELETE_EVENT_REQUEST_STORE,
  END_TIME_INPUT,
  EVENT_DESCRIPTION_INPUT, EVENT_LOCATION_INPUT,
  EVENT_NAME_INPUT, EVENT_URL_INPUT,
  SAVE_EVENT_REQUEST_STORE, START_DATE_INPUT, START_TIME_INPUT,
} from "../Constants.ts";
import {combineDateAndTime} from "../../../framework/utils/DateUtils.ts";


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
 * TO
 */
export const SAVE_EVENT_CONFIG: EventHandlerThunkConfig = {
  eventHandler: function (params): any {

    console.log(JSON.stringify(params))
    if (!params.shadowRoot) {
      throw new Error("Invalid shadow root for save group event handler");
    }

    const startDate =
      (params.shadowRoot.getElementById(
        START_DATE_INPUT,
      ) as HTMLTextAreaElement).value ?? ""

    const startTime =
      (params.shadowRoot.getElementById(
        START_TIME_INPUT,
      ) as HTMLTextAreaElement).value ?? ""

    console.log(startDate+":"+startTime)
    return {
      id: params.componentStore.id,
      name: (
        params.shadowRoot.getElementById(
          EVENT_NAME_INPUT,
        ) as HTMLInputElement
      )?.value.trim(),
      description:
        (
          params.shadowRoot.getElementById(
            EVENT_DESCRIPTION_INPUT,
          ) as HTMLTextAreaElement
        )?.value ?? "",
      url:
        (
          params.shadowRoot.getElementById(
            EVENT_URL_INPUT,
          ) as HTMLTextAreaElement
        )?.value ?? "",

      startTime: combineDateAndTime(startDate, startTime),
      endTime:
        (
          params.shadowRoot.getElementById(
            END_TIME_INPUT,
          ) as HTMLTextAreaElement
        )?.value ?? "",
      location:
        (
          params.shadowRoot.getElementById(
            EVENT_LOCATION_INPUT,
          ) as HTMLTextAreaElement
        )?.value ?? "",
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