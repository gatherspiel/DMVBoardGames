import {BaseDynamicComponent, type LoadingIndicatorConfig} from "@bponnaluri/places-js";

import {generateLinkButton} from "../../shared/html/ButtonGenerator.ts";
import {convertLocationDataForDisplay} from "../../shared/EventDataUtils.ts";
import {SEARCH_RESULTS_LIST_STORE} from "../../data/list/SearchStores.ts";

const LOADING_INDICATOR_CONFIG:LoadingIndicatorConfig = {
  generateLoadingIndicatorHtml: ()=>{
    return `
      <div class="loader">
        
        <div class="meeple" id="meeple-one">  
          <img src="/assets/images/meeple_small.png">
        </div>
        
        <div class="meeple"  id="meeple-two">
          <img src="/assets/images/meeple_small.png">
        </div>
        
        <div class="meeple"  id="meeple-three">
          <img src="/assets/images/meeple_small.png">
        </div>
        
        <div class="meeple"  id="meeple-four" >
          <img src="/assets/images/meeple_small.png">
        </div>
        
        <div class="meeple"  id="meeple-five" >
          <img src="/assets/images/meeple_small.png">
        </div>
        
        <div class="meeple"  id="meeple-six" >
            <img src="/assets/images/meeple_small.png">
        </div>
        <div class="meeple"  id="meeple-seven" >
          <img src="/assets/images/meeple_small.png">
        </div>

</div>
  `
  },
  minTimeMs: 500,

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
  
        #meeple-one {
          position: absolute;
          height:4px;
          width:4px;
          top:50px;
          left:25px;
        }
        #meeple-two {
          position: absolute;
          top:43px;
          left:43px;
        }
        #meeple-three {
          position: absolute;
          top:25px;
          left:50px;
        }
        #meeple-four {
          position: absolute;
          top:7px;
          left:43px;
        }
        #meeple-five {
          position: absolute;
          top:0;
          left:25px;
        }  
        #meeple-six {
          position: absolute;
          top:7px;
          left:7px;
        }  
        #meeple-seven {
          position: absolute;
          top:25px;
          left:0;
        }
        #meeple-seven img {
          height:3px;
          width:3px;
        }
        #meeple-six img {
          height:5px;
          width:5px;
        }
        #meeple-five img {
          height:7px;
          width:7px;
        }
        #meeple-four img {
          height:9px;
          width:9px;
        }
        #meeple-three img {
          height:11px;
          width:11px;
        }
        #meeple-two img {
          height:13px;
          width:13px;
        }
        #meeple-one img {
          height:15px;
          width:15px;
        }
        .loader {
          animation: l27 1s infinite steps(8);
          height: 65px;
          margin-left:auto;
          margin-right:auto;
          margin-top:2rem;
          width: 65px;
      }
      @keyframes l27 {
        100% {
        transform-origin: 32.5px 32.5px;
        transform: rotate(1turn)
        }
      }
      .meeple {
        width:15px;
        height:15px;
        animation: l28 1s infinite steps(8);
      }
      @keyframes l28 {
        100% {
        transform-origin: 7.5px 7.5px;
        transform: rotate(-1turn)
        }
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



