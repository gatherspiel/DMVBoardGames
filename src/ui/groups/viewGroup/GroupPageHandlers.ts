import type { EventHandlerThunkConfig } from "../../../framework/state/update/event/types/EventHandlerThunkConfig.ts";
import {
  GROUP_DESCRIPTION_INPUT,
  GROUP_NAME_INPUT,
  GROUP_URL_INPUT,
  SAVE_GROUP_REQUEST_STORE,
} from "../Constants.ts";
import type { UpdateGroupRequest } from "./data/types/UpdateGroupRequest.ts";

export const EDIT_GROUP_EVENT_CONFIG: EventHandlerThunkConfig = {
  eventHandler: function () {
    return {
      isEditing: true,
    };
  },
};

export const SAVE_GROUP_CONFIG: EventHandlerThunkConfig = {
  eventHandler: function (params): UpdateGroupRequest {
    return {
      id: params.componentStore.id,
      name: params.formSelector.getValue(GROUP_NAME_INPUT),
      description: params.formSelector.getValue(GROUP_DESCRIPTION_INPUT),
      url: params.formSelector.getValue(GROUP_URL_INPUT)
    };
  },
  requestStoreToUpdate: SAVE_GROUP_REQUEST_STORE,
  componentReducer: function (a: any) {
    return {
      name: a.name,
      description: a.description,
      url: a.url,
    };
  },
};
