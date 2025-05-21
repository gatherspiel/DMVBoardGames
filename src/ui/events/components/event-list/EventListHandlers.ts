import type { EventHandlerReducerConfig } from "../../../../framework/reducer/event/types/EventHandlerReducerConfig.ts";
import type { EventHandlerData } from "../../../../framework/reducer/event/types/EventHandlerData.ts";
const NAME = "title";

export const SHOW_INFO_CONFIG: EventHandlerReducerConfig = {
  eventHandler: function (params: EventHandlerData) {
    const store = params.componentStore;

    const groupId = params.targetId;
    const groupName = store.groups[groupId][NAME];

    window.location.replace(
      `${window.location.origin}/groups.html?name=${encodeURIComponent(groupName)}`,
    );
  },
  storeToUpdate: "",
};
