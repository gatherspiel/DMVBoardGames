import { DEFAULT_SEARCH_PARAMETER } from "./Constants.js";

//TODO: Make sure this stored in framework in state manager instead of a global variable
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
