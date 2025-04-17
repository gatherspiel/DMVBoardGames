import { DEFAULT_SEARCH_PARAMETER } from "../../data/search/SearchAPI.js";

/**
 * Possbile idea for shared state logic
 *
 * stateName is a constant
 * Framework.createState(stateName)
 *
 * Updates->Framework.updateState(stateName, updateFunction)
 *
 * Framework.subscribeToDate. function(stateName, component){
 *   subscribers[stateName].add(component)
 * }
 * Framework.updateState. function(stateName, updateFunction, data){
 *   updateFunction(data);
 *   updateSubscriberData()
 * }
 * @type {*[]}
 */
const eventSearchStateSubscribedComponents = [];

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

export function subscribeToSearchState(component) {
  eventSearchStateSubscribedComponents.push(component);
}

export function updateSubscriberData() {
  eventSearchStateSubscribedComponents.forEach(function (component) {
    component.updateData(eventSearchState);
  });
}
export function updateCities(cities) {
  console.log("Updating");
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

  eventSearchState.cities = cityData;
  updateSubscriberData();
}
