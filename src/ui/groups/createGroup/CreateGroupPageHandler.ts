import type { EventHandlerThunkConfig } from "../../../framework/state/update/event/types/EventHandlerThunkConfig.ts";
import {
  GROUP_DESCRIPTION_INPUT,
  GROUP_NAME_INPUT,
  GROUP_URL_INPUT,
} from "../Constants.ts";
import {CREATE_GROUP_REQUEST_THUNK} from "./data/CreateGroupRequestThunk.ts";

export const CREATE_GROUP_EVENT_CONFIG: EventHandlerThunkConfig = {
  eventHandler:  (params) => {
    return {
      name: params.formSelector.getValue(GROUP_NAME_INPUT),
      description: params.formSelector.getValue(GROUP_DESCRIPTION_INPUT),
      url: params.formSelector.getValue(GROUP_URL_INPUT)
    };
  },
  apiRequestThunk: CREATE_GROUP_REQUEST_THUNK,
  componentReducer:  (data: any) => data
};
