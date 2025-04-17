import {
  initGroups,
  updateSubscriberData,
} from "../../data/state/GroupState.js";

export function setupEventHandlers() {
  document.addEventListener("updateGroupState", (e) => {
    const groups = e.detail.data;
    initGroups(groups);
    updateSubscriberData();
  });
}
