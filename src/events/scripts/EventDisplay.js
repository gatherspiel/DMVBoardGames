import { getData } from "./data/json/ListingData.js";
import { updateLocations } from "./EventSearch.js";
import { subscribeToGroupState } from "./data/state/GroupState.js";

function updateSearch(groups) {
  updateLocations(groups);
}

export function createEventDisplay(
  eventListComponent,
  conventionListComponent,
  gameStoreListComponent,
  gameRestaurantListComponent,
) {
  //TODO: Add logic in framework folder to manage state update.
  const data = getData();

  subscribeToGroupState(eventListComponent);
  const groupStateUpdateEvent = new CustomEvent("updateGroupState", {
    detail: {
      data: data.groups,
    },
  });
  document.dispatchEvent(groupStateUpdateEvent);

  conventionListComponent.updateData(Object.values(data.conventions));

  gameStoreListComponent.updateData(Object.values(data.gameStores));

  gameRestaurantListComponent.updateData(Object.values(data.gameRestaurants));

  updateSearch(data.groups);
}
