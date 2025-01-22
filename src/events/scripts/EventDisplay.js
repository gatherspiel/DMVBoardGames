import { getData } from "./data/ListingData.js";
import { updateLocations } from "./EventSearch.js";
import { findResults } from "./data/search/search.js";

const groupState = {};
const conventions = {};
const gameStores = {};
const gameRestaurants = {};

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

export function updateGroupState(searchParams) {
  const groupsToShow = findResults(getData(), searchParams);
  console.log(JSON.stringify(groupsToShow));
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

function getConventionHtml(convention) {
  return `
    <div id = convention-${convention.id}>
     <h3>
        <a href=${convention.link}>${convention.title}</a>
      </h3>
      <p>Days: ${convention.days.join()}</p>
    
    </div>
  `;
}
function displayConventionList(conventionData) {
  let html = `<h1> Upcoming conventions</h1>`;
  Object.values(conventionData).forEach((convention) => {
    conventions["convention-" + convention.id] = {
      conventionData: convention,
      frontendState: {},
    };

    const conventionHtml = getConventionHtml(convention);
    html += conventionHtml;
  });

  document.querySelector("#convention-list").innerHTML = html;
}

function getGameStoreHtml(gameStore) {
  return `
    <div id = convention-${gameStore.id}>
     <h3>
        <a href=${gameStore.link}>${gameStore.name}</a>
      </h3>
    <p>Location: ${gameStore.location}</p>
    </div>
  `;
}

function displayGameStoreList(gameStores) {
  let html = `<h1> Game Stores</h1>`;

  Object.values(gameStores).forEach((gameStore) => {
    gameStores["game-store-" + gameStore.id] = {
      gameStore: gameStore,
      frontendState: {},
    };

    const gameStoreHtml = getGameStoreHtml(gameStore);
    html += gameStoreHtml;
  });
  document.querySelector("#game-store-list").innerHTML = html;
}

function getRestaurantHtml(gameRestaurant) {
  return `
    <div id = convention-${gameRestaurant.id}>
     <h3>
        <a href=${gameRestaurant.link}>${gameRestaurant.name}</a>
      </h3>
    <p>Location: ${gameRestaurant.location}</p>
    </div>
  `;
}

function displayGameRestaurantList(gameRestaurants) {
  let html = `<h1> Board Game Bars and Cafés</h1>`;

  Object.values(gameRestaurants).forEach((gameRestaurant) => {
    gameRestaurants["game-store-" + gameRestaurant.id] = {
      gameStore: gameRestaurant,
      frontendState: {},
    };

    html += getRestaurantHtml(gameRestaurant);
  });
  document.querySelector("#game-store-list").innerHTML = html;
}

function updateSearch(groups) {
  updateLocations(groups);
}

export function createEventDisplay() {
  const data = getData();

  displayEventList(Object.values(data.groups));
  displayConventionList(Object.values(data.conventions));
  displayGameStoreList(Object.values(data.gameStores));
  displayGameRestaurantList(Object.values(data.gameRestaurants));
  setupEventHandlers();

  updateSearch(data.groups);

  document.addEventListener("search", (e) => {
    const searchParams = e.detail;
    const searchResults = findResults(data, searchParams);
    displayEventList(Object.values(searchResults.groups));
  });
}
