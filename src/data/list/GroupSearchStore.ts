import { API_ROOT } from "../../ui/shared/Params.ts";
import {ApiLoadAction, CustomLoadAction, DataStore} from "@bponnaluri/places-js";
import type { ApiRequestConfig } from "@bponnaluri/places-js";
import {DEFAULT_SEARCH_PARAMETER} from "../../shared/html/SelectGenerator.ts";

function getGroupsQueryConfig(searchParams: any): ApiRequestConfig {

  console.log("Starting to load search results at:"+Date.now());
  const paramMap: any = {};

  if (searchParams.days && searchParams.days !== DEFAULT_SEARCH_PARAMETER) {
    paramMap["days"] = searchParams.days;
  }
  if (
    searchParams?.location &&
    searchParams.location !== DEFAULT_SEARCH_PARAMETER
  ) {
    paramMap["city"] = searchParams.location;

    if(searchParams.distance){
      paramMap["distance"] = searchParams.distance.split(" ")[0];
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

export const SHOW_GROUP_LIST_STORE = new DataStore(new CustomLoadAction(()=>{}));
