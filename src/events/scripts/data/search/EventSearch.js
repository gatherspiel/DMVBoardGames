import { getGroups } from "../mock/ListingData.js";

export const DEFAULT_SEARCH_PARAMETER = "any";

export const CITY_PARAM = "city";
export const DAY_PARAM = "day";

function getQueryUrl(searchParams) {
  console.log(import.meta.env.VITE_API_ROOT);
  let url = import.meta.env.VITE_API_ROOT + "/searchEvents";

  const paramMap = {};
  if (searchParams.day && searchParams.day !== DEFAULT_SEARCH_PARAMETER) {
    paramMap[DAY_PARAM] = searchParams.day;
  }

  if (
    searchParams.location &&
    searchParams.location !== DEFAULT_SEARCH_PARAMETER &&
    searchParams.location !== undefined
  ) {
    console.log(searchParams.location);
    paramMap[CITY_PARAM] = searchParams.city;
  }

  if (paramMap && Object.keys(paramMap).length > 0) {
    let queryString = "?";

    let params = [];
    Object.keys(paramMap).forEach(function (param) {
      params.push(param + "=" + paramMap[param]);
    });
    queryString += params.join("&");
    url += queryString;
  }
  return url;
}

export async function getSearchResultGroups(searchParams) {
  console.log(import.meta.env.VITE_USE_API_MOCK);
  if (import.meta.env.VITE_USE_API_MOCK === "false") {
    const url = getQueryUrl(searchParams);
    const response = await fetch(url);

    if (response.status !== 200) {
      console.log(
        "Did not retrieve search results from API. Mock data will be used",
      );
      return getGroups();
    }
    console.log(response.status);
    console.log(response);
    const result = await response.json();

    console.log("Results:" + JSON.stringify(result));
    return result.groupData;
  } else {
    console.log("Backend not configured. Mock data will be returned");
    return getGroups();
  }
}
