import { atom } from "jotai";

import { CONVENTION_1, GROUP_1, GROUP_2, GROUP_3 } from "../data/GroupData.ts";
const eventDataAtom = atom();
//In the future, this atom will asynchronously fetch data from a backend API or cache.
export const fetchEventDataAtom = atom(async (get) => {
  const response = await get(eventDataAtom);
  console.log(response);
  return {
    groups: [GROUP_1, GROUP_2, GROUP_3],
    conventions: [CONVENTION_1],
  };
});
