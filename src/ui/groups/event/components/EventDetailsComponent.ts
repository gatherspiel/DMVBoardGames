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
import {generateButton, generateButtonForEditPermission} from "../../../../shared/components/ButtonGenerator.ts";
import {REDIRECT_HANDLER_CONFIG} from "../../../../framework/handler/RedirectHandler.ts";
import {generateErrorMessage, generateSuccessMessage} from "../../../../framework/components/utils/StatusIndicators.ts";

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
  requestThunkReducers: [
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
    super("event-details-component", loadConfig);
  }

  connectedCallback(){
    if(PageState.pageLoaded) {
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
          ${generateSuccessMessage(data.successMessage)}
          
          ${generateButton({
            text: "Back to group",
            component: this,
            eventHandlerConfig: VIEW_GROUP_PAGE_HANDLER_CONFIG,
            eventHandlerParams: {name:data.groupName}
          })}
        </div>
      `
    }
    return `
      <h1>Are you sure you want to delete ${data.name} on ${convertDateTimeForDisplay(data.startTime)}</h1>
      ${generateButton({
        text: "Confirm delete",
        component: this,
        eventHandlerConfig: CONFIRM_DELETE_EVENT_CONFIG,
      })}
      
      ${generateButton({
        text: "Cancel",
        component: this,
        eventHandlerConfig: CANCEL_DELETE_EVENT_CONFIG,
      })}
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
    ${generateErrorMessage(data.errorMessage)}

    ${generateButton({
      class: "group-webpage-link",
      text: "Save event",
      component: this,
      eventHandlerConfig: SAVE_EVENT_CONFIG,
    })}
    
    ${generateButton({
      class: "group-webpage-link",
      text: "Back to event",
      component: this,
      eventHandlerConfig: CANCEL_EDIT_EVENT_DETAILS_CONFIG,
    })}  
   `
  }

  renderViewMode(data:EventDetailsData): string {
    if(data.errorMessage){
      return `${generateErrorMessage(data.errorMessage)}`
    }
    return `
      <div class="ui-section">
        <h1>${data.name}</h1>
           
        ${generateButton({
          text: "Event page",
          component: this,
          eventHandlerConfig: REDIRECT_HANDLER_CONFIG,
          eventHandlerParams: {url: data.url}
        })}
             
        <p>Time: ${convertDayOfWeekForDisplay(data.day)}, ${convertDateTimeForDisplay(data.startTime)}</p>
        <p>Location: ${convertLocationStringForDisplay(data.location)}</p>
        <p>${data.description}</p>
           
        ${generateButtonForEditPermission({
          text: "Edit event",
          component: this,
          eventHandlerConfig: EDIT_EVENT_DETAILS_CONFIG,
        })}
        
        ${generateButtonForEditPermission({
          text: "Delete event",
          component: this,
          eventHandlerConfig: DELETE_EVENT_CONFIG,
        })}
  
        <p class="success-message">${data.successMessage ? data.successMessage.trim(): ""}</p>
        
        ${generateButtonForEditPermission({
          text: "Back to group",
          component: this,
          eventHandlerConfig: VIEW_GROUP_PAGE_HANDLER_CONFIG,
          eventHandlerParams:{name: data.groupName}
        })}

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
