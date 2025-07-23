import {BaseTemplateDynamicComponent} from "../../../../framework/components/BaseTemplateDynamicComponent.ts";
import {
  END_TIME_INPUT,
  EVENT_DESCRIPTION_INPUT, EVENT_LOCATION_INPUT,
  EVENT_NAME_INPUT,
  EVENT_URL_INPUT,
  GROUP_NAME_PARAM, START_DATE_INPUT, START_TIME_INPUT
} from "../../Constants.ts";
import {getUrlParameter} from "../../../../framework/utils/UrlParamUtils.ts";
import {GROUP_EVENT_REQUEST_THUNK} from "../data/GroupEventRequestThunk.ts";
import type {EventDetailsData} from "../data/EventDetailsData.ts";
import {
  CANCEL_DELETE_EVENT_CONFIG,
  CANCEL_EDIT_EVENT_DETAILS_CONFIG, CONFIRM_DELETE_EVENT_CONFIG, DELETE_EVENT_CONFIG,
  EDIT_EVENT_DETAILS_CONFIG,
  SAVE_EVENT_CONFIG
} from "../EventDetailsHandler.ts";
import {
  convertDateTimeForDisplay,
  convertDayOfWeekForDisplay,
  convertLocationStringForDisplay, getDateFromDateString, getTimeFromDateString
} from "../../../../framework/utils/EventDataUtils.ts";
import {UPDATE_EVENT_REQUEST_THUNK} from "../data/UpdateEventThunk.ts";
import {DELETE_EVENT_REQUEST_THUNK} from "../data/DeleteEventRequestThunk.ts";
import {PageState} from "../../../../framework/state/PageState.ts";
import {initRequestStore} from "../../../../framework/state/data/RequestStore.ts";
import {VIEW_GROUP_PAGE_HANDLER_CONFIG} from "../../../../shared/nav/NavEventHandlers.ts";

const template = `
  <link rel="stylesheet" type="text/css" href="/styles/sharedComponentStyles.css"/>
  <style>   
  
    #${EVENT_NAME_INPUT} {
      width: 50rem;
    }
    #${EVENT_DESCRIPTION_INPUT} {
      width: 50rem;
      height: 10rem;
    }
    #${EVENT_LOCATION_INPUT} {
      width: 50rem;
    }
  </style>
`;


const loadConfig = {
  onLoadStoreConfig: {
    dataSource: GROUP_EVENT_REQUEST_THUNK,
  },
  onLoadRequestData: {
    name: getUrlParameter(GROUP_NAME_PARAM),
  },
  thunkReducers: [
    {
      thunk: GROUP_EVENT_REQUEST_THUNK,
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
    },
    {
      thunk: DELETE_EVENT_REQUEST_THUNK,
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
            successMessage: "Successfully deleted event",
          };
        }
      }
    }


  ],
  globalStateLoadConfig: {
    globalFieldSubscriptions: ["isLoggedIn"],
  },
};

export class EventDetailsComponent extends BaseTemplateDynamicComponent {
  constructor() {
    super("group-event-component", loadConfig);
  }

  connectedCallback(){
    if(PageState.pageLoaded) {
      console.log("Render time:"+Date.now())
      initRequestStore(loadConfig);
    }
  }

  render(data: EventDetailsData): string {

    if(data.isEditing){
      return this.renderEditMode(data);
    }
    if(data.isDeleting){
      return this.renderDeleteMode(data);
    }
    return this.renderViewMode(data);
  }

  renderDeleteMode(data:EventDetailsData): string {
    if (data.successMessage) {
      return `
        <div class="ui-section">
          ${this.generateSuccessMessage(data.successMessage)}
          
          <a href="${window.location.origin}/groups.html?name=${encodeURIComponent(data.groupName)}">Back to group</a>
        </div>
      `
    }
    return `
      <h1>Are you sure you want to delete ${data.name} on ${convertDateTimeForDisplay(data.startTime)}</h1>
      <button ${this.createClickEvent(CONFIRM_DELETE_EVENT_CONFIG)}>Confirm delete</button>
      <button ${this.createClickEvent(CANCEL_DELETE_EVENT_CONFIG)}>Cancel</button>
      ${this.generateErrorMessage(data.errorMessage)}
      ${this.generateSuccessMessage(data.successMessage)}
    `
  }
  renderEditMode(data:EventDetailsData): string {
    return `<h1>Editing: ${data.name}</h1>

    <form>
    
      ${this.generateInputFormItem({
        id: EVENT_NAME_INPUT,
        componentLabel: "Event name",
        inputType: "text",
        value: data.name
      })}
      
      ${this.generateTextInputFormItem({
        id: EVENT_DESCRIPTION_INPUT,
        componentLabel: "Event description",
        inputType: "text",
        value: data.description
      })}
      
       ${this.generateInputFormItem({
        id: EVENT_URL_INPUT,
        componentLabel: "Event URL",
        inputType: "text",
        value: data.url
      })}
       
      ${this.generateInputFormItem({
        id: START_DATE_INPUT,
        componentLabel: "Start date",
        inputType: "text",
        value: getDateFromDateString(data.startTime)
      })}
      
      ${this.generateInputFormItem({
        id: START_TIME_INPUT,
        componentLabel: "Start time",
        inputType: "text",
        value: getTimeFromDateString(data.startTime)
      })}
 
      ${this.generateInputFormItem({
        id: END_TIME_INPUT,
        componentLabel: "End time",
        inputType: "text",
        value: getTimeFromDateString(data.endTime)
      })}     
      <br>
  
      ${this.generateInputFormItem({
        id: EVENT_LOCATION_INPUT,
        componentLabel: "Event location",
        inputType: "text",
        value: data.location
      })}     
    </form>
    ${this.generateErrorMessage(data.errorMessage)}

    <button ${this.createClickEvent(SAVE_EVENT_CONFIG)}>Save event</button>
    <button ${this.createClickEvent(CANCEL_EDIT_EVENT_DETAILS_CONFIG)}>Back to event</button>
   `
  }

  renderViewMode(data:EventDetailsData): string {
    if(data.errorMessage){
      return `${this.generateErrorMessage(data.errorMessage)}`
    }
    return `
      <div class="ui-section">
        <h1>${data.name}</h1>
        
        <a href="${data.url}">Event page</a>
        
        <p>Time: ${convertDayOfWeekForDisplay(data.day)}, ${convertDateTimeForDisplay(data.startTime)}</p>
        <p>Location: ${convertLocationStringForDisplay(data.location)}</p>
        <p>${data.description}</p>
        
        ${this.generateButtonsForEditPermission({
          "Edit event": EDIT_EVENT_DETAILS_CONFIG,
          "Delete event": DELETE_EVENT_CONFIG
        })}
       
        <p>${data.successMessage ? data.successMessage.trim(): ""}</p>
        <button ${this.createClickEvent(VIEW_GROUP_PAGE_HANDLER_CONFIG, {name: data.groupName})}>Back to group </button>
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
