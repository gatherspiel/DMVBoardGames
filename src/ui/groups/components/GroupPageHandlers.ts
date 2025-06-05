import type { EventHandlerThunkConfig } from "../../../framework/store/update/event/types/EventHandlerThunkConfig.ts";

export const EDIT_GROUP_EVENT_CONFIG: EventHandlerThunkConfig = {
  eventHandler: function () {
    return {
      isEditing: true,
    };
  },
};
