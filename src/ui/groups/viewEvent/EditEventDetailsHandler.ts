import type {EventHandlerThunkConfig} from "../../../framework/state/update/event/types/EventHandlerThunkConfig";
import {
  END_TIME_INPUT,
  EVENT_DESCRIPTION_INPUT, EVENT_LOCATION_INPUT,
  EVENT_NAME_INPUT, EVENT_URL_INPUT,
  SAVE_EVENT_REQUEST_STORE, START_TIME_INPUT,
} from "../Constants.ts";

export const EDIT_EVENT_DETAILS_CONFIG: EventHandlerThunkConfig = {
  eventHandler: function() {
    return {
      isEditing: true,
    }
  }
}

export const SAVE_EVENT_CONFIG: EventHandlerThunkConfig = {
  eventHandler: function (params): any {

    console.log(JSON.stringify(params.componentStore))
    if (!params.shadowRoot) {
      throw new Error("Invalid shadow root for save group event handler");
    }
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
      startTime:
        (
          params.shadowRoot.getElementById(
            START_TIME_INPUT,
          ) as HTMLTextAreaElement
        )?.value ?? "",
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