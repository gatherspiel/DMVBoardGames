import {
  AbstractPageComponent, ApiActionTypes,
  BaseTemplateDynamicComponent, InternalApiAction,
} from "@bponnaluri/places-js";
import {
  END_TIME_INPUT,
  EVENT_DESCRIPTION_INPUT, EVENT_LOCATION_INPUT,
  EVENT_NAME_INPUT,
  EVENT_URL_INPUT,
  GROUP_NAME_PARAM, START_DATE_INPUT, START_TIME_INPUT
} from "../../Constants.ts";
import {GROUP_EVENT_REQUEST_THUNK} from "../data/GroupEventRequestThunk.ts";
import type {EventDetailsData} from "../data/EventDetailsData.ts";
import {
  getEventDetailsFromForm,
  validateEventFormData
} from "../EventDetailsHandler.ts";
import {
  convertDateTimeForDisplay,
  convertDayOfWeekForDisplay,
  convertLocationStringForDisplay, getDateFromDateString, getTimeFromDateString
} from "@bponnaluri/places-js";
import {generateButton, generateButtonForEditPermission} from "../../../../shared/components/ButtonGenerator.ts";
import {REDIRECT_HANDLER_CONFIG} from "@bponnaluri/places-js";
import {generateErrorMessage, generateSuccessMessage} from "@bponnaluri/places-js";
import {
  COMPONENT_LABEL_KEY,
  EVENT_HANDLER_CONFIG_KEY, EVENT_HANDLER_PARAMS_KEY,
  IS_LOGGED_IN_KEY,
  SUCCESS_MESSAGE_KEY
} from "../../../../shared/Constants.ts";
import {
  DATA_FIELDS,
  DEFAULT_GLOBAL_STATE_REDUCER_KEY,
  GLOBAL_FIELD_SUBSCRIPTIONS_KEY,
  GLOBAL_STATE_LOAD_CONFIG_KEY,
} from "@bponnaluri/places-js";
import {GroupPageComponent} from "../../viewGroup/components/GroupPageComponent.ts";
import {API_ROOT} from "../../../../shared/Params.ts";

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

const GROUP_EVENT = "groupEvent"
const loadConfig = {
 /* [REQUEST_THUNK_REDUCERS_KEY]: [
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
  ],*/
  [GLOBAL_STATE_LOAD_CONFIG_KEY]: {
    [GLOBAL_FIELD_SUBSCRIPTIONS_KEY]: [IS_LOGGED_IN_KEY, GROUP_EVENT],
    [DEFAULT_GLOBAL_STATE_REDUCER_KEY]: (data:any)=>{
      if(!data.groupEvent){
        return {}
      }
      return {...data.groupEvent, isLoggedIn: data.isLoggedIn}
    }
  },
  [DATA_FIELDS]: [
    {
      fieldName: GROUP_EVENT,
      dataSource: GROUP_EVENT_REQUEST_THUNK,
      urlParam: GROUP_NAME_PARAM
    }
  ]
};

const BACK_TO_GROUP_BUTTON_ID = "back-to-group-button";
const CONFIRM_DELETE_BUTTON_ID = "confirm-delete-button";
const CANCEL_DELETE_BUTTON_ID = "cancel-delete-button";
const DELETE_EVENT_BUTTON_ID = "delete-event-button";
const EDIT_EVENT_BUTTON_ID = "edit-event-button";
const SAVE_EVENT_BUTTON_ID = "save-event-button";

export class EventDetailsComponent extends BaseTemplateDynamicComponent {
  constructor() {
    super(loadConfig);
  }


  override showLoadingHtml():string {
    return `<h1>Loading</h1>`;
  }

