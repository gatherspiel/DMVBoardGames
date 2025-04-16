import { gameStores } from "./MockGameStoreData.js";
import { gameRestaurants } from "./MockGameRestaurantData.js";
import { GROUP_DATA } from "./MockGroupData.js";
import { getConventionData } from "./MockConventionData.js";

export function getGroups() {
  let groups = structuredClone(Object.values(GROUP_DATA));
  groups.sort((a, b) => {
    if (a.title < b.title) {
      return -1;
    }
    if (a.title > b.title) {
      return 1;
    }

    return 0;
  });
  return groups;
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
