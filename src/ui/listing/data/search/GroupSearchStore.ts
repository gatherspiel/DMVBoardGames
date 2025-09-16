import { API_ROOT } from "../../../../shared/Params.ts";
import { DEFAULT_SEARCH_PARAMETER } from "../../components/group-search/Constants.ts";
import {ApiLoadAction, DataStore} from "@bponnaluri/places-js";
import type { ApiRequestConfig } from "@bponnaluri/places-js";

function getGroupsQueryConfig(searchParams: any): ApiRequestConfig {
  console.log("Starting to load search results at:"+Date.now());

  let url = API_ROOT + "/searchGroups";

  const paramMap: any = {};

  if (searchParams.day && searchParams.day !== DEFAULT_SEARCH_PARAMETER) {
    paramMap["day"] = searchParams.day;
  }
  if (
    searchParams.location &&
    searchParams.location !== DEFAULT_SEARCH_PARAMETER &&
    searchParams.location !== undefined
  ) {
    paramMap["city"] = searchParams.location;

    if(searchParams.distance){
      paramMap["distance"] = searchParams.distance;
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

export const GROUP_SEARCH_STORE = new DataStore(new ApiLoadAction(getGroupsQueryConfig));