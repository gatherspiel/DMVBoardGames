import { getGroupName } from "../../data/state/SearchResultGroupState.js";

function showHideHandler(groupId: string) {
  const groupName = getGroupName(groupId);
  window.location.replace(
    `${window.location.origin}/groups.html?name=${encodeURIComponent(groupName)}`,
  );
}

function addEventHandler(groupElement: Element) {
  const groupId = groupElement.id;
  const showHideButton = document.querySelector(
    `#${groupId} .show-hide-button`,
  );

  if (showHideButton === null) {
    throw new Error("Could not create event handler");
  }
  (showHideButton as HTMLElement).addEventListener("click", () =>
    showHideHandler(groupId),
  );
}

export function setupEventHandlers() {
  const groups: NodeListOf<Element> = document.querySelectorAll(".event-group");
  groups.forEach((group: Element) => {
    addEventHandler(group);
  });
}
