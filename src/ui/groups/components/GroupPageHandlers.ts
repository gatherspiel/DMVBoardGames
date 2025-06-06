import type { EventHandlerThunkConfig } from "../../../framework/store/update/event/types/EventHandlerThunkConfig.ts";
import {
  GROUP_DESCRIPTION_INPUT,
  GROUP_NAME_INPUT,
  GROUP_URL_INPUT,
  SAVE_GROUP_REQUEST_STORE,
} from "../Constants.ts";

export const EDIT_GROUP_EVENT_CONFIG: EventHandlerThunkConfig = {
  eventHandler: function () {
    return {
      isEditing: true,
    };
  },
};

export const SAVE_GROUP_CONFIG: EventHandlerThunkConfig = {
  eventHandler: function (params) {
    return {
      name: params.shadowRoot?.getElementById(GROUP_NAME_INPUT)?.textContent,
      url: params.shadowRoot?.getElementById(GROUP_URL_INPUT)?.textContent,
      description: params.shadowRoot?.getElementById(GROUP_DESCRIPTION_INPUT)
        ?.textContent,
    };
  },
  storeToUpdate: SAVE_GROUP_REQUEST_STORE,
};
