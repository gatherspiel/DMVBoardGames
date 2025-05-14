import { BaseGet } from "../../../../framework/api/BaseGet.ts";
import { API_ROOT, USE_MOCK } from "../../../../utils/params";
import { DEFAULT_SEARCH_PARAMETER } from "../../components/event-search/Constants.ts";
import { getGroups } from "../mock/MockPageData";
import { BaseStateUpdate } from "../../../../framework/api/BaseStateUpdate.ts";
import {
  GROUP_SEARCH_RESULT_STATE_NAME,
  updateSearchResultState,
} from "../state/SearchResultGroupState";
import { BaseAPI } from "../../../../framework/api/BaseAPI.ts";

const CITY_PARAM = "city";
const DAY_PARAM = "day";

export const DE = {
  day: DEFAULT_SEARCH_PARAMETER,
  location: DEFAULT_SEARCH_PARAMETER,
  cities: [
    {
      id: 0,
      name: "Loading",
    },
  ],
};

function getEventsQueryUrl(searchParams: any) {
  let url = API_ROOT + "/searchEvents";
  const paramMap: any = {};
  if (searchParams.day && searchParams.day !== DEFAULT_SEARCH_PARAMETER) {
    paramMap[DAY_PARAM] = searchParams.day;
  }

  if (
    searchParams.city &&
    searchParams.city !== DEFAULT_SEARCH_PARAMETER &&
    searchParams.city !== undefined
  ) {
    paramMap[CITY_PARAM] = searchParams.city;
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

const searchEvents: BaseGet = new BaseGet(getEventsQueryUrl, {
  defaultFunction: getGroups,
  defaultFunctionPriority: USE_MOCK,
});

const updateEvents: BaseStateUpdate = new BaseStateUpdate(
  GROUP_SEARCH_RESULT_STATE_NAME,
  updateSearchResultState,
  "groupData",
);

export const EVENT_SEARCH_API = new BaseAPI(searchEvents, [updateEvents]);
