import { updateLocations } from "./EventSearch.js";
import { subscribeToGroupState } from "./data/state/GroupState.js";
import { SearchParams } from "./data/search/model/SearchParams.js";
import { getSearchResultGroups } from "./data/search/EventSearch.js";
function updateSearch(groups) {
  updateLocations(groups);
}

export function createEventDisplay(
  eventListComponent,
  conventionListComponent,
  gameStoreListComponent,
  gameRestaurantListComponent,
) {
  getSearchResultGroups(new SearchParams({ day: null, location: null })).then(
    (data) => {
      console.log("Data:" + JSON.stringify(data));
      subscribeToGroupState(eventListComponent);
      const groupStateUpdateEvent = new CustomEvent("updateGroupState", {
        detail: {
          data: data,
        },
      });
      document.dispatchEvent(groupStateUpdateEvent);

      conventionListComponent.updateData(Object.values(data.conventions));

      gameStoreListComponent.updateData(Object.values(data.gameStores));

      gameRestaurantListComponent.updateData(
        Object.values(data.gameRestaurants),
      );

      updateSearch(data.groups);
    },
  );
}
