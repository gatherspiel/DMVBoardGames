import { BaseDynamicComponent } from "/lib/places-js-latest.js";
import { LOADING_INDICATOR_CONFIG } from "../../shared/LoadingIndicatorConfig.js";
import { SEARCH_RESULTS_LIST_STORE } from "../../data/list/SearchStores.js";
import { convertLocationDataForDisplay } from "../../shared/EventDataUtils.js";

export class EventListComponent extends BaseDynamicComponent {
  constructor() {
    super(
      [
        {
          dataStore: SEARCH_RESULTS_LIST_STORE,
          fieldName: "data",
        },
      ],
      LOADING_INDICATOR_CONFIG
    );
  }

  getItemHtml(eventData) {
    return `
      <li>
        <a 
          class="btn secondary"
          href= "/html/groups/event.html?id=${eventData.eventId}&groupId=${eventData.groupId}",
        >${eventData.eventName}</a> 
        <div id="event-time">
          ${eventData.isRecurring ? 
            `
              ${eventData.dayOfWeek}s at ${eventData.nextEventTime}
            ` :
            `
              ${eventData.nextEventDate} at ${eventData.nextEventTime}

          `}
        </div>
        <div id="event-location">
          ${convertLocationDataForDisplay(eventData.eventLocation)}
        </div> 
      </li>
    `;
  }

  render(state) {
    if (state?.status === "Waiting for user input" ||
      !state.data.eventData  ||
      !state.data) {
      return ``;
    }

    if (state.data.eventData.length === 0) {
      return `
        <p id="no-events-found">No events found</p>
        <div class="section-separator-small"></div> 
      `;
    }
    let html = `
      <div class="container-xl fade-in-animation">
      <h1 id="search-results-header">Event search results</h1>
      <ul>`;
    for (let i = 0; i < state.data.eventData.length; i++) {
      html += `
        ${this.getItemHtml(state.data.eventData[i])}
        <div class="section-separator-small"></div> 
      `;
    }
    return html + `</ul></div>`;
  }
}
