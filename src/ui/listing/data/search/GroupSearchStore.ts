import { API_ROOT } from "../../../../shared/Params.ts";
import { DEFAULT_SEARCH_PARAMETER } from "../../components/group-search/Constants.ts";
import {ApiLoadAction, DataStore} from "@bponnaluri/places-js";
import type { ApiRequestConfig } from "@bponnaluri/places-js";

function getGroupsQueryConfig(searchParams: any): ApiRequestConfig {
  console.log("Starting to load search results at:"+Date.now());

  const paramMap: any = {};

  if (searchParams.day && searchParams.day !== DEFAULT_SEARCH_PARAMETER) {
    paramMap["day"] = searchParams.day;
  }
  if (
    searchParams?.location &&
    searchParams.location !== DEFAULT_SEARCH_PARAMETER
  ) {
    paramMap["city"] = searchParams.location;

    if(searchParams.distance){
      paramMap["distance"] = searchParams.distance;
    }
  }

  let url = API_ROOT + "/searchGroups";
  if (Object.keys(paramMap).length > 0) {

    let params: string[] = [];
    Object.keys(paramMap).forEach((param) => {
      params.push(param + "=" + paramMap[param].replace(" ", "%20"));
    });
    url += `?${params.join("&")}`;
  }
  return {
    url: url,
  };
}

export const GROUP_SEARCH_STORE = new DataStore(new ApiLoadAction(getGroupsQueryConfig));