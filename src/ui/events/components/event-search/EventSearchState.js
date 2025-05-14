import { DEFAULT_SEARCH_PARAMETER } from "./Constants.ts";

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

export function updateCities(cities) {
  const cityArray = Array.from(cities);
  cityArray.sort();
  cityArray.unshift(DEFAULT_SEARCH_PARAMETER);

  let id = 0;
  const cityData = [];
  cityArray.map((location) => {
    cityData.push({
      id: id,
      name: location,
    });
    id++;
  });

  return {
    cities: cityData,
  };
}
