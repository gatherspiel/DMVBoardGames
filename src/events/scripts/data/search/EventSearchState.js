import { DEFAULT_SEARCH_PARAMETER } from "./EventSearch.js";

export const eventSearchState = {
  day: DEFAULT_SEARCH_PARAMETER,
  location: DEFAULT_SEARCH_PARAMETER,
  locations: [
    {
      id: 0,
      name: "Loading",
    },
  ],
};
