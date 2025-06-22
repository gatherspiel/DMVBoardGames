import type { EventHandlerThunkConfig } from "../../../../framework/store/update/event/types/EventHandlerThunkConfig.ts";
import {
  GROUP_DESCRIPTION_INPUT,
  GROUP_NAME_INPUT,
  GROUP_URL_INPUT,
  SAVE_GROUP_REQUEST_STORE,
} from "../../Constants.ts";
import type { UpdateGroupRequest } from "../data/types/UpdateGroupRequest.ts";
import type { EventHandlerData } from "../../../../framework/store/update/event/types/EventHandlerData.ts";

export const DELETE_GROUP_EVENT_CONFIG: EventHandlerThunkConfig = {
  eventHandler: function (params: EventHandlerData) {
    console.log(JSON.stringify(params));

    window.location.replace(
      `${window.location.origin}/groups/delete.html?name=${encodeURIComponent(params.componentStore.name)}&id=${params.componentStore.id}`,
    );
  },
};

export const VIEW_EVENT_CONFIG: EventHandlerThunkConfig = {
  eventHandler: function (params: EventHandlerData) {
    console.log(params);
    window.location.replace(
      `${window.location.origin}/groups/event.html?&id=${1}`,
    );
  },
};
export const EDIT_GROUP_EVENT_CONFIG: EventHandlerThunkConfig = {
  eventHandler: function () {
    return {
      isEditing: true,
    };
  },
};

export const SAVE_GROUP_CONFIG: EventHandlerThunkConfig = {
  eventHandler: function (params): UpdateGroupRequest {
    if (!params.shadowRoot) {
      throw new Error("Invalid shadow root for save group event handler");
    }
    return {
      id: params.componentStore.id,
      summary: (
        params.shadowRoot.getElementById(
          GROUP_DESCRIPTION_INPUT,
        ) as HTMLInputElement
      )?.value.trim(),
      name:
        (
          params.shadowRoot.getElementById(
            GROUP_NAME_INPUT,
          ) as HTMLTextAreaElement
        )?.value ?? "",
      url:
        (
          params.shadowRoot.getElementById(
            GROUP_URL_INPUT,
          ) as HTMLTextAreaElement
        )?.value ?? "",
    };
  },
  requestStoreToUpdate: SAVE_GROUP_REQUEST_STORE,
  componentReducer: function (a: any) {
    return {
      name: a.name,
      summary: a.summary,
      url: a.url,
    };
  },
};
