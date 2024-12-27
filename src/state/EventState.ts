import { atom } from "jotai";
import {
  GROUP_1,
  GROUP_2,
  GROUP_3,
  GROUP_4,
  GROUP_6,
  GROUP_7,
  GROUP_8,
  GROUP_9,
  GROUP_10,
  GROUP_11,
  GROUP_12,
  GROUP_13,
  GROUP_14,
  GROUP_15,
  GROUP_16,
  GROUP_17,
  GROUP_18,
  GROUP_19,
  GROUP_20,
  GROUP_21,
  GROUP_22,
  GROUP_23,
  GROUP_24,
  GROUP_25,
} from "../data/GroupData.ts";
import {CONVENTION_1} from "../data/ConventionData.ts";
import { gameStores } from "../data/GameStoreData.ts";
import { Group } from "../data/ObjectConfig.ts";
import {DEFAULT_SEARCH_PARAMETER, findResults} from "../data/search/search.ts";

const backendDataAtom = atom('');
//In the future, this atom will asynchronously fetch data from a backend API or cache.
export const fetchEventDataAtom = atom(async (get) => {

  const data = get(backendDataAtom);
  console.log("Backend data:"+data);
  const groups: Group[] = [
    GROUP_1,
    GROUP_2,
    GROUP_3,
    GROUP_4,
    GROUP_6,
    GROUP_7,
    GROUP_8,
    GROUP_9,
    GROUP_10,
    GROUP_11,
    GROUP_12,
    GROUP_13,
    GROUP_14,
    GROUP_15,
    GROUP_16,
    GROUP_17,
    GROUP_18,
    GROUP_19,
    GROUP_20,
    GROUP_21,
    GROUP_22,
    GROUP_23,
    GROUP_24,
    GROUP_25,
  ];
  groups.sort((a, b) => {
    if (a.title < b.title) {
      return -1;
    }
    if (a.title > b.title) {
      return 1;
    }

    return 0;
  });

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

  return {
    groups: groups,
    conventions: [CONVENTION_1],
    gameStores: sortedGameStores,
  };
});

export const searchStateAtom = atom({ day: DEFAULT_SEARCH_PARAMETER, location: DEFAULT_SEARCH_PARAMETER });

export const readWriteSearchState = atom(
  (get) => get(searchStateAtom),
  (get, set, update) => {
    console.log(get);
    // @ts-expect-error Ignore
    set(searchStateAtom, update);
  },
);

export const resultsAtom = atom(async (get) => {
  const search = get(searchStateAtom);
  const data = await get(fetchEventDataAtom);
  return findResults(data,search);
});

export const searchLocationsAtom = atom(async(get)=>{
  const data = await get(fetchEventDataAtom);
  const locations = new Set();
  data.groups.forEach(group=>{
    group.locations.split(",").forEach(location=>{
      locations.add(location.trim())
    });
  })

  const locationArray = Array.from(locations)

  locationArray.sort();
  locationArray.unshift(DEFAULT_SEARCH_PARAMETER)
  return locationArray;
})
