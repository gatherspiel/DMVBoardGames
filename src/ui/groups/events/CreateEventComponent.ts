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

import {LOGIN_STORE} from "../../auth/data/LoginStore.ts";
import {generateErrorMessage, generateSuccessMessage} from "../../../shared/html/StatusIndicators.ts";
import {convertTimeTo24Hours} from "../../../shared/data/EventDataUtils.ts";
import {getEventDetailsFromForm, validateEventFormData} from "./EventDetailsHandler.ts";
import {API_ROOT} from "../../../shared/Params.ts";
import {getDayOfWeekSelectHtml} from "../../../shared/html/SelectGenerator.ts";

const CREATE_EVENT_BUTTON_ID = "create-event-button";
const RECURRING_EVENT_INPUT = "is-recurring";

export class CreateEventComponent extends BaseDynamicComponent {
  constructor() {
    super([{
      componentReducer:(data:any)=>{
        return {
          name: "",
          description: "",
          url: "",
          isVisible: data["loggedIn"],
        };
      },
      dataStore: LOGIN_STORE
    }]);
  }

  getTemplateStyle(): string {
    return `
      <link rel="stylesheet" type="text/css" href="/styles/sharedHtmlAndComponentStyles.css"/>
      <style>
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
        .raised {
           display:inline-block;
           margin-top:1rem;
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
        const formData = {
          id: self.componentStore.id,
          [EVENT_NAME_INPUT]: (data.namedItem(EVENT_NAME_INPUT) as HTMLInputElement)?.value,
          [EVENT_DESCRIPTION_INPUT]: (data.namedItem(EVENT_DESCRIPTION_INPUT) as HTMLInputElement)?.value,
          [EVENT_URL_INPUT]: (data.namedItem(EVENT_URL_INPUT) as HTMLInputElement)?.value,
          [START_TIME_INPUT]: convertTimeTo24Hours((data.namedItem(START_TIME_INPUT) as HTMLInputElement)?.value ?? ""),
          [END_TIME_INPUT]: convertTimeTo24Hours((data.namedItem(END_TIME_INPUT) as HTMLInputElement)?.value ?? ""),
          [EVENT_LOCATION_INPUT]: (data.namedItem(EVENT_LOCATION_INPUT) as HTMLInputElement)?.value,
          isRecurring: self.componentStore.isRecurring,
        }
        if(self.componentStore.isRecurring){
          // @ts-ignore
          formData[DAY_OF_WEEK_INPUT] = (data.namedItem(DAY_OF_WEEK_INPUT) as HTMLSelectElement).value;
        } else {
          // @ts-ignore
          formData[START_DATE_INPUT] = (data.namedItem(START_DATE_INPUT) as HTMLInputElement).value;
        }

        const validationErrors:any = validateEventFormData(formData);
        if(validationErrors.errorMessage.length !==0){
          const updates = {...validationErrors,...formData}
          self.updateData(updates);
        } else {
          const eventDetails = getEventDetailsFromForm(formData)
          ApiLoadAction.getResponseData({
            body: JSON.stringify(eventDetails),
            method: ApiActionTypes.POST,
            url: API_ROOT + `/groups/${eventDetails.groupId}/events/`,
          }).then((response:any)=>{
            if(!response.errorMessage){
              self.updateData({
                [ERROR_MESSAGE_KEY]:"",
                [SUCCESS_MESSAGE_KEY]: "Successfully created event"
              });
            }else {
              const updates = {...response,errorMessage:'',...formData}
              self.updateData(updates)
            }
          })
        }
      }
    })
  }

  render(data: any): string {

    const groupName = (new URLSearchParams(document.location.search)).get("name") ?? ''
    return `   
      ${generateErrorMessage(data.errorMessage)}
      ${generateSuccessMessage(data[SUCCESS_MESSAGE_KEY])}
      
      <form id="create-event-form" onsubmit="return false">
        
        <h1>Create board game event for group ${(new URLSearchParams(document.location.search)).get("name") ?? ""}</h1>
         
        <label> Recurring event</label>
        <input 
          id=${RECURRING_EVENT_INPUT}
          name=${RECURRING_EVENT_INPUT}
          type="checkbox"
          ${data.isRecurring ? 'checked' : ''}
        />
        <label>Event name</label>
        <input
          id=${EVENT_NAME_INPUT}
          name=${EVENT_NAME_INPUT}
          value="${data.name}"
         />
  
        <label>Event description</label>
        <textarea
          id=${EVENT_DESCRIPTION_INPUT}
          name=${EVENT_DESCRIPTION_INPUT}
        />
        ${data.description ?? ""}
        </textarea>
         
        <label>Event URL</label>
        <input
          name=${EVENT_URL_INPUT}
          type="url"
          value="${data.url ?? ""}"
        />
        
        ${data.isRecurring ? 
         `
          <label>Day of week</label>
          ${getDayOfWeekSelectHtml(data.day)}
         ` 
        :
        `
          <label>Start date</label>
          <input
            name=${START_DATE_INPUT}
            type="date"
            value="${data[START_DATE_INPUT]}"
          />`}
        
        <label>Start time</label>
        <input
          name=${START_TIME_INPUT}
          type="time"
          value="${data[START_TIME_INPUT]}"
        />
        
        <label>End time</label>
        <input
          name=${END_TIME_INPUT}
          type="time"
          value="${data[END_TIME_INPUT]}"
        />
        
        <label>Event location</label>
        <input
          name=${EVENT_LOCATION_INPUT}
          value="${data.location ?? ""}"
        />
        ${generateButton({
          id: CREATE_EVENT_BUTTON_ID,
          text: "Create event",
          type: "Submit"
        })}
              
        ${generateLinkButton({
          text: "Back to group information",
          url: `${window.location.origin}/groups.html?name=${encodeURIComponent(groupName)}`
        })}
      </form>
    `;
  }
}

if (!customElements.get("create-event-component")) {
  customElements.define(
    "create-event-component",
    CreateEventComponent,
  );
}
