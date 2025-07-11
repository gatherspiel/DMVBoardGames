import type { EventHandlerThunkConfig } from "../../../framework/state/update/event/types/EventHandlerThunkConfig.ts";
import {
  CREATE_GROUP_REQUEST_STORE,
  GROUP_DESCRIPTION_INPUT,
  GROUP_NAME_INPUT,
  GROUP_URL_INPUT,
} from "../Constants.ts";

export const CREATE_GROUP_EVENT_CONFIG: EventHandlerThunkConfig = {
  eventHandler: function (params): any {
    return {
      name: params.formSelector.getValue(GROUP_NAME_INPUT),
      description: params.formSelector.getValue(GROUP_DESCRIPTION_INPUT),
      url: params.formSelector.getValue(GROUP_URL_INPUT)
    };
  },
  requestStoreToUpdate: CREATE_GROUP_REQUEST_STORE,
  componentReducer: function (data: any) {
    return data;
  },
};
