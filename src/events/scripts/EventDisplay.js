import { subscribeToGroupState } from "./data/state/GroupState.js";
import { SearchParams } from "./data/search/model/SearchParams.js";
import {
  getSearchCities,
  getSearchResultGameLocations,
  getSearchResultGroups,
} from "./data/search/SearchAPI.js";
import { updateCities } from "./components/EventSearchComponent.js";

export function createEventDisplay(
  eventListComponent,
  conventionListComponent,
  gameStoreListComponent,
  gameRestaurantListComponent,
) {
  getSearchResultGroups(new SearchParams({ day: null, location: null })).then(
    (data) => {
      subscribeToGroupState(eventListComponent);
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
    updateCities(data);
  });
}
