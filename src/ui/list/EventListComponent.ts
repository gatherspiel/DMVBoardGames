import {BaseDynamicComponent, type LoadingIndicatorConfig} from "@bponnaluri/places-js";

import {generateLinkButton} from "../../shared/html/ButtonGenerator.ts";
import {convertLocationDataForDisplay} from "../../shared/EventDataUtils.ts";
import {SEARCH_RESULTS_LIST_STORE} from "../../data/list/SearchStores.ts";

const LOADING_INDICATOR_CONFIG:LoadingIndicatorConfig = {
  generateLoadingIndicatorHtml: ()=>{
    console.log("Generating loading indicator")
    return `
      <div class="loader">
        <img src="/assets/images/meeple_small.png"/>
                <img src="/assets/images/meeple_small.png"/>

</div>
  `
  },
  minTimeMs: 999999,

}


export class EventListComponent extends BaseDynamicComponent {
  constructor() {
    super([{
      dataStore: SEARCH_RESULTS_LIST_STORE,
      fieldName:"data"
    }],
    LOADING_INDICATOR_CONFIG)
  }



  override getTemplateStyle(): string {
    return `
      <link rel="preload" as="style" href="/styles/sharedHtmlAndComponentStyles.css" onload="this.rel='stylesheet'"/>
      <style>
      
      /* HTML:  */
/* HTML: <div class="loader"></div> */
.loader {
  --d:22px;
  width: 4px;
  height: 4px;
  border-radius: 50%;
  color: #25b09b;
  box-shadow: 
    calc(1*var(--d))      calc(0*var(--d))     0 0,
    calc(0.707*var(--d))  calc(0.707*var(--d)) 0 1px,
    calc(0*var(--d))      calc(1*var(--d))     0 2px,
    calc(-0.707*var(--d)) calc(0.707*var(--d)) 0 3px,
    calc(-1*var(--d))     calc(0*var(--d))     0 4px,
    calc(-0.707*var(--d)) calc(-0.707*var(--d))0 5px,
    calc(0*var(--d))      calc(-1*var(--d))    0 6px;
  animation: l27 1s infinite steps(8);
}
@keyframes l27 {
  100% {transform: rotate(1turn)}
}



       li {
          padding-bottom: 1rem;
          padding-top:1rem;
        }
        h1 {
          font-size: 3rem;
        }
        ul {
          list-style:url(/assets/images/meeple_small.png);
          margin-top:0;
          padding-left:1.5rem;
        }
       .button-div {
          display: flex;
        }
        #event-location,#event-time {
          margin-top:0.5rem;
        }
        .section-separator-small {
          margin-left:-1rem;
        }
        @media not screen and (width < 32em) {
          .group-cities {
            display: inline-block;
            margin-left: 2rem;
          }
          .raised {
            display: inline-block;
          }
          #search-results-header {
            padding-left:1.5rem;
          }
        }  
        @media screen and (width < 32em) {
          a {
            margin-top: 1rem;
          }
          #search-results-header {
            text-align: center;
          }
          .ui-section .event-group:not(:first-child) {
            margin-top: 0.5rem;
          }
          .raised {
            margin-top: 0.5rem;
          }
        } 
      </style>
    `;
  }

  private getItemHtml(eventData: any) {


    return `
      <li>
        ${generateLinkButton({
          text: eventData.eventName,
          url: `/html/groups/event.html?id=${eventData.eventId}&groupId=${eventData.groupId}`
        })}
       
        <div id="event-time">
          ${eventData.dayOfWeek}s at ${(eventData.nextEventTime)}
        </div>
        <div id="event-location">
          ${convertLocationDataForDisplay(eventData.eventLocation)}
        </div>
  
      </li>
    `;
  }
  
  render(state: any): string {

    if(state?.status === "Waiting for user input" || !state.data.eventData){
      return ``;
    }

    console.log("Rendering event list component")
    if(!state.data){
      return ``;
    }
    if(state.data.eventData.length === 0){
      return `
          <p>No events found</p>
          <div class="section-separator-small"></div> 
        `
    }
    let html = `
      <h1 id="search-results-header">Search results</h1>
      <ul>`;
    for(let i = 0; i<state.data.eventData.length; i++){
      html+= `
          ${this.getItemHtml(state.data.eventData[i])}
          <div class="section-separator-small"></div> 
      `
    }
    return html + `</ul>`;
  }
}



