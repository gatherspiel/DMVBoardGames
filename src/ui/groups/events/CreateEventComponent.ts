import {
  ApiActionTypes,
  ApiLoadAction,
  BaseDynamicComponent,
} from "@bponnaluri/places-js";
import {
  DAY_OF_WEEK_INPUT,
  END_TIME_INPUT,
  EVENT_DESCRIPTION_INPUT, EVENT_LOCATION_INPUT,
  EVENT_NAME_INPUT,
  EVENT_URL_INPUT,
  START_DATE_INPUT, START_TIME_INPUT,
} from "../Constants.ts";
import {generateButton, generateLinkButton} from "../../../shared/html/ButtonGenerator.ts";
import {
  ERROR_MESSAGE_KEY,
  SUCCESS_MESSAGE_KEY
} from "../../../shared/Constants.ts";

import {generateErrorMessage, generateSuccessMessage} from "../../../shared/html/StatusIndicators.ts";
import {getEventDetailsFromForm, validate} from "./EventDetailsHandler.ts";
import {API_ROOT} from "../../../shared/Params.ts";
import {getDayOfWeekSelectHtml} from "../../../shared/html/SelectGenerator.ts";
import {LOGIN_STORE} from "../../auth/data/LoginStore.ts";

import {ImageUploadComponent} from "../../../shared/html/ImageUploadComponent.ts";
import {LoginStatusComponent} from "../../../shared/html/LoginStatusComponent.ts";

customElements.define("image-upload-component",ImageUploadComponent)
customElements.define("login-status-component",LoginStatusComponent)

const CREATE_EVENT_BUTTON_ID = "create-event-button";
const RECURRING_EVENT_INPUT = "is-recurring";
export class CreateEventComponent extends BaseDynamicComponent {
  constructor() {
    super([{
      dataStore: LOGIN_STORE
    }]);
  }
  connectedCallback(){
    this.updateData({
      name:''
    })
  }
  getTemplateStyle(): string {
    return `
      <link rel="stylesheet" type="text/css" href="/styles/sharedHtmlAndComponentStyles.css"/>
      <style>
        h1 {
          margin-top:0;
        }
        input,select,textarea {
          display: block;
        }
        .raised {
           display:inline-block;
           margin-top:1rem;
        }
        @media not screen and (width < 32em) {
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
        @media  screen and (width < 32em) {
          #${EVENT_DESCRIPTION_INPUT} {
            height: 10rem;
          }        
        }
      </style>
    `;
  }

  override attachHandlersToShadowRoot(shadowRoot: ShadowRoot) {

    const self = this;

    shadowRoot.addEventListener("click",(event:any)=>{
      const targetId = event.target.id;
      if(targetId === RECURRING_EVENT_INPUT){
        self.updateData({
          isRecurring: (shadowRoot?.getElementById(RECURRING_EVENT_INPUT) as HTMLInputElement)?.checked
        })
      }

      if(targetId === 'create-event-button'){
        const data = (shadowRoot.getElementById('create-event-form') as HTMLFormElement)?.elements;
        const imageForm = shadowRoot.getElementById("image-upload-ui") as ImageUploadComponent;

        console.log(imageForm)
        const formData = {
          id: self.componentStore.id,
          image:imageForm.getAttribute("image-path"),
          isRecurring: self.componentStore.isRecurring,
          [EVENT_NAME_INPUT]: (data.namedItem(EVENT_NAME_INPUT) as HTMLInputElement)?.value,
          [EVENT_DESCRIPTION_INPUT]: (data.namedItem(EVENT_DESCRIPTION_INPUT) as HTMLInputElement)?.value.trim(),
          [EVENT_URL_INPUT]: (data.namedItem(EVENT_URL_INPUT) as HTMLInputElement)?.value,
          [START_TIME_INPUT]: (data.namedItem(START_TIME_INPUT) as HTMLInputElement)?.value ?? "",
          [END_TIME_INPUT]: (data.namedItem(END_TIME_INPUT) as HTMLInputElement)?.value ?? "",
          [EVENT_LOCATION_INPUT]: (data.namedItem(EVENT_LOCATION_INPUT) as HTMLInputElement)?.value,
        }
        if(self.componentStore.isRecurring){
          // @ts-ignore
          formData[DAY_OF_WEEK_INPUT] = (data.namedItem(DAY_OF_WEEK_INPUT) as HTMLSelectElement).value;
        } else {
          // @ts-ignore
          formData[START_DATE_INPUT] = (data.namedItem(START_DATE_INPUT) as HTMLInputElement).value;
        }

        //@ts-ignore
        const validationErrors:any = validate(formData);
        if(Object.keys(validationErrors.formValidationErrors).length !==0){
          self.updateData({...validationErrors,...formData});
        } else {

          //@ts-ignore
          const eventDetails = getEventDetailsFromForm(formData)
          ApiLoadAction.getResponseData({
            body: JSON.stringify(eventDetails),
            method: ApiActionTypes.POST,
            url: API_ROOT + `/groups/${eventDetails.groupId}/events/`,
          }).then((response:any)=>{
            if(!response.errorMessage){
              self.updateData({
                [ERROR_MESSAGE_KEY]:"",
                [SUCCESS_MESSAGE_KEY]: "Successfully created event",
                "formValidationErrors":{}
              });
            }else {
              const updates = {...response,errorMessage:response.errorMessage,...formData}
              self.updateData(updates)
            }
          })
        }
      }
    })
  }

