import { API_ROOT } from "../../../../shared/Params.ts";
import { DEFAULT_SEARCH_PARAMETER } from "../../components/event-search/Constants.ts";
import type { SearchParams } from "./model/SearchParams.ts";
import { generateApiThunk } from "../../../../framework/state/update/api/ApiThunkFactory.ts";
import type { ApiRequestConfig } from "../../../../framework/state/update/api/types/ApiRequestConfig.ts";
import {generatePreloadThunk} from "../../../../framework/state/update/PreloadThunk.ts";
import {SEARCH_RESULTS} from "../../../../shared/InitGlobalStateConfig.ts";

const CITY_PARAM = "city";
const DAY_PARAM = "day";
const DISTANCE_PARAM="distance";

function getEventsQueryConfig(searchParams: SearchParams): ApiRequestConfig {
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


export const EVENT_SEARCH_THUNK = generateApiThunk({
  queryConfig: getEventsQueryConfig,
}).addGlobalStateReducer((state:any)=>{
  return {[SEARCH_RESULTS]:state}
})

export const EVENT_PRELOAD_THUNK =
  generatePreloadThunk("preload_"+EVENT_SEARCH_THUNK.requestStoreId)
    .addGlobalStateReducer((state:any)=>{
      return {[SEARCH_RESULTS]:state}
    })

