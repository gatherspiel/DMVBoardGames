import {
  AbstractPageComponent, ApiActionTypes,
  BaseTemplateDynamicComponent, InternalApiAction,
} from "@bponnaluri/places-js";
import {getUrlParameter} from "@bponnaluri/places-js";
import {
  END_TIME_INPUT,
  EVENT_DESCRIPTION_INPUT, EVENT_LOCATION_INPUT,
  EVENT_NAME_INPUT,
  EVENT_URL_INPUT,
  START_DATE_INPUT,
  START_TIME_INPUT
} from "../../Constants.ts";
import {PageState} from "@bponnaluri/places-js";
import {generateButton} from "../../../../shared/components/ButtonGenerator.ts";
import {generateErrorMessage} from "@bponnaluri/places-js";
import {
  COMPONENT_LABEL_KEY,
  IS_LOGGED_IN_KEY,
  SUCCESS_MESSAGE_KEY
} from "../../../../shared/Constants.ts";
import {
  DEFAULT_GLOBAL_STATE_REDUCER_KEY,
  GLOBAL_FIELD_SUBSCRIPTIONS_KEY,
  GLOBAL_STATE_LOAD_CONFIG_KEY,
} from "@bponnaluri/places-js";
import {GroupPageComponent} from "../../viewGroup/components/GroupPageComponent.ts";
import {getEventDetailsFromForm, validateEventFormData} from "../EventDetailsHandler.ts";
import {API_ROOT} from "../../../../shared/Params.ts";

const templateStyle = `
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
  [GLOBAL_STATE_LOAD_CONFIG_KEY]: {
    [GLOBAL_FIELD_SUBSCRIPTIONS_KEY]: [IS_LOGGED_IN_KEY],
    [DEFAULT_GLOBAL_STATE_REDUCER_KEY]:  (updates: Record<string, string>) => {
      PageState.pageLoaded = true;
      return {
        name: "",
        description: "",
        url: "",
        isVisible: updates[IS_LOGGED_IN_KEY],
      };
    },
  },
};

const CREATE_EVENT_BUTTON_ID = "create-event-button";
const BACK_TO_GROUP_ID = "back-to-group";

export class CreateEventComponent extends BaseTemplateDynamicComponent {
  constructor() {
    super(loadConfig);
    console.log("Created element")
  }

  connectedCallback(){
    if(PageState.pageLoaded) {
      this.retrieveData({isVisible: true})
    }
  }

  override attachEventHandlersToDom(shadowRoot?: any) {
    const self = this;
    shadowRoot?.addEventListener("click",(event:any)=>{
      try {
        if(event.originalTarget.id === BACK_TO_GROUP_ID) {
          AbstractPageComponent.updateRoute(
            GroupPageComponent,
            {"name":getUrlParameter("name")}
          )
        }

        if(event.originalTarget.id === CREATE_EVENT_BUTTON_ID){
          const validationErrors:any = validateEventFormData(self);

          console.log(validationErrors.errorMessage)
          if(validationErrors.errorMessage.length !==0){
            self.retrieveData(validationErrors);
          } else {
            console.log("Adding event")
            const eventDetails = getEventDetailsFromForm(self)
            InternalApiAction.getResponseData({
              body: JSON.stringify(eventDetails),
              method: ApiActionTypes.POST,
              url: API_ROOT + `/groups/${eventDetails.groupId}/events/`,
            }).then((response:any)=>{
              console.log(response)
              if(!response.errorMessage){
                console.log("Created event")
                self.retrieveData({
                  [SUCCESS_MESSAGE_KEY]: "Successfully created event"
                });
              }
              self.retrieveData(response)
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

  getTemplateStyle(): string {
    return templateStyle;
  }

  render(data: any): string {
    console.log("Rendering")
    console.log(data);
    return `
    
    ${generateErrorMessage(data.errorMessage)}
    
    ${data[SUCCESS_MESSAGE_KEY] ? `<p class="${SUCCESS_MESSAGE_KEY}">${data[SUCCESS_MESSAGE_KEY]}</p>`: ``}
    <form onsubmit="return false">
      
        <h1>Create board game event for group ${getUrlParameter("name")}</h1>
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
        value: ""
      })}
      <br>
      
      ${this.addShortInput({
        id: START_TIME_INPUT,
        [COMPONENT_LABEL_KEY]: "Start time",
        inputType: "text",
        value: ""
      })}
      <br>
 
      ${this.addShortInput({
        id: END_TIME_INPUT,
        [COMPONENT_LABEL_KEY]: "End time",
        inputType: "text",
        value: ""
      })}     
      <br>
  
      ${this.addShortInput({
        id: EVENT_LOCATION_INPUT,
        [COMPONENT_LABEL_KEY]: "Event location",
        inputType: "text",
        value: data.location ?? ""
      })}    
      <br> 
    </form>
    
    <br>
    ${generateButton({
      component: this,
      id: CREATE_EVENT_BUTTON_ID,
      text: "Create event",
    })}
        
        
    ${generateButton({
      component: this,
      id: BACK_TO_GROUP_ID,
      text: "Back to group",
    })}
    `;
  }
}

if (!customElements.get("create-event-component")) {
  customElements.define(
    "create-event-component",
    CreateEventComponent,
  );
}
