import {BaseDynamicComponent} from "@bponnaluri/places-js";

import {SHOW_LIST_STORE} from "../../data/list/SearchStores.ts";
import {generateLinkButton} from "../../shared/html/ButtonGenerator.ts";
import {convertDateAndDayToDisplayString, convertLocationDataForDisplay} from "../../shared/EventDataUtils.ts";

export class EventListComponent extends BaseDynamicComponent {
  constructor() {
    super([{
      dataStore: SHOW_LIST_STORE,
      fieldName:"data"
    }])
  }

  override getTemplateStyle(): string {
    return `
      <link rel="preload" as="style" href="/styles/sharedHtmlAndComponentStyles.css" onload="this.rel='stylesheet'"/>
      <style>
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
          ${eventData.dayOfWeek},
          ${convertDateAndDayToDisplayString(eventData.nextEventDate, eventData.day)}
          &#8729; ${(eventData.nextEventTime)}
        </div>
        <div id="event-location">
          ${convertLocationDataForDisplay(eventData.eventLocation)}
        </div>
  
      </li>
    `;
  }
  
  render(state: any): string {

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
