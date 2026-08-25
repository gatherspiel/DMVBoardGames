import { ContainerComponent, PresentationComponent} from "/lib/places-js-latest.js";
import { LOADING_INDICATOR_CONFIG } from "../../shared/LoadingIndicatorConfig.js";
import { SEARCH_RESULTS_LIST_STORE } from "../../data/list/SearchStores.js";
import { convertLocationDataForDisplay } from "../../shared/EventDataUtils.js";

export class EventListComponent extends ContainerComponent {
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
      //LOADING_INDICATOR_CONFIG
    );
  }

	hasData(){
		return {
			showIf: (state)=>{
				return state?.status === "Waiting for user input" ||
					!state.data || state.data.length > 0
			},
			fallback: `
				<div class="container-xl fade-in-animation">
          <p id="no-events-found">No events found</p>
          <div class="section-separator-small"></div> 
				</div>
			`,
			isVisible: `
				<h1 id="search-results-header">Event search results</h1>
				<ul
					data-array=data
					data-presentation-component=EventItem
				></ul>
			`
		}
	}
  
	render(state) {	
    return `
			<div
				data-show-if="hasData" 
				class="container-xl fade-in-animation">
      </div>
		`;  
  }
}

class EventItem extends PresentationComponent {
  
    defineComputedState(){
      return {
        "eventTime": (eventData) =>{
          if(eventData.isRecurring){
            return `${eventData.dayOfWeek}s at ${eventData.nextEventTime}`;
          }
          return `${eventData.nextEventDate} at ${eventData.nextEventTime}`
        },
        "location":(eventData)=>{
          return `${convertLocationDataForDisplay(eventData.eventLocation)}`
        },
       "url": (eventData) => {
          return `/html/groups/event.html?id=${eventData.eventId}&groupId=${eventData.groupId}`
        } 
      }
    }

    defineTemplate(){
      return `<li>
        <a 
          class="btn secondary"
					href={{url}}
        >
          {{eventName}}
				</a>
        <div 
					class="event-time" 
				> 
					{{eventTime}}
        </div>
        <div
					class="event-location"
				> 
					{{location}}	
        </div> 
      </li>
    `;
  }
}

PresentationComponent.init(EventItem);

