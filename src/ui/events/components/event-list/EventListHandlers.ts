import type { EventHandlerReducerConfig } from "../../../../framework/update/event/types/EventHandlerReducerConfig.ts";
import type { EventHandlerData } from "../../../../framework/update/event/types/EventHandlerData.ts";
const NAME = "title";

export const SHOW_INFO_CONFIG: EventHandlerReducerConfig = {
  eventHandler: function (params: EventHandlerData) {
    const state = params.componentStore;

    const groupId = params.targetId;
    const groupName = state.groups[groupId][NAME];

    window.location.replace(
      `${window.location.origin}/groups.html?name=${encodeURIComponent(groupName)}`,
    );
  },
  storeToUpdate: "",
};
