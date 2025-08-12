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
import {PageState} from "../../../../framework/spa/PageState.ts";
import {initRequestStore} from "../../../../framework/state/data/RequestStore.ts";
import {VIEW_GROUP_PAGE_HANDLER_CONFIG} from "../../../../shared/nav/NavEventHandlers.ts";
import {generateButton, generateButtonForEditPermission} from "../../../../shared/components/ButtonGenerator.ts";
import {REDIRECT_HANDLER_CONFIG} from "../../../../framework/handler/RedirectHandler.ts";
import {generateErrorMessage, generateSuccessMessage} from "../../../../framework/components/utils/StatusIndicators.ts";
import {
  COMPONENT_LABEL_KEY,
  EVENT_HANDLER_CONFIG_KEY, EVENT_HANDLER_PARAMS_KEY,
  IS_LOGGED_IN_KEY,
  SUCCESS_MESSAGE_KEY
} from "../../../../shared/Constants.ts";
import {
  GLOBAL_FIELD_SUBSCRIPTIONS_KEY,
  GLOBAL_STATE_LOAD_CONFIG_KEY,
  ON_LOAD_REQUEST_DATA_KEY,
  ON_LOAD_STORE_CONFIG_KEY, REQUEST_THUNK_REDUCERS_KEY
} from "../../../../framework/components/types/ComponentLoadConfig.ts";

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
  [ON_LOAD_STORE_CONFIG_KEY]: {
    dataSource: GROUP_EVENT_REQUEST_THUNK,
  },
  [ON_LOAD_REQUEST_DATA_KEY]: {
    name: getUrlParameter(GROUP_NAME_PARAM),
  },
  [REQUEST_THUNK_REDUCERS_KEY]: [
    {
      thunk: GROUP_EVENT_REQUEST_THUNK,
      componentReducer:  (data: any) => data
    },
    {
      thunk: UPDATE_EVENT_REQUEST_THUNK,
      componentReducer: (data:any) => {
        if (data.errorMessage) {
          return {
            errorMessage: data.errorMessage,
            [SUCCESS_MESSAGE_KEY]: "",
          };
        } else {
          return {
            isEditing: false,
            errorMessage: "",
            [SUCCESS_MESSAGE_KEY]: "Successfully updated event",
          };
        }
      }
    },
    {
      thunk: DELETE_EVENT_REQUEST_THUNK,
      componentReducer:  (data:any) => {
        if (data.errorMessage) {
          return {
            errorMessage: data.errorMessage,
            [SUCCESS_MESSAGE_KEY]: "",
          };
        } else {
          return {
            isEditing: false,
            errorMessage: "",
            [SUCCESS_MESSAGE_KEY]: "Successfully deleted event",
          };
        }
      }
    }
  ],
  [GLOBAL_STATE_LOAD_CONFIG_KEY]: {
    [GLOBAL_FIELD_SUBSCRIPTIONS_KEY]: [IS_LOGGED_IN_KEY],
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
    if (data[SUCCESS_MESSAGE_KEY]) {
      return `
        <div class="ui-section">
          ${generateSuccessMessage(data[SUCCESS_MESSAGE_KEY])}
          
          ${generateButton({
            text: "Back to group",
            component: this,
            [EVENT_HANDLER_CONFIG_KEY]: VIEW_GROUP_PAGE_HANDLER_CONFIG,
            [EVENT_HANDLER_PARAMS_KEY]: {name:data.groupName}
          })}
        </div>
      `
    }
    return `
      <h1>Are you sure you want to delete ${data.name} on ${convertDateTimeForDisplay(data.startTime)}</h1>
      ${generateButton({
        text: "Confirm delete",
        component: this,
        [EVENT_HANDLER_CONFIG_KEY]: CONFIRM_DELETE_EVENT_CONFIG,
      })}
      
      ${generateButton({
        text: "Cancel",
        component: this,
        [EVENT_HANDLER_CONFIG_KEY]: CANCEL_DELETE_EVENT_CONFIG,
      })}
    `
  }

  renderEditMode(data:EventDetailsData): string {
    return `<h1>Editing: ${data.name}</h1>

    <form>
    
      ${this.addShortInput({
        id: EVENT_NAME_INPUT,
        [COMPONENT_LABEL_KEY]: "Event name",
        inputType: "text",
        value: data.name
      })}
      
      ${this.addTextInput({
        id: EVENT_DESCRIPTION_INPUT,
        [COMPONENT_LABEL_KEY]: "Event description",
        inputType: "text",
        value: data.description
      })}
      
       ${this.addShortInput({
        id: EVENT_URL_INPUT,
        [COMPONENT_LABEL_KEY]: "Event URL",
        inputType: "text",
        value: data.url
      })}
       
      ${this.addShortInput({
        id: START_DATE_INPUT,
        [COMPONENT_LABEL_KEY]: "Start date",
        inputType: "text",
        value: getDateFromDateString(data.startTime)
      })}
      
      ${this.addShortInput({
        id: START_TIME_INPUT,
        [COMPONENT_LABEL_KEY]: "Start time",
        inputType: "text",
        value: getTimeFromDateString(data.startTime)
      })}
 
      ${this.addShortInput({
        id: END_TIME_INPUT,
        [COMPONENT_LABEL_KEY]: "End time",
        inputType: "text",
        value: getTimeFromDateString(data.endTime)
      })}     
      <br>
  
      ${this.addShortInput({
        id: EVENT_LOCATION_INPUT,
        [COMPONENT_LABEL_KEY]: "Event location",
        inputType: "text",
        value: data.location
      })}     
    </form>
    ${generateErrorMessage(data.errorMessage)}

    ${generateButton({
      class: "group-webpage-link",
      text: "Save event",
      component: this,
      [EVENT_HANDLER_CONFIG_KEY]: SAVE_EVENT_CONFIG,
    })}
    
    ${generateButton({
      class: "group-webpage-link",
      text: "Back to event",
      component: this,
      [EVENT_HANDLER_CONFIG_KEY]: CANCEL_EDIT_EVENT_DETAILS_CONFIG,
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
          [EVENT_HANDLER_CONFIG_KEY]: REDIRECT_HANDLER_CONFIG,
          [EVENT_HANDLER_PARAMS_KEY]: {url: data.url}
        })}
             
        <p>Time: ${convertDayOfWeekForDisplay(data.day)}, ${convertDateTimeForDisplay(data.startTime)}</p>
        <p>Location: ${convertLocationStringForDisplay(data.location)}</p>
        <p>${data.description}</p>
           
        ${generateButtonForEditPermission({
          text: "Edit event",
          component: this,
          [EVENT_HANDLER_CONFIG_KEY]: EDIT_EVENT_DETAILS_CONFIG,
        })}
        
        ${generateButtonForEditPermission({
          text: "Delete event",
          component: this,
          [EVENT_HANDLER_CONFIG_KEY]: DELETE_EVENT_CONFIG,
        })}
  
        <p class="success-message">${data[SUCCESS_MESSAGE_KEY] ? data[SUCCESS_MESSAGE_KEY].trim(): ""}</p>
        
        ${generateButtonForEditPermission({
          text: "Back to group",
          component: this,
          [EVENT_HANDLER_CONFIG_KEY]: VIEW_GROUP_PAGE_HANDLER_CONFIG,
          [EVENT_HANDLER_PARAMS_KEY]:{name: data.groupName}
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
