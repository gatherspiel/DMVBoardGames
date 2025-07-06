import {BaseTemplateDynamicComponent} from "../../../../framework/components/BaseTemplateDynamicComponent.ts";
import {
  END_TIME_INPUT,
  EVENT_DESCRIPTION_INPUT, EVENT_LOCATION_INPUT,
  EVENT_NAME_INPUT,
  EVENT_URL_INPUT,
  GET_EVENT_REQUEST_STORE,
  GROUP_NAME_PARAM, START_DATE_INPUT, START_TIME_INPUT
} from "../../Constants.ts";
import {getUrlParameter} from "../../../../framework/utils/UrlParamUtils.ts";
import {EVENT_REQUEST_THUNK} from "../data/EventRequestThunk.ts";
import type {EventDetailsData} from "../data/EventDetailsData.ts";
import {
  CANCEL_EDIT_EVENT_DETAILS_CONFIG,
  EDIT_EVENT_DETAILS_CONFIG,
  SAVE_EVENT_CONFIG
} from "../EditEventDetailsHandler";
import {
  convertDateTimeForDisplay,
  convertDayOfWeekForDisplay,
  convertLocationStringForDisplay, getDateFromDateString, getTimeFromDateString
} from "../../../../framework/utils/DateUtils.ts";
import {UPDATE_EVENT_REQUEST_THUNK} from "../data/UpdateEventThunk.ts";

const template = `
  <link rel="stylesheet" type="text/css" href="/styles/sharedComponentStyles.css"/>
  <style>   
  
    #event-name-input {
      width: 50rem;
    }
    .event-description-input {
      width: 50rem;
      height: 10rem;
    }
    .event-location-input {
      width: 50rem;
    }
  </style>
`;


const loadConfig = {
  onLoadStoreConfig: {
    storeName: GET_EVENT_REQUEST_STORE,
    dataSource: EVENT_REQUEST_THUNK,
  },
  onLoadRequestData: {
    name: getUrlParameter(GROUP_NAME_PARAM),
  },
  thunkReducers: [
    {
      thunk: EVENT_REQUEST_THUNK,
      componentStoreReducer: function (data: any) {
        return data;
      },
    },
    {
      thunk: UPDATE_EVENT_REQUEST_THUNK,
      componentStoreReducer: function (data:any) {
        if (data.errorMessage) {
          return {
            errorMessage: data.errorMessage,
            successMessage: "",
          };
        } else {
          return {
            isEditing: false,
            errorMessage: "",
            successMessage: "Successfully updated event",
          };
        }
      }
    }


  ],
  globalStateLoadConfig: {
    globalFieldSubscriptions: ["isLoggedIn"],
    waitForGlobalState: "isLoggedIn",
  },
};

export class EventDetailsComponent extends BaseTemplateDynamicComponent {
  constructor() {
    super("group-event-component", loadConfig);
  }

  render(data: EventDetailsData): string {
    return data.isEditing ? this.renderEditMode(data) : this.renderViewMode(data);
  }

  renderEditMode(data:EventDetailsData): string {
    return `<h1>Editing: ${data.name}</h1>

    <form>
      <label for="event-name">Event Name</label>
      <br>
      <input 
        class="event-data-input"
        id=${EVENT_NAME_INPUT}
        name=${EVENT_NAME_INPUT}
        type="text" 
        value="${data.name}"
      />
      
      <br>
      <label for="event-description">Event Description</label>
      <br>
      <textarea 
        class="event-description-input"
        id=${EVENT_DESCRIPTION_INPUT}
        name=${EVENT_DESCRIPTION_INPUT}
        type="text" 
        >${data.description}</textarea>
      <br>
      <label for="event-url">Event URL</label>
      <br>
      <input 
        class="event-url-input"
        id=${EVENT_URL_INPUT}
        name=${EVENT_URL_INPUT}
        type="text" 
        value="${data.url}"
      />
      <br>
      
      <label for="event-start-date">Start date</label>
      <br>
      <input 
        class="start-time-input"
        id=${START_DATE_INPUT}
        name=${START_DATE_INPUT}
        type="text" 
        value="${getDateFromDateString(data.startTime)}"
      />
      <br>
      <label for="event-start-time">Start time</label>
      <br>
      <input 
        class="start-time-input"
        id=${START_TIME_INPUT}
        name=${START_TIME_INPUT}
        type="text" 
        value="${getTimeFromDateString(data.startTime)}"
      />
      <br>
      <label for="event-name">End time</label>
      <br>
      <input 
        class="end-time-inpt"
        id=${END_TIME_INPUT}
        name=${END_TIME_INPUT}
        type="text" 
        value="${data.endTime}"
      />
      <br>
      <label for="event-name">Event location</label>
      <br>
      <input 
        class="event-location-input"
        id=${EVENT_LOCATION_INPUT}
        name=${EVENT_LOCATION_INPUT}
        type="text" 
        value="${data.location}"
      />
          
    
    </form>
    <p id="update-event-error-message">${data.errorMessage ? data.errorMessage.trim(): ""}</p>
    <p>${data.successMessage ? data.successMessage.trim(): ""}</p>

    <button ${this.createClickEvent(SAVE_EVENT_CONFIG)}>Save event</button>
    <button ${this.createClickEvent(CANCEL_EDIT_EVENT_DETAILS_CONFIG)}>Back to event</button>
   `
  }

  renderViewMode(data:EventDetailsData): string {

    return `
      <div class="ui-section">
        <h1>${data.name}</h1>
        
        <a href="${data.url}">Event page</a>
        
        <p>Time: ${convertDayOfWeekForDisplay(data.day)}, ${convertDateTimeForDisplay(data.startTime)}</p>
        <p>Location: ${convertLocationStringForDisplay(data.location)}</p>
        <p>${data.description}</p>
        ${data.permissions.userCanEdit ?
          `<button ${this.createClickEvent(EDIT_EVENT_DETAILS_CONFIG)}>Edit event</button>  
              ` :
          ``
        }
        
        <a href="/groups.html?name=${encodeURIComponent(data.groupName)}">Back to group</a> 
      </div>
    `;
  }

  getTemplateStyle(): string {
    return template;
  }
}

if (!customElements.get("event-details-component")) {
  customElements.define("event-details-component", EventDetailsComponent);
}
