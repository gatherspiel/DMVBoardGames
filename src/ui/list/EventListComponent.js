import { BaseDynamicComponent } from "/lib/places-js-latest.js";
import { LOADING_INDICATOR_CONFIG } from "../../shared/LoadingIndicatorConfig.js";
import { SEARCH_RESULTS_LIST_STORE } from "../../data/list/SearchStores.js";
import { convertLocationDataForDisplay } from "../../shared/EventDataUtils.js";

const EventItem = () => {

		EventItem.eventTime = (eventData) =>{
			if(eventData.isRecurring){
				return `${eventData.dayOfWeek}s at ${eventData.nextEventTime}`;
			}
			return `${eventData.nextEventDate} at ${eventData.nextEventTime}`
		}

		EventItem.url = (eventData) => {
			return `/html/groups/event.html?id=${eventData.eventId}&groupId=${eventData.groupId}`
		}
		
		EventItem.location = (eventData)=>{
			return `${convertLocationDataForDisplay(eventData.eventLocation)}`
		}
		 
		return `<li>
        <a 
          class="btn secondary"
					{{href=url}}
					{{textContent=eventName}}
        ></a>
        <div 
					class="event-time" 
					{{textContent=eventTime}}>
        </div>
        <div
					class="event-location"
					{{textContent=location}}	
				>
        </div> 
      </li>
  `;
}

BaseDynamicComponent.defineTemplate(EventItem,"EventItem");

export class EventListComponent extends BaseDynamicComponent {
  constructor() {
    super(
      [
        {
					componentReducer: (data)=>{
						console.log(data);
						if(data?.eventData?.length){	
							for(let i=0;i<data.eventData.length;i++)						{
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

	
  render(state) {
		
    if (state?.status === "Waiting for user input" ||
      !state.data) {
      return ``;
    }

    if (state.data.length === 0) {
      return `
        <div class="container-xl fade-in-animation">
          <p id="no-events-found">No events found</p>
          <div class="section-separator-small"></div> 
        </div>
      `;
    }
    let html = `
      <div class="container-xl fade-in-animation">
      <h1 id="search-results-header">Event search results</h1>
      <ul
				data-array=data
				data-template-name=EventItem
			>
			</ul>`;
    
    return html + `</div>`;
  }
}
