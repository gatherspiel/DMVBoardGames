import type { EventHandlerConfig } from "../../../../framework/update/event/types/EventHandlerConfig.ts";
import type { EventHandlerData } from "../../../../framework/update/event/types/EventHandlerData.ts";
const NAME = "title";

export const SHOW_INFO_CONFIG: EventHandlerConfig = {
  eventHandler: function (params: EventHandlerData) {
    const state = params.componentState;

    const groupId = params.targetId;
    const groupName = state.groups[groupId][NAME];

    window.location.replace(
      `${window.location.origin}/groups.html?name=${encodeURIComponent(groupName)}`,
    );
  },
  stateToUpdate: "",
};
