import { EventListComponent } from "./components/EventList/EventListComponent.js";
import { GameRestaurantComponent } from "./components/GameRestaurantComponent.js";
import { GameStoreComponent } from "./components/GameStoreComponent.js";
import { ConventionListComponent } from "./components/ConventionListComponent.js";
import "../../../public/styles/eventListing.css";
import "../../../public/styles/styles.css";
import {
  getSearchCities,
  getSearchResultGameLocations,
  getSearchResultGroups,
} from "./data/search/SearchAPI.js";
import { SearchParams } from "./data/search/model/SearchParams.js";
import {
  GROUP_STATE_NAME,
  updateSearchResultState,
} from "./data/state/GroupState.js";
import { updateCities } from "./components/EventSearch/EventSearchState.js";
import { EventSearchComponent } from "./components/EventSearch/EventSearchComponent.js";
import {
  subscribeToState,
  updateState,
} from "../../framework/State/StateManager.js";
import { SEARCH_COMPONENT_STATE } from "./components/EventSearch/Constants.js";

function createEventDisplay(
  searchComponent,
  eventListComponent,
  conventionListComponent,
  gameStoreListComponent,
  gameRestaurantListComponent,
) {
  subscribeToState(SEARCH_COMPONENT_STATE, searchComponent);
  subscribeToState(GROUP_STATE_NAME, eventListComponent);

  getSearchResultGroups(new SearchParams({ day: null, location: null })).then(
    (data) => {
      updateState(GROUP_STATE_NAME, updateSearchResultState, data);
      const groupStateUpdateEvent = new CustomEvent("updateGroupState", {
        detail: {
          data: data,
        },
      });
      document.dispatchEvent(groupStateUpdateEvent);
    },
  );

  getSearchResultGameLocations().then((data) => {
    conventionListComponent.updateData(Object.values(data.conventions));
    gameStoreListComponent.updateData(Object.values(data.gameStores));
    gameRestaurantListComponent.updateData(Object.values(data.gameRestaurants));
  });

  getSearchCities().then((data) => {
    updateState(SEARCH_COMPONENT_STATE, updateCities, data);
  });
}

function init() {
  const searchComponent = new EventSearchComponent("root", {
    nodeName: "EventSearchComponent",
    classNames: ["event-search"],
  });

  const eventListComponent = EventListComponent.createComponent("root", {
    nodeName: "event-list",
    classNames: ["page-section"],
    title: "Events",
  });

  const conventionListComponent = ConventionListComponent.createComponent(
    "root",
    {
      nodeName: ["convention-list"],
      classNames: ["page-section"],
      title: "Upcoming Conventions",
    },
  );

  const gameStoreComponent = GameStoreComponent.createComponent("root", {
    nodeName: ["game-store"],
    classNames: ["page-section"],
    title: "Game Stores",
  });

  const gameRestaurantListComponent = GameRestaurantComponent.createComponent(
    "root",
    {
      nodeName: ["game-restaurant-list"],
      classNames: ["page-section"],
      title: "Board Game Bars and Cafés",
    },
  );
  createEventDisplay(
    searchComponent,
    eventListComponent,
    conventionListComponent,
    gameStoreComponent,
    gameRestaurantListComponent,
  );
}

init();
