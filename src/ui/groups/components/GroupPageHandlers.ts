import type { EventHandlerThunkConfig } from "../../../framework/store/update/event/types/EventHandlerThunkConfig.ts";
import {
  GROUP_DESCRIPTION_INPUT,
  GROUP_NAME_INPUT,
  GROUP_URL_INPUT,
  SAVE_GROUP_REQUEST_STORE,
} from "../Constants.ts";
import type { UpdateGroupRequest } from "../../events/data/types/group/UpdateGroupRequest.ts";
import type { EventHandlerData } from "../../../framework/store/update/event/types/EventHandlerData.ts";

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
    console.log("Updating group request");
    console.log(params.shadowRoot.getElementById(GROUP_NAME_INPUT));
    return {
      summary: (
        params.shadowRoot.getElementById(
          GROUP_DESCRIPTION_INPUT,
        ) as HTMLTextAreaElement
      )?.value,
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
  storeToUpdate: SAVE_GROUP_REQUEST_STORE,
};

export const GROUP_INPUT_UPDATE_CONFIG: EventHandlerThunkConfig = {
  eventHandler: function (params: EventHandlerData) {
    console.log(JSON.stringify((params?.event as InputEvent).currentTarget));
  },
};
