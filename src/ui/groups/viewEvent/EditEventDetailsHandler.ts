import type {EventHandlerThunkConfig} from "../../../framework/state/update/event/types/EventHandlerThunkConfig";

export const EDIT_EVENT_DETAILS_CONFIG: EventHandlerThunkConfig = {
  eventHandler: function() {
    return {
      isEditing: true,
    }
  }
}