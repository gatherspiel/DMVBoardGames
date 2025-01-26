import { getData } from "./data/ListingData.js";
import { updateLocations } from "./EventSearch.js";

export const groupState = {};

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

  eventListComponent.renderWithUpdatedData(Object.values(data.groups));

  conventionListComponent.renderWithUpdatedData(
    Object.values(data.conventions),
  );

  gameStoreListComponent.renderWithUpdatedData(Object.values(data.gameStores));

  gameRestaurantListComponent.renderWithUpdatedData(
    Object.values(data.gameRestaurants),
  );

  updateSearch(data.groups);
}
