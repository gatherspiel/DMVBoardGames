import { API_ROOT, USE_MOCK } from "../../../../utils/params.ts";
import { DEFAULT_SEARCH_PARAMETER } from "../../components/event-search/Constants.ts";
import { getGroups } from "../mock/MockPageData.ts";
import type { SearchParams } from "./model/SearchParams.ts";
import { generateGetApiReducer } from "../../../../framework/reducer/api/ApiReducerFactory.ts";

const CITY_PARAM = "city";
const DAY_PARAM = "day";

function getEventsQueryUrl(searchParams: SearchParams) {
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
  }

  if (paramMap && Object.keys(paramMap).length > 0) {
    let queryString = "?";

    let params: string[] = [];
    Object.keys(paramMap).forEach(function (param) {
      params.push(param + "=" + paramMap[param].replace(" ", "%20"));
    });
    queryString += params.join("&");
    url += queryString;
  }
  return url;
}

const defaultFunctionConfig = {
  defaultFunction: getGroups,
  defaultFunctionPriority: USE_MOCK,
};

export const EVENT_LIST_REDUCER = generateGetApiReducer({
  queryUrl: getEventsQueryUrl,
  defaultFunctionConfig: defaultFunctionConfig,
});
