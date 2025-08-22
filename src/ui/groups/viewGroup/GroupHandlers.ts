import type { EventHandlerThunkConfig } from "@bponnaluri/places-js";
import {
  GROUP_DESCRIPTION_INPUT,
  GROUP_NAME_INPUT,
  GROUP_URL_INPUT
} from "../Constants.ts";
import {UPDATE_GROUP_REQUEST_THUNK} from "./data/UpdateGroupThunk.ts";



export const CANCEL_GROUP_EDIT_HANDLER: EventHandlerThunkConfig = {

  eventHandler:  () => {
    return {
      isEditing: false,
    };
  },
};

export const SAVE_GROUP_CONFIG: EventHandlerThunkConfig = {
  eventHandler:  (params) => {
    return {
      id: params.componentStore.id,
      name: params.formSelector.getValue(GROUP_NAME_INPUT),
      description: params.formSelector.getValue(GROUP_DESCRIPTION_INPUT),
      url: params.formSelector.getValue(GROUP_URL_INPUT)
    };
  },
  apiRequestThunk: UPDATE_GROUP_REQUEST_THUNK,
  componentReducer:  (a: any) => {
    return {
      name: a.name,
      description: a.description,
      url: a.url,
    };
  },
};



