import { updateGroupVisibilityState } from "../../data/state/GroupState.js";

function showHideHandler(groupId) {
  updateGroupVisibilityState(groupId);
}

function addEventHandler(groupElement) {
  const groupId = groupElement.id;
  const showHideButton = document.querySelector(".show-hide-button");

  showHideButton.addEventListener("click", () => showHideHandler(groupId));
}

export function setupEventHandlers() {
  const groups = document.querySelectorAll(".event-group");
  groups.forEach((group) => {
    addEventHandler(group);
  });
}
