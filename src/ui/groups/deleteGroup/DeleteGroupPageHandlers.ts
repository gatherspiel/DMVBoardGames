import type { EventHandlerThunkConfig } from "../../../framework/state/update/event/types/EventHandlerThunkConfig.ts";
import { GROUP_NAME_INPUT } from "../Constants.ts";
import type { EventValidationResult } from "../../../framework/state/update/event/types/EventValidationResult.ts";
import type { DeleteGroupData } from "./types/DeleteGroupData.ts";
import { getUrlParameter } from "../../../framework/utils/UrlParamUtils.ts";
import type {FormSelector} from "../../../framework/FormSelector.ts";
import {DELETE_GROUP_REQUEST_THUNK} from "./DeleteGroupRequestThunk.ts";

export const DELETE_GROUP_EVENT_CONFIG: EventHandlerThunkConfig = {
  eventHandler: function (params: any) {
    return {
      name: params.formSelector.getValue(GROUP_NAME_INPUT),
      id: getUrlParameter("groupId"),
    };
  },
  validator: function (
    formSelector: FormSelector,
    componentState: DeleteGroupData,
  ): EventValidationResult {

    if (formSelector.getValue(GROUP_NAME_INPUT) !== componentState.existingGroupName) {
      return {
        errorMessage: "Group name not entered correctly",
      };
    }
    return {};
  },
  apiRequestThunk: DELETE_GROUP_REQUEST_THUNK,
  componentReducer: function (data: any) {
    return {
      errorMessage: data.errorMessage,
    };
  },
};
