import type { EventHandlerThunkConfig } from "../../../framework/state/update/event/types/EventHandlerThunkConfig.ts";
import {
  CREATE_GROUP_REQUEST_STORE,
  GROUP_DESCRIPTION_INPUT,
  GROUP_NAME_INPUT,
  GROUP_URL_INPUT,
} from "../Constants.ts";

export const CREATE_GROUP_EVENT_CONFIG: EventHandlerThunkConfig = {
  eventHandler: function (params): any {
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
      summary:
        (
          params.shadowRoot.getElementById(
            GROUP_DESCRIPTION_INPUT,
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
  requestStoreToUpdate: CREATE_GROUP_REQUEST_STORE,
  componentReducer: function (data: any) {
    return data;
  },
};
