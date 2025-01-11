import { GROUP_DATA } from "./GroupData.js";

const groupState = {};

function getGroupData(groupId) {
  return groupState[groupId]["groupData"];
}

function updateGroupVisibilityState(groupId) {
  if (isVisible(groupId)) {
    groupState[groupId]["frontendState"].isVisible = false;
  } else {
    groupState[groupId]["frontendState"].isVisible = true;
  }
}

function isVisible(groupId) {
  const groupData = groupState[groupId]["frontendState"];
  return groupData && groupData.isVisible;
}

function showHideHandler(groupId) {
  updateGroupVisibilityState(groupId);

  const groupElement = document.querySelector("#" + groupId);
  groupElement.innerHTML = getGroupHtml(getGroupData(groupId));
  addEventHandler(groupElement);
}

function addEventHandler(groupElement) {
  const groupId = groupElement.id;
  const showHideButton = groupElement.querySelector(".show-hide-button");

  showHideButton.addEventListener("click", () => showHideHandler(groupId));
}

function setupEventHandlers() {
  const groups = document.querySelectorAll(".event-group");
  groups.forEach((group) => {
    addEventHandler(group);
  });
}

function getGroupHtml(group) {
  let groupHtml = "";
  const groupId = "group-" + group.id;
  groupHtml = `
      <div id=${groupId} class=${"event-group"}>
        <h2>
          <a href=${group.link}>${group.title}</a>
          <span>:&nbsp;${group.locations.replaceAll(",", ", ")}</span>
        </h2>  
        
        <button class='show-hide-button'>
          ${isVisible(groupId) ? "Hide info" : "Show info"}
        </button>

      </div>
    `;
  return groupHtml;
}

function displayListing(groupData) {
  console.log(groupData);
  let html = "";
  Object.values(groupData).forEach((group) => {
    groupState["group-" + group.id] = {
      groupData: group,
      frontendState: {},
    };

    let groupHtml = "";
    groupHtml = getGroupHtml(group);
    html += groupHtml;
  });

  document.querySelector("#listing").innerHTML = html;
}

console.log("Setting up event listing");
displayListing(GROUP_DATA);
setupEventHandlers();
