import {
  ApiActionTypes,
  BaseDynamicComponent, ApiLoadAction,
} from "@bponnaluri/places-js";
import {
  END_TIME_INPUT,
  EVENT_DESCRIPTION_INPUT, EVENT_LOCATION_INPUT,
  EVENT_NAME_INPUT,
  EVENT_URL_INPUT,
  START_DATE_INPUT, START_TIME_INPUT,
} from "../Constants.ts";
import {generateButton, generateLinkButton} from "../../../shared/components/ButtonGenerator.ts";
import {generateErrorMessage} from "@bponnaluri/places-js";
import {
  SUCCESS_MESSAGE_KEY
} from "../../../shared/Constants.ts";

import {LOGIN_STORE} from "../../auth/data/LoginStore.ts";
import {getEventDetailsFromForm, validateEventFormData} from "./EventDetailsHandler.ts";
import { API_ROOT } from "../../../shared/Params.ts";

const templateStyle = `
  <link rel="stylesheet" type="text/css" href="/styles/sharedComponentStyles.css"/>

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
       line-height:1
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

export class CreateEventComponent extends BaseDynamicComponent {
  constructor() {
    super(loadConfig);
  }

  override attachEventsToShadowRoot(shadowRoot: ShadowRoot) {

    const self = this;

    shadowRoot?.getElementById('create-event-form')?.addEventListener('submit',(event:any)=>{
      event.preventDefault();

      const data = event.target.elements;

      const formData = {
        id: self.componentState.id,
        [EVENT_NAME_INPUT]: data[0].value,
        [EVENT_DESCRIPTION_INPUT]: data[1].value,
        [EVENT_URL_INPUT]: data[2].value,
        [START_DATE_INPUT]: data[3].value,
        [START_TIME_INPUT]: data[4].value,
        [END_TIME_INPUT]: data[5].value,
        [EVENT_LOCATION_INPUT]: data[6].value
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
          url: API_ROOT + `groups/${eventDetails.groupId}/events/`,
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
      <form id="create-event-form">
        
        <h1>Create board game event for group ${(new URLSearchParams(document.location.search)).get("name") ?? ""}</h1>
         
        <label>Event name</label>
        <input
          id=${EVENT_NAME_INPUT}
           name=${EVENT_NAME_INPUT}
           value="${data.name}"
         />
        </input>
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
        </input>
        <br>
        
        <label>Start date</label>
        <input
          name=${START_DATE_INPUT}
        />
        </input>
        <br>
        
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
          name=${EVENT_LOCATION_INPUT}
          value="${data.location ?? ""}"
        />
        </input>
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