  override attachEventHandlersToDom(shadowRoot?: any) {
    const self = this;

    shadowRoot?.addEventListener("click",(event:any)=>{
      try {
        if(event.originalTarget.id === BACK_TO_GROUP_BUTTON_ID) {
          AbstractPageComponent.updateRoute(
            GroupPageComponent,
            {"name":self.componentState.groupName}
          )
        }
        if(event.originalTarget.id === DELETE_EVENT_BUTTON_ID) {
          self.retrieveData({
            isDeleting: true,
            [SUCCESS_MESSAGE_KEY]:''
          })
        }
        if(event.originalTarget.id === CANCEL_DELETE_BUTTON_ID){
          self.retrieveData({
            errorMessage: '',
            isDeleting: false,
            [SUCCESS_MESSAGE_KEY]:''
          })
        }

        if(event.originalTarget.id === CONFIRM_DELETE_BUTTON_ID){
          const params = {
            id: self.componentState.id,
            groupId: self.componentState.groupId
          }

          InternalApiAction.getResponseData({
            method: ApiActionTypes.DELETE,
            url: `${API_ROOT}/groups/${params.groupId}/events/${encodeURIComponent(params.id)}/`,
          }).then((response:any)=>{
            if (response.errorMessage) {
              self.retrieveData({
                errorMessage: response.errorMessage,
                [SUCCESS_MESSAGE_KEY]: "",
              });
            } else {
              self.retrieveData({
                isEditing: false,
                errorMessage: "",
                [SUCCESS_MESSAGE_KEY]: "Successfully deleted event"
              });
            }
          })
        }

        if(event.originalTarget.id === EDIT_EVENT_BUTTON_ID){
          self.retrieveData({
            isEditing: true,
            [SUCCESS_MESSAGE_KEY]:''
          })
        }

        if(event.originalTarget.id === SAVE_EVENT_BUTTON_ID){
          const validationErrors:any = validateEventFormData(self);

          if(validationErrors.errorMessage.length !==0){
            self.retrieveData(validationErrors);
          } else {
            const eventDetails = getEventDetailsFromForm(self)
            InternalApiAction.getResponseData({
              body: JSON.stringify(eventDetails),
              method: ApiActionTypes.PUT,
              url: API_ROOT + `/groups/${eventDetails.groupId}/events/?id=${encodeURIComponent(eventDetails.id)}`,
            }).then((response:any)=>{
              if(!response.errorMessage){
                self.retrieveData({
                  isEditing: false,
                  errorMessage: "",
                  [SUCCESS_MESSAGE_KEY]: "Successfully updated event",
                });
              } else {
                self.retrieveData({
                  errorMessage: response.errorMessage,
                  [SUCCESS_MESSAGE_KEY]: ""
                })
              }
            })
          }
        }

      } catch(e:any){
        if(e.message !== `Permission denied to access property "id"`){
          throw e;
        }
      }
    })
  }

  render(data: EventDetailsData): string {

    if(!data || !data.name){
      return this.showLoadingHtml();
    }
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
            component: this,
            id: BACK_TO_GROUP_BUTTON_ID,
            text: "Back to group"
          })}
        </div>
      `
    }
    return `
      <h1>Are you sure you want to delete ${data.name} on ${convertDateTimeForDisplay(data.startTime)}</h1>
      ${generateButton({
        component: this,
        id: CONFIRM_DELETE_BUTTON_ID,
        text: "Confirm delete"
      })}
      
      ${generateButton({
        component: this,
        id: CANCEL_DELETE_BUTTON_ID, 
        text: "Cancel"
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
      <br>
      ${this.addTextInput({
        id: EVENT_DESCRIPTION_INPUT,
        [COMPONENT_LABEL_KEY]: "Event description",
        inputType: "text",
        value: data.description
      })}
      <br>
       ${this.addShortInput({
        id: EVENT_URL_INPUT,
        [COMPONENT_LABEL_KEY]: "Event URL",
        inputType: "text",
        value: data.url
      })}
       <br>
      ${this.addShortInput({
        id: START_DATE_INPUT,
        [COMPONENT_LABEL_KEY]: "Start date",
        inputType: "text",
        value: getDateFromDateString(data.startTime)
      })}
      <br>
      ${this.addShortInput({
        id: START_TIME_INPUT,
        [COMPONENT_LABEL_KEY]: "Start time",
        inputType: "text",
        value: getTimeFromDateString(data.startTime)
      })}
      <br>
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
      id: SAVE_EVENT_BUTTON_ID,
      text: "Save event"
    })}
    
    ${generateButton({
      class: "group-webpage-link",
      text: "Back to event"
    })}  
   `
  }

  renderViewMode(data:EventDetailsData): string {
    if(data.errorMessage){
      return `${generateErrorMessage(data.errorMessage)}`
    }
    return `
      <div class="ui-section">
        <h1></h1>
        ${generateButton({
          text: data.name,
          component: this,
          [EVENT_HANDLER_CONFIG_KEY]: REDIRECT_HANDLER_CONFIG,
          [EVENT_HANDLER_PARAMS_KEY]: {url: data.url}
        })}
             
        <p>Time: ${convertDayOfWeekForDisplay(data.day)}, ${convertDateTimeForDisplay(data.startTime)}</p>
        <p>Location: ${convertLocationStringForDisplay(data.location)}</p>
        <p>${data.description}</p>
           
        ${generateButtonForEditPermission({
          component: this,
          id: EDIT_EVENT_BUTTON_ID, 
          text: "Edit event",
        })}
        
        ${generateButtonForEditPermission({
          component: this,
          id: DELETE_EVENT_BUTTON_ID,
          text: "Delete event",
        })}
  
        <p class="success-message">${data[SUCCESS_MESSAGE_KEY] ? data[SUCCESS_MESSAGE_KEY].trim(): ""}</p>
        
        ${generateButtonForEditPermission({
          component: this,
          id: BACK_TO_GROUP_BUTTON_ID,
          text: "Back to group",
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
