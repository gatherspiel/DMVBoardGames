import {
  ApiActionTypes,
  BaseDynamicComponent, ApiLoadAction
} from "@bponnaluri/places-js";
import {
  DAY_OF_WEEK_INPUT,
  END_TIME_INPUT,
  EVENT_DESCRIPTION_INPUT, EVENT_LOCATION_INPUT,
  EVENT_NAME_INPUT,
  EVENT_URL_INPUT,
  START_DATE_INPUT, START_TIME_INPUT
} from "../Constants.ts";
import {GROUP_EVENT_REQUEST_STORE} from "./GroupEventRequestStore.ts";
import {
  getEventDetailsFromForm,
  validateEventFormData
} from "./EventDetailsHandler.ts";

import {generateErrorMessage} from "../../../shared/components/StatusIndicators.ts";
import {convert24HourTimeForDisplay, convertTimeTo24Hours} from "../../../shared/DateUtils.ts";
import {convertLocationStringForDisplay} from "../../../shared/DateUtils.ts";
import {
  generateButton,
  generateLinkButton
} from "../../../shared/components/ButtonGenerator.ts";
import {
  SUCCESS_MESSAGE_KEY
} from "../../../shared/Constants.ts";

import {API_ROOT} from "../../../shared/Params.ts";

import {LoginStatusComponent} from "../../../shared/components/LoginStatusComponent.ts";
import {generateSuccessMessage} from "../../../shared/components/StatusIndicators.ts";
import {convertDateTimeForDisplay, convertDayOfWeekForDisplay} from "../../../shared/DateUtils.ts";
customElements.define("login-status-component", LoginStatusComponent);

const template = `
  <link rel="stylesheet" type="text/css" href="/styles/sharedHtmlAndComponentStyles.css"/>
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
    
    .back-to-group-button {
      margin-top: 0.5rem;
    }
    .raised {
      display: inline-block;
      line-height: 1;
    }
    
  </style>
`;

const loadConfig =  [{
    dataStore: GROUP_EVENT_REQUEST_STORE,
    componentReducer: (data:any)=>{
      if(data.startDate){
        data.startDate = data.startDate.join("-")
      }
      return data
    }
  }]

const CONFIRM_DELETE_BUTTON_ID = "confirm-delete-button";
const CANCEL_DELETE_BUTTON_ID = "cancel-delete-button";
const CANCEL_EDIT_BUTTON_ID = "cancel-edit-button";
const DELETE_EVENT_BUTTON_ID = "delete-event-button";
const EDIT_EVENT_BUTTON_ID = "edit-event-button";
const SAVE_EVENT_BUTTON_ID = "save-event-button";

export class EventDetailsComponent extends BaseDynamicComponent {
  constructor() {
    super(loadConfig);
  }

