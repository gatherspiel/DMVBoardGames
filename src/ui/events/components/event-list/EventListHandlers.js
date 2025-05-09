import { getGroupName } from "../../data/state/SearchResultGroupState.js";

function showHideHandler(groupId) {
  console.log(groupId);
  const groupName = getGroupName(groupId);
  window.location.replace(
    `${window.location.origin}/groups.html?name=${encodeURIComponent(groupName)}`,
  );
}

function addEventHandler(groupElement) {
  const groupId = groupElement.id;
  const showHideButton = document.querySelector(
    `#${groupId} .show-hide-button`,
  );

  showHideButton.addEventListener("click", () => showHideHandler(groupId));
}

export function setupEventHandlers() {
  const groups = document.querySelectorAll(".event-group");
  groups.forEach((group) => {
    addEventHandler(group);
  });
}
