import type { EventHandlerThunkConfig } from "../../../framework/store/update/event/types/EventHandlerThunkConfig.ts";
import { DELETE_GROUP_REQUEST_STORE, GROUP_NAME_INPUT } from "../Constants.ts";
import type { EventValidationResult } from "../../../framework/store/update/event/types/EventValidationResult.ts";
import type { DeleteGroupData } from "./types/DeleteGroupData.ts";
import { getUrlParameter } from "../../../framework/utils/urlParmUtils.ts";

export const DELETE_GROUP_EVENT_CONFIG: EventHandlerThunkConfig = {
  eventHandler: function (params: any) {
    if (!params.shadowRoot) {
      throw new Error("Invalid shadow root for save group event handler");
    }
    return {
      name:
        (
          params.shadowRoot.getElementById(
            GROUP_NAME_INPUT,
          ) as HTMLTextAreaElement
        )?.value ?? "",
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
