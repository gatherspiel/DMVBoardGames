import { PresentationComponent} from "/lib/places-js-latest.js";
import { LOADING_INDICATOR_CONFIG } from "../../shared/LoadingIndicatorConfig.js";
import { SEARCH_RESULTS_LIST_STORE } from "../../data/list/SearchStores.js";
import { convertLocationDataForDisplay } from "../../shared/EventDataUtils.js";

export class EventListComponent extends PresentationComponent {
  constructor() {
    super(
      [
        {
					componentReducer: (data)=>{
						if(data?.eventData?.length){	
							for(let i=0;i<data.eventData.length;i++) {
								data.eventData[i].id = data.eventData[i].eventId;
							}
						}
						return {"data":data.eventData};
					},
					dataStore: SEARCH_RESULTS_LIST_STORE,
        },
      ],
      LOADING_INDICATOR_CONFIG,
    );
  }
  
	
}


