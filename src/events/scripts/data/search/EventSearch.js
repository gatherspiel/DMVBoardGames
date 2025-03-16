import { SearchResult } from "./model/SearchResult.js";

export const DEFAULT_SEARCH_PARAMETER = "any";

export const UNDEFINED_EVENT_LOCATION_PARAMETER =
  "See group on Meetup for location";

const emptySearchResult = {
  groups: [],
};

function findResults(data, searchParams) {
  if (!data || Object.keys(data).length === 0) {
    return emptySearchResult;
  }

  const searchResult = new SearchResult(data);

  if (searchParams.isDefault()) {
    console.log("Default");
    return searchResult;
  }

  searchResult.filterResults(searchParams);
  return searchResult;
}

export function getSearchResultGroups(data, searchParams) {
  const searchResults = findResults(data, searchParams);
  console.log(searchResults);
  return searchResults.groups;
}
