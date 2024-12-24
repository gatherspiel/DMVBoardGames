import { atom } from "jotai";
import { Event } from "../data/ObjectConfig.ts";
import {
  CONVENTION_1,
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
import { gameStores } from "../data/GameStoreData.ts";
import { Group } from "../data/ObjectConfig.ts";
const eventDataAtom = atom();
//In the future, this atom will asynchronously fetch data from a backend API or cache.
export const fetchEventDataAtom = atom(async (get) => {
  const response = await get(eventDataAtom);
  console.log(response);

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
  console.log("Sorting game stores");

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

export const searchStateAtom = atom({ day: "Any" });

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

  const searchDay = search.day;

  //TODO: Add isDefaultMethod here.
  console.log(searchDay);
  if (searchDay === "Any" || !searchDay) {
    return data;
  }
  const eventCopy = JSON.parse(JSON.stringify(data));

  const groupsToInclude: Group[] = [];

  console.log("Updating events");
  eventCopy.groups.forEach((group: Group) => {
    const eventsToInclude: Event[] = [];
    group.events.forEach((event: Event) => {
      if (event.day === searchDay) {
        //TODO: Add other search parameters here.
        eventsToInclude.push(event);
      }
    });

    if (eventsToInclude.length > 0) {
      group.events = eventsToInclude;
      groupsToInclude.push(group);
    }
  });
  eventCopy.groups = groupsToInclude;
  return eventCopy;
});
