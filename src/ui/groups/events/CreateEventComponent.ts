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
import {generateButton, generateLinkButton} from "../../../shared/components/ButtonGenerator.ts";
import {
  SUCCESS_MESSAGE_KEY
} from "../../../shared/Constants.ts";

import {LOGIN_STORE} from "../../auth/data/LoginStore.ts";
import {generateErrorMessage} from "../../../shared/components/StatusIndicators.ts";
import {convertTimeTo24Hours} from "../../../shared/EventDataUtils.ts";
import {getEventDetailsFromForm, validateEventFormData} from "./EventDetailsHandler.ts";
import {API_ROOT} from "../../../shared/Params.ts";
import {getDayOfWeekSelectHtml} from "../../../shared/components/SelectGenerator.ts";

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
        #${EVENT_NAME_INPUT} {
          display:inline-block;
          width: 50rem;
        }
        #${EVENT_DESCRIPTION_INPUT} {
         display:inline-block;
          width: 50rem;
          height: 10rem;
        }
        #${EVENT_LOCATION_INPUT} {
          width: 50rem;
        }
        .raised {
           display:inline-block;
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
                [SUCCESS_MESSAGE_KEY]: "Successfully created event"
              });
            }else {
              const updates = {...response,...formData}
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
      
      ${data[SUCCESS_MESSAGE_KEY] ? `<p class="${SUCCESS_MESSAGE_KEY}">${data[SUCCESS_MESSAGE_KEY]}</p>`: ``}
      <form id="create-event-form" onsubmit="return false">
        
        <h1>Create board game event for group ${(new URLSearchParams(document.location.search)).get("name") ?? ""}</h1>
         
        <label> Recurring event</label>
        <input 
          id=${RECURRING_EVENT_INPUT}
          name=${RECURRING_EVENT_INPUT}
          type="checkbox"
          ${data.isRecurring ? 'checked' : ''}
        />
        <br>
        <label>Event name</label>
        <input
          id=${EVENT_NAME_INPUT}
          name=${EVENT_NAME_INPUT}
          value="${data.name}"
         />
        <br>
  
        <label>Event description</label>
        <br>
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
        <br>
        
        ${data.isRecurring ? 
         `
          <label>Day of week</label>
          ${getDayOfWeekSelectHtml(data.day)}
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
        <br>
        
        <label>End time</label>
        <input
          name=${END_TIME_INPUT}
        />
        <br>        
        
        <label>Event location</label>
        <input
          name=${EVENT_LOCATION_INPUT}
          value="${data.location ?? ""}"
        />
        <br>   
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
