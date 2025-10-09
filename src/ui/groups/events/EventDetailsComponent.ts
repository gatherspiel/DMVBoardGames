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

import {generateErrorMessage} from "../../../shared/html/StatusIndicators.ts";
import {convert24HourTimeForDisplay, convertTimeTo24Hours} from "../../../shared/data/EventDataUtils.ts";
import {convertLocationStringForDisplay} from "../../../shared/data/EventDataUtils.ts";
import {
  generateButton,
  generateLinkButton
} from "../../../shared/html/ButtonGenerator.ts";
import {
  SUCCESS_MESSAGE_KEY
} from "../../../shared/Constants.ts";

import {API_ROOT} from "../../../shared/Params.ts";

import {LoginStatusComponent} from "../../../shared/html/LoginStatusComponent.ts";
import {generateSuccessMessage} from "../../../shared/html/StatusIndicators.ts";
import {convertDateTimeForDisplay} from "../../../shared/data/EventDataUtils.ts";
import {convertDayOfWeekForDisplay} from "../../../shared/data/DisplayNameConversion.ts";
import {getDayOfWeekSelectHtml} from "../../../shared/html/SelectGenerator.ts";
customElements.define("login-status-component", LoginStatusComponent);

const CONFIRM_DELETE_BUTTON_ID = "confirm-delete-button";
const CANCEL_DELETE_BUTTON_ID = "cancel-delete-button";
const CANCEL_EDIT_BUTTON_ID = "cancel-edit-button";
const DELETE_EVENT_BUTTON_ID = "delete-event-button";
const EDIT_EVENT_BUTTON_ID = "edit-event-button";
const SAVE_EVENT_BUTTON_ID = "save-event-button";

export class EventDetailsComponent extends BaseDynamicComponent {
  constructor() {
    super([{
      dataStore: GROUP_EVENT_REQUEST_STORE,
      componentReducer: (data:any)=>{
        document.title = data.name;
        if(data.startDate){
          data.startDate = data.startDate.join("-")
        }
        return data
      }
    }]);
  }

  getTemplateStyle(): string {
    return `
      <link rel="stylesheet" type="text/css" href="/styles/sharedHtmlAndComponentStyles.css"/>
      <style>
        h1 {
          margin-top:0rem;
        }   

        #delete-event-form {
          padding-left:1.5rem;
        }

        .back-to-group-button {
          margin-top: 0.5rem;
        }
        .event-website-link {
          margin-top: 0.5rem;
        }
        .raised {
          display: inline-block;
          line-height: 1;
        } 
        @media not screen and (width < 32em) {
          input,select,textarea {
            display: block;
          }
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
        } 
        @media screen and (width < 32em) {
          #${EVENT_DESCRIPTION_INPUT}{
            height: 10rem;
          }
          #event-details-form {
            margin-right:1.5rem;
          }
        }   
      </style>     
    `;
  }

