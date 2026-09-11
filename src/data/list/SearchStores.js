import { DataStore } from "/lib/places-js-latest.js";

import { API_ROOT } from "../../ui/shared/Params.js";
import { DEFAULT_SEARCH_PARAMETER } from "../../shared/html/SelectGenerator.js";
import { convertLocationDataForDisplay} from "/shared/EventDataUtils.js";

function getSearchResultsQueryConfig(searchParams) {
  const paramMap = {};

  if (searchParams.days && searchParams.days !== DEFAULT_SEARCH_PARAMETER) {
    paramMap["days"] = searchParams.days;
  }
  if (
    searchParams?.location &&
    searchParams.location !== DEFAULT_SEARCH_PARAMETER
  ) {
    paramMap["city"] = searchParams.location;

    if (searchParams.distance) {
      paramMap["distance"] = searchParams.distance.split(" ")[0];
    }
  }

  if(searchParams.userGroupEvents){
    paramMap["userGroupEvents"] = searchParams.userGroupEvents;
  }
  
  if (!searchParams.apiUrl.startsWith("/")) {
    console.error("Invalid url:" + searchParams.apiUrl);
  }
  let url = API_ROOT + searchParams.apiUrl;
  if (Object.keys(paramMap).length > 0) {
    let params = [];
    Object.keys(paramMap).forEach((param) => {
      params.push(param + "=" + paramMap[param].replace(" ", "%20"));
    });
    url += `?${params.join("&")}`;
  }
  return {
    url: url,
  };
}

const presentationSignals = {
	"eventData":{
		"id": (eventData)=>eventData.eventId,
		"update":{
			"eventTime":
				(eventData)=>{
					if(eventData.isRecurring){
            return `
							${eventData.dayOfWeek}s at 
							${eventData.nextEventTime}`;
          }
          return `
						${eventData.nextEventDate} at 
						${eventData.nextEventTime}`
        },
			 "location":(eventData)=>{
          return `${convertLocationDataForDisplay(eventData.eventLocation)}`
        },
       "url": (eventData) => {
          return `/html/groups/event.html?id=${eventData.eventId}&groupId=${eventData.groupId}`
				} 
		}
	}
}

export const SEARCH_RESULTS_LIST_STORE =
  DataStore.createWithApiLoadSignal({
    "queryConfig":getSearchResultsQueryConfig,
    "presentationSignals":presentationSignals,
    "storeName":'search-results-list-store'
});


export function searchWithDefaultParams(apiUrl){
  const initialParams = new URLSearchParams(document.location.search);
  const defaultSearchParams = {
      apiUrl: apiUrl,
      cityList:[DEFAULT_SEARCH_PARAMETER],
      days: initialParams.get("days"),
      distance: initialParams.get("distance")?.replaceAll("_", " "),
      location: initialParams.get("location"),
    };
  SEARCH_RESULTS_LIST_STORE.fetchData(defaultSearchParams);   
}

