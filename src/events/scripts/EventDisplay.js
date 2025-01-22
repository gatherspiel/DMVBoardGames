import { getData } from "./data/ListingData.js";
import { updateLocations } from "./EventSearch.js";
import { findResults } from "./data/search/search.js";

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

//This should be split into separate components.
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
        ${
          isVisible(groupId)
            ? `
          <div>
          ${
            group.events.length === 0
              ? "Click on group link above for event information"
              : ""
          }
          ${group.events
            .map((event) => {
              return `<div id=${groupId + "event-" + event.id}>
                    <h4>${event.title}</h4>
                    <p>Summary: ${event.summary}</p>
                    <p>Day: ${event.day}</p>
                    <p>Location: ${event.location}</p>
                  </div>`;
            })
            .join(" ")}  
          `
            : ``
        }
      </div>
    `;
  return groupHtml;
}

//This should be moved to EventListComponent.js
function displayEventList(groupData) {
  let html = "";

  if (groupData && Object.values(groupData).length > 0) {
    Object.values(groupData).forEach((group) => {
      groupState["group-" + group.id] = {
        groupData: group,
        frontendState: {},
      };

      let groupHtml = "";
      groupHtml = getGroupHtml(group);
      html += groupHtml;
    });
  } else {
    html += `
      <p>No events found.</p>
    `;
  }

  document.querySelector("#event-list").innerHTML = html;
}

function updateSearch(groups) {
  updateLocations(groups);
}

export function createEventDisplay(
  eventListComponent,
  conventionListComponent,
  gameStoreListComponent,
  gameRestaurantListComponent,
) {
  const data = getData();

  displayEventList(Object.values(data.groups));

  conventionListComponent.renderWithUpdatedData(
    Object.values(data.conventions),
  );

  gameStoreListComponent.renderWithUpdatedData(Object.values(data.gameStores));

  gameRestaurantListComponent.renderWithUpdatedData(
    Object.values(data.gameRestaurants),
  );

  setupEventHandlers();

  updateSearch(data.groups);

  document.addEventListener("search", (e) => {
    const searchParams = e.detail;
    const searchResults = findResults(data, searchParams);
    displayEventList(Object.values(searchResults.groups));
    setupEventHandlers();
  });
}
