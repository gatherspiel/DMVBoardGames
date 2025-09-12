import {
  ApiActionTypes,
  BaseDynamicComponent, ApiLoadAction,
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
import {getEventDetailsFromForm, validateEventFormData} from "./EventDetailsHandler.ts";
import {generateErrorMessage} from "../../../shared/components/StatusIndicators.ts";
import { API_ROOT } from "../../../shared/Params.ts";
import {convertTimeTo24Hours} from "../../../shared/DateUtils.ts";

const templateStyle = `
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

const loadConfig =  [{
      componentReducer:(data:any)=>{
        return {
          name: "",
          description: "",
          url: "",
          isVisible: data["loggedIn"],
        };
      },
      dataStore: LOGIN_STORE
    }];

const CREATE_EVENT_BUTTON_ID = "create-event-button";
const RECURRING_EVENT_INPUT = "is-recurring";

export class CreateEventComponent extends BaseDynamicComponent {
  constructor() {
    super(loadConfig);
  }

  override attachEventHandlersToDom(shadowRoot: ShadowRoot) {

    const self = this;

    const checkbox = shadowRoot?.getElementById(RECURRING_EVENT_INPUT)
    checkbox?.addEventListener("click",(event:any)=>{
      event.preventDefault();
      self.updateData({
        isRecurring: (shadowRoot?.getElementById(RECURRING_EVENT_INPUT) as HTMLInputElement)?.checked
      })
    })

    shadowRoot?.getElementById('create-event-form')?.addEventListener('submit',(event:any)=>{
      event.preventDefault();

      const data = event.target.elements;

      const formData = {
        id: self.componentStore.id,
        [EVENT_NAME_INPUT]: data[1].value,
        [EVENT_DESCRIPTION_INPUT]: data[2].value,
        [EVENT_URL_INPUT]: data[3].value,
        [START_TIME_INPUT]: convertTimeTo24Hours(data[5].value ?? ""),
        [END_TIME_INPUT]: convertTimeTo24Hours(data[6].value ?? ""),
        [EVENT_LOCATION_INPUT]: data[7].value,
        isRecurring: self.componentStore.isRecurring,
      }


      if(self.componentStore.isRecurring){
        // @ts-ignore
        formData[DAY_OF_WEEK_INPUT] = data[4].value;
      } else {
        // @ts-ignore
        formData[START_DATE_INPUT] = data[4].value;
      }

      const validationErrors:any = validateEventFormData(formData);
      if(validationErrors.errorMessage.length !==0){
        const updates = {...validationErrors,...formData}
        self.updateData(updates);
      } else {
        const eventDetails = getEventDetailsFromForm(formData)
        console.log("Saving event");
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
    })
  }

  getTemplateStyle(): string {
    return templateStyle;
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
      <br>
      ${generateButton({
        id: CREATE_EVENT_BUTTON_ID,
        text: "Create event",
        type: "Submit"
      })}
            
      ${generateLinkButton({
        text: "Back to group",
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