  override attachHandlersToShadowRoot(shadowRoot?: any) {
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

          const data = (shadowRoot.getElementById('event-details-form') as HTMLFormElement)?.elements;

          const formData = {
            id: self.componentStore.id,
            [EVENT_NAME_INPUT]: (data.namedItem(EVENT_NAME_INPUT) as HTMLInputElement)?.value,
            [EVENT_DESCRIPTION_INPUT]: (data.namedItem(EVENT_DESCRIPTION_INPUT) as HTMLInputElement)?.value,
            [EVENT_URL_INPUT]: (data.namedItem(EVENT_URL_INPUT) as HTMLInputElement)?.value,
            [START_TIME_INPUT]: convertTimeTo24Hours((data.namedItem(START_TIME_INPUT) as HTMLInputElement)?.value),
            [END_TIME_INPUT]: convertTimeTo24Hours((data.namedItem(END_TIME_INPUT) as HTMLInputElement)?.value),
            [EVENT_LOCATION_INPUT]: (data.namedItem(EVENT_LOCATION_INPUT) as HTMLInputElement)?.value,
            isRecurring: self.componentStore.isRecurring
          }

          if(self.componentStore.isRecurring){
            // @ts-ignore
            formData[DAY_OF_WEEK_INPUT] = (data.namedItem(DAY_OF_WEEK_INPUT) as HTMLSelectElement)?.value;
          } else {
            // @ts-ignore
            formData[START_DATE_INPUT] = (data.namedItem(START_DATE_INPUT) as HTMLInputElement)?.value;
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
                  day: formData[DAY_OF_WEEK_INPUT],
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

    let html = `
      <div class="ui-section" id = "user-actions-menu">
        ${!data.isEditing && !data.isDeleting && data?.permissions?.userCanEdit ? `
          ${generateButton({
          id: EDIT_EVENT_BUTTON_ID,
          text: "Edit event",
        })}
          
        ${generateButton({
          id: DELETE_EVENT_BUTTON_ID,
          text: "Delete event",
        })}
    
        ` : ''}
        <login-status-component class = "ui-section"></login-status-component>
      </div>
      
      <div class="section-separator-medium"></div>
      ${generateSuccessMessage(data[SUCCESS_MESSAGE_KEY])}

    `
    if(data.isEditing){
      html += this.renderEditMode(data);
    }
    else if(data.isDeleting){
      html += this.renderDeleteMode(data);
    } else {
      html += this.renderViewMode(data);
    }
    html+=`
      <div class="ui-section">
      ${generateLinkButton({
        class: "back-to-group-button",
        text: "Back to group information",
        url: `${window.location.origin}/groups.html?name=${encodeURIComponent(data.groupName)}`
      })}
      </div>
    `
    return html
  }

  renderDeleteMode(data:any): string {
    console.log(data)
    if (data[SUCCESS_MESSAGE_KEY]) {
      return `
        <div class="ui-section">
          ${generateSuccessMessage(data[SUCCESS_MESSAGE_KEY])}
        </div>
      `
    }
    return `
      <h1>Are you sure you want to delete event ${data.name} ${data.isRecurring ? '': `on ${convertDateTimeForDisplay(data.startTime)}`}</h1>
      
      <div id="delete-event-form">
          ${generateButton({
          id: CONFIRM_DELETE_BUTTON_ID,
          text: "Confirm delete"
        })}
        
        ${generateButton({
          id: CANCEL_DELETE_BUTTON_ID,
          text: "Cancel"
        })}     
      </div>
    `
  }

  renderEditMode(data:any): string {

    return `
      <div class="ui-section">
      <h1>Editing: ${data.name}</h1>
  
      <form id="event-details-form" onsubmit="return false">
        <label class="form-field-header">Event name</label>
        <input
          id=${EVENT_NAME_INPUT}
          name=${EVENT_NAME_INPUT}
          value="${data.name}"
        />
        </input>
    
        <label class="form-field-header"> Event description</label>
        <textarea
          id=${EVENT_DESCRIPTION_INPUT}
          name=${EVENT_DESCRIPTION_INPUT}
        />${data.description ?? ""}</textarea>
           
        <label class="form-field-header">Event URL</label>
        <input
          name=${EVENT_URL_INPUT}
          type="url"
          value="${data.url ?? ""}"
        />
        </input>
          
        ${data.isRecurring ?
          `
            <label class="form-field-header">Day of week</label>
            ${getDayOfWeekSelectHtml(data.day)}
          ` :
          `
            <label class="form-field-header">Start date</label>
            <input
              name=${START_DATE_INPUT}
              type="date"
              value=${data.startDate}
            />`
        }
          
        <label class="form-field-header">Start time</label>
        <input
          name=${START_TIME_INPUT}
          type="time"
          value=${(data.startTime)}
        />
        </input>
          
        <label class="form-field-header">End time</label>
        <input
          name=${END_TIME_INPUT}
          type="time"
          value=${(data.endTime)}
        />
        </input>
          
        <label class="form-field-header">Event location</label>
        <input
          id=${EVENT_LOCATION_INPUT}
          name=${EVENT_LOCATION_INPUT}
          value="${data.location ?? ""}"
        />
        </input>
        
        ${generateErrorMessage(data.errorMessage)}
  
        ${generateButton({
          class: "group-webpage-link",
          id: SAVE_EVENT_BUTTON_ID,
          text: "Save event"
        })}
      </form>
    </div>
   `
  }

  renderViewMode(data:any): string {

    if(data.errorMessage){
      return `${generateErrorMessage(data.errorMessage)}`
    }
    return `
      <div class="ui-section">
        <h1>${data.name}</h1>
        ${generateLinkButton({
          class:"event-website-link",
          text: "Event website", 
          url: data.url
        })}
         
        ${data.isRecurring ? 
          `<p>
            ${convertDayOfWeekForDisplay(data.day)}s from ${convert24HourTimeForDisplay(data.startTime)} to 
            ${convert24HourTimeForDisplay(data.endTime)} </p>` :
          `<p>
            Time: ${data.startDate}, ${convert24HourTimeForDisplay(data.startTime)}
          </p>`
        }
        
        <p>Location: ${convertLocationStringForDisplay(data.location)}</p>
        <p>${data.description}</p>
           
    
      </div>
    `;
  }
}