  override attachEventsToShadowRoot(shadowRoot?: any) {
    const self = this;

    shadowRoot?.addEventListener("click",(event:any)=>{
      try {
        if(event.target.id === CANCEL_EDIT_BUTTON_ID) {
          self.updateData({isEditing: false,
            [SUCCESS_MESSAGE_KEY]:''})
        }

        if(event.target.id === DELETE_EVENT_BUTTON_ID) {
          self.updateData({
            isDeleting: true,
            [SUCCESS_MESSAGE_KEY]:''
          })
        }
        if(event.target.id === CANCEL_DELETE_BUTTON_ID){
          self.updateData({
            errorMessage: '',
            isDeleting: false,
            [SUCCESS_MESSAGE_KEY]:''
          })
        }

        if(event.target.id === CONFIRM_DELETE_BUTTON_ID){
          const params = {
            id: self.componentStore.id,
            groupId: self.componentStore.groupId
          }

          ApiLoadAction.getResponseData({
            method: ApiActionTypes.DELETE,
            url: `${API_ROOT}/groups/${params.groupId}/events/${encodeURIComponent(params.id)}/`,
          }).then((response:any)=>{
            if (response.errorMessage) {
              self.updateData({
                errorMessage: response.errorMessage,
                [SUCCESS_MESSAGE_KEY]: "",
              });
            } else {
              self.updateData({
                isEditing: false,
                errorMessage: "",
                [SUCCESS_MESSAGE_KEY]: "Successfully deleted event"
              });
            }
          })
        }

        if(event.target.id === EDIT_EVENT_BUTTON_ID){
          self.updateData({
            isEditing: true,
            [SUCCESS_MESSAGE_KEY]:''
          })
        }

        if(event.target.id === SAVE_EVENT_BUTTON_ID){

          const formElements = shadowRoot?.getElementById('event-details-form').elements;
          const formData = {
            id: self.componentStore.id,
            [EVENT_NAME_INPUT]: formElements[0].value,
            [EVENT_DESCRIPTION_INPUT]: formElements[1].value,
            [EVENT_URL_INPUT]: formElements[2].value,
            [START_TIME_INPUT]: convertTimeTo24Hours(formElements[4].value),
            [END_TIME_INPUT]: convertTimeTo24Hours(formElements[5].value),
            [EVENT_LOCATION_INPUT]: formElements[6].value,
            isRecurring: self.componentStore.isRecurring
          }

          if(self.componentStore.isRecurring){
            // @ts-ignore
            formData[DAY_OF_WEEK_INPUT] = formElements[3].value;
          } else {
            // @ts-ignore
            formData[START_DATE_INPUT] = formElements[3].value;
          }

          const validationErrors:any = validateEventFormData(formData);

          if(validationErrors.errorMessage.length !==0){
            self.updateData(validationErrors);
          } else {
            const eventDetails = getEventDetailsFromForm(formData)
            ApiLoadAction.getResponseData({
              body: JSON.stringify(eventDetails),
              method: ApiActionTypes.PUT,
              url: API_ROOT + `/groups/${eventDetails.groupId}/events/?id=${encodeURIComponent(eventDetails.id)}`,
            }).then((response:any)=>{
              if(!response.errorMessage){
                self.updateData({
                  name: formData[EVENT_NAME_INPUT],
                  description: formData[EVENT_DESCRIPTION_INPUT],
                  url: formData[EVENT_URL_INPUT],
                  //@ts-ignore
                  startDate: formData[START_DATE_INPUT],
                  startTime: formData[START_TIME_INPUT],
                  endTime: formData[END_TIME_INPUT],
                  eventLocation: formData[EVENT_LOCATION_INPUT],
                  isEditing: false,
                  errorMessage: "",
                  [SUCCESS_MESSAGE_KEY]: "Successfully updated event",
                });
              } else {
                self.updateData({
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

  render(data: any): string {

    if(!data || !data.name){
      return `<h1>Loading</h1>`;
    }
    if(data.isEditing){
      return this.renderEditMode(data);
    }
    if(data.isDeleting){
      return this.renderDeleteMode(data);
    }
    return this.renderViewMode(data);
  }

  renderDeleteMode(data:any): string {
    if (data[SUCCESS_MESSAGE_KEY]) {
      return `
        <div class="ui-section">
          ${generateSuccessMessage(data[SUCCESS_MESSAGE_KEY])}
          
          ${generateLinkButton({
            text: "Back to group",
            url: `${window.location.origin}/groups.html?name=${encodeURIComponent(data.groupName)}`
          })}
        </div>
      `
    }
    return `
      <h1>Are you sure you want to delete ${data.name} on ${convertDateTimeForDisplay(data.startTime)}</h1>
      ${generateButton({
        id: CONFIRM_DELETE_BUTTON_ID,
        text: "Confirm delete"
      })}
      
      ${generateButton({
        id: CANCEL_DELETE_BUTTON_ID, 
        text: "Cancel"
    })}
    `
  }

  renderEditMode(data:any): string {
    return `<h1>Editing: ${data.name}</h1>

    <form id="event-details-form" onsubmit="return false">
     <label>Event name</label>
        <input
          id=${EVENT_NAME_INPUT}
          name=${EVENT_NAME_INPUT}
          value="${data.name}"
         />
        </input>
        <br>
  
        <label>Event description</label>
        <textarea
          id=${EVENT_DESCRIPTION_INPUT}
          name=${EVENT_DESCRIPTION_INPUT}
        />
        ${data.description ?? ""}
        </textarea>
        <br>
         
        <label>Event URL</label>
        <input
          name=${EVENT_URL_INPUT}
          value="${data.url ?? ""}"
        />
        </input>
        <br>
        
          ${data.isRecurring ?
          `
              <label>Day of week</label>
              <input
                name=${DAY_OF_WEEK_INPUT}
              />
              <br>
             `
          :
        `
          <label>Start date</label>
          <input
            name=${START_DATE_INPUT}
          />
          <br>`}
        
        <label>Start time</label>
        <input
          name=${START_TIME_INPUT}
        />
        </input>
        <br>
        
        <label>End time</label>
        <input
          name=${END_TIME_INPUT}
        />
        </input>
        <br>        
        
        <label>Event location</label>
        <input
          id=${EVENT_LOCATION_INPUT}
          name=${EVENT_LOCATION_INPUT}
          value="${data.location ?? ""}"
        />
        </input>
        <br>     
    ${generateErrorMessage(data.errorMessage)}

    ${generateButton({
      class: "group-webpage-link",
      id: SAVE_EVENT_BUTTON_ID,
      text: "Save event"
    })}
    
    ${generateButton({
      id: CANCEL_EDIT_BUTTON_ID,
      text: "Back to event",
      type: "submit"
    })}  
    </form>

   `
  }

  renderViewMode(data:any): string {

    if(data.errorMessage){
      return `${generateErrorMessage(data.errorMessage)}`
    }
    return `
      <div class="ui-section">
        <h1></h1>
        ${generateLinkButton({
          text: data.name, 
          url: data.url
        })}
         
        ${data.isRecurring ? 
          `<p>${convertDayOfWeekForDisplay(data.day)}s from ${convert24HourTimeForDisplay(data.startTime)} to 
              ${convert24HourTimeForDisplay(data.endTime)} </p>` :
          `<p>Time: ${data.startDate}, ${convert24HourTimeForDisplay(data.startTime)}</p>`
        }
        
        <p>Location: ${convertLocationStringForDisplay(data.location)}</p>
        <p>${data.description}</p>
           
        ${data?.permissions?.userCanEdit ? `
          ${generateButton({
            id: EDIT_EVENT_BUTTON_ID, 
            text: "Edit event",
          })}
          
          ${generateButton({
            id: DELETE_EVENT_BUTTON_ID,
            text: "Delete event",
          })}
    
          ${generateSuccessMessage(data[SUCCESS_MESSAGE_KEY])}
          
          ${generateLinkButton({
            class: "back-to-group-button",
            text: "Back to group",
            url: `${window.location.origin}/groups.html?name=${encodeURIComponent(data.groupName)}`
          })}
          
         ` : ''}

      </div>
    `;
  }

  getTemplateStyle(): string {
    return template;
  }
}
