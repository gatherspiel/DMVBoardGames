import { DEFAULT_SEARCH_PARAMETER } from "../search/SearchAPI.js";

export const eventSearchState = {
  day: DEFAULT_SEARCH_PARAMETER,
  location: DEFAULT_SEARCH_PARAMETER,
  cities: [
    {
      id: 0,
      name: "Loading",
    },
  ],
};
