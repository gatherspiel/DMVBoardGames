import { gameStores } from "./MockGameStoreData.js";
import { gameRestaurants } from "./MockGameRestaurantData.js";
import { MOCK_GROUP_DATA } from "./MockGroupData.js";
import { getConventionData } from "./MockConventionData.js";

export function getGroups() {
  return MOCK_GROUP_DATA;
}

export function getGameStores() {
  const sortedGameStores = gameStores.slice();
  sortedGameStores.sort((a, b) => {
    if (a.name < b.name) {
      return -1;
    }
    if (a.name > b.name) {
      return 1;
    }

    return 0;
  });
  return sortedGameStores;
}

export function getGameRestaurants() {
  const sortedGameRestaurants = gameRestaurants.slice();
  sortedGameRestaurants.sort((a, b) => {
    if (a.name < b.name) {
      return -1;
    }
    if (a.name > b.name) {
      return 1;
    }

    return 0;
  });
  return sortedGameRestaurants;
}

export function getData() {
  let groups = getGroups();

  return {
    groups: groups,
    conventions: getConventionData(),
    gameStores: getGameStores(),
    gameRestaurants: getGameRestaurants(),
  };
}
