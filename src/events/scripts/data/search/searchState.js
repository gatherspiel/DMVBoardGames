import { DEFAULT_SEARCH_PARAMETER } from "./search.js";

export const searchState = {
  day: DEFAULT_SEARCH_PARAMETER,
  location: DEFAULT_SEARCH_PARAMETER,
  locations: [
    {
      id: 0,
      name: "Loading",
    },
  ],
};
