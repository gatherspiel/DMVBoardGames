import { API_ROOT } from "../../ui/shared/Params.ts";
import {ApiLoadAction, DataStore} from "@bponnaluri/places-js";
import type { ApiRequestConfig } from "@bponnaluri/places-js";
import {DEFAULT_SEARCH_PARAMETER} from "../../shared/html/SelectGenerator.ts";

function getSearchResultsQueryConfig(searchParams: any): ApiRequestConfig {

  console.log(searchParams);

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

  if(!searchParams.apiUrl.startsWith("/")){
    console.error("Invalid url:"+searchParams.apiUrl);
  }
  let url = API_ROOT + searchParams.apiUrl;
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

export const SEARCH_RESULTS_LIST_STORE = new DataStore(new ApiLoadAction(getSearchResultsQueryConfig));

SEARCH_RESULTS_LIST_STORE.updateStoreData({status:"Waiting for user input"})