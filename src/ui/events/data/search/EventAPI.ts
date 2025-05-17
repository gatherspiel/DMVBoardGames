import { BaseGetRequest } from "../../../../framework/update/api/BaseGetRequest.ts";
import { API_ROOT, USE_MOCK } from "../../../../utils/params.ts";
import { DEFAULT_SEARCH_PARAMETER } from "../../components/event-search/Constants.ts";
import { getGroups } from "../mock/MockPageData.ts";
import { BaseStateUpdate } from "../../../../framework/update/BaseStateUpdate.ts";
import {
  GROUP_SEARCH_RESULT_STATE_NAME,
  updateSearchResultState,
} from "../state/SearchResultGroupState.ts";
import { BaseUpdater } from "../../../../framework/update/BaseUpdater.ts";
import type { SearchParams } from "./model/SearchParams.ts";

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

const searchEvents: BaseGetRequest = new BaseGetRequest(getEventsQueryUrl, {
  defaultFunction: getGroups,
  defaultFunctionPriority: USE_MOCK,
});

const updateEvents: BaseStateUpdate = new BaseStateUpdate(
  GROUP_SEARCH_RESULT_STATE_NAME,
  updateSearchResultState,
  "groupData",
);

export const EVENT_SEARCH_API = new BaseUpdater(searchEvents, [updateEvents]);
