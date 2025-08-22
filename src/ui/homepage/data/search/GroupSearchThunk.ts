import { API_ROOT } from "../../../../shared/Params.ts";
import { DEFAULT_SEARCH_PARAMETER } from "../../components/group-search/Constants.ts";
import type { SearchParams } from "./model/SearchParams.ts";
import { generateApiThunk } from "@bponnaluri/places-js";
import type { ApiRequestConfig } from "@bponnaluri/places-js";

const CITY_PARAM = "city";
const DAY_PARAM = "day";
const DISTANCE_PARAM="distance";

function getGroupsQueryConfig(searchParams: SearchParams): ApiRequestConfig {
  let url = API_ROOT + "/searchEvents";

  const paramMap: any = {};

  if (searchParams.day && searchParams.day !== DEFAULT_SEARCH_PARAMETER) {
    paramMap[DAY_PARAM] = searchParams.day;
  }
  if (
    searchParams.location &&
    searchParams.location !== DEFAULT_SEARCH_PARAMETER &&
    searchParams.location !== undefined
  ) {
    paramMap[CITY_PARAM] = searchParams.location;

    if(searchParams.distance){
      paramMap[DISTANCE_PARAM] = searchParams.distance;
    }
  }

  if (paramMap && Object.keys(paramMap).length > 0) {
    let queryString = "?";

    let params: string[] = [];
    Object.keys(paramMap).forEach((param) => {
      params.push(param + "=" + paramMap[param].replace(" ", "%20"));
    });
    queryString += params.join("&");
    url += queryString;
  }
  return {
    url: url,
  };
}


export const GROUP_SEARCH_THUNK = generateApiThunk({
  queryConfig: getGroupsQueryConfig,
})

GROUP_SEARCH_THUNK.enablePreload();