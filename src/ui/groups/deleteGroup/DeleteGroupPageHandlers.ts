import type { EventHandlerThunkConfig } from "../../../framework/state/update/event/types/EventHandlerThunkConfig.ts";
import { DELETE_GROUP_REQUEST_STORE, GROUP_NAME_INPUT } from "../Constants.ts";
import type { EventValidationResult } from "../../../framework/state/update/event/types/EventValidationResult.ts";
import type { DeleteGroupData } from "./types/DeleteGroupData.ts";
import { getUrlParameter } from "../../../framework/utils/UrlParamUtils.ts";

export const DELETE_GROUP_EVENT_CONFIG: EventHandlerThunkConfig = {
  eventHandler: function (params: any) {
    return {
      name: params.formSelector.getValue(GROUP_NAME_INPUT),
      id: getUrlParameter("id"),
    };
  },
  validator: function (
    eventData: any,
    componentState: DeleteGroupData,
  ): EventValidationResult {


    if (eventData.name !== componentState.existingGroupName) {
      return {
        error: "Group name not entered correctly",
      };
    }
    return {};
  },
  requestStoreToUpdate: DELETE_GROUP_REQUEST_STORE,
  componentReducer: function (data: any) {
    return {
      errorMessage: data.error,
    };
  },
};