  render(data: any): string {

    const title = `Add event for group ${(new URLSearchParams(document.location.search)).get("name") ?? ""}`
    document.title= title;
    const groupName = (new URLSearchParams(document.location.search)).get("name") ?? ''
    return `   
   

        <div class="ui-section">
        <form id="create-event-form" onsubmit="return false">   
          <h1>${title}</h1> 
          <div id="form-status-div">
            ${generateErrorMessage(data.errorMessage)}
            ${generateSuccessMessage(data[SUCCESS_MESSAGE_KEY])}      
          </div>
          <div class = "form-section">
            <label class="form-field-header"> Recurring event</label>
            <input 
              id=${RECURRING_EVENT_INPUT}
              name=${RECURRING_EVENT_INPUT}
              type="checkbox"
              ${data.isRecurring ? 'checked' : ''}
            />
          </div>  
          <div class="form-section">
            <label class="form-field-header required-field">Name</label>
            <input
              id=${EVENT_NAME_INPUT}
              name=${EVENT_NAME_INPUT}
              value="${data.name}"
             />
             ${generateErrorMessage(data.formValidationErrors?.[EVENT_NAME_INPUT])}
           </div>
          <div class="form-section">
            <label class="form-field-header required-field">Description</label>
            <textarea
              id=${EVENT_DESCRIPTION_INPUT}
              name=${EVENT_DESCRIPTION_INPUT}
            />${data.description ?? ""}</textarea>
            ${generateErrorMessage(data.formValidationErrors?.[EVENT_DESCRIPTION_INPUT])}
          </div>   
          
          <image-upload-component
            id="image-upload-ui"
          >
          
          </image-upload-component>
          <div class="form-section">
            <label class="form-field-header">Event URL(optional)</label>
            <input
              name=${EVENT_URL_INPUT}
              type="url"
              value="${data.url ?? ""}"
            />
          </div>
          ${data.isRecurring ? 
           `
            <div class="form-section">
              <label class="form-field-header required-field">Day of week</label>
              ${getDayOfWeekSelectHtml(data.day)}
              ${generateErrorMessage(data.formValidationErrors?.[DAY_OF_WEEK_INPUT])}
            </div>
           ` 
          :
          `
            <div class="form-section">
              <label class="form-field-header required-field">Start date</label>
              <input
                name=${START_DATE_INPUT}
                type="date"
                value="${data[START_DATE_INPUT]}"
              />  
            ${generateErrorMessage(data.formValidationErrors?.[START_DATE_INPUT])} 
            </div>`
          }
          <div class="form-section">
            <label class="form-field-header required-field">Start time</label>
            <input
              name=${START_TIME_INPUT}
              type="time"
              value="${data[START_TIME_INPUT]}"
            />
            ${generateErrorMessage(data.formValidationErrors?.[START_TIME_INPUT])} 
          </div>
          <div class="form-section">
            <label class="form-field-header required-field">End time</label>
            <input
              name=${END_TIME_INPUT}
              type="time"
              value="${data[END_TIME_INPUT]}"
            />
            ${generateErrorMessage(data.formValidationErrors?.[END_TIME_INPUT])} 
          </div>
          <div class="form-section">
            <label class="form-field-header required-field">Event address</label>
            <input
              name=${EVENT_LOCATION_INPUT}
              value="${data.location ?? ""}"
            />
            ${generateErrorMessage(data.formValidationErrors?.[EVENT_LOCATION_INPUT])} 
          </div>
          ${generateButton({
            id: CREATE_EVENT_BUTTON_ID,
            text: "Submit",
            type: "Submit"
          })}
                
          ${generateLinkButton({
            text: "Cancel",
            url: `${window.location.origin}/groups.html?name=${encodeURIComponent(groupName)}`
          })}
        </form>
      </div>
    `;
  }
}
