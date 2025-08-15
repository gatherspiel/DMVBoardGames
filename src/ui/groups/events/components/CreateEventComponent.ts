import {BaseTemplateDynamicComponent} from "../../../../framework/components/BaseTemplateDynamicComponent.ts";
import {getUrlParameter} from "../../../../framework/utils/UrlParamUtils.ts";
import {
  END_TIME_INPUT,
  EVENT_DESCRIPTION_INPUT, EVENT_LOCATION_INPUT,
  EVENT_NAME_INPUT,
  EVENT_URL_INPUT,
  START_DATE_INPUT,
  START_TIME_INPUT
} from "../../Constants.ts";
import {CREATE_EVENT_CONFIG} from "../EventDetailsHandler.ts";
import {CREATE_EVENT_THUNK} from "../data/CreateEventThunk.ts";
import {PageState} from "../../../../framework/spa/PageState.ts";
import {generateButton} from "../../../../shared/components/ButtonGenerator.ts";
import {
  VIEW_GROUP_PAGE_HANDLER_CONFIG
} from "../../../../shared/nav/NavEventHandlers.ts";
import {generateErrorMessage} from "../../../../framework/components/utils/StatusIndicators.ts";
import {
  COMPONENT_LABEL_KEY,
  EVENT_HANDLER_CONFIG_KEY, EVENT_HANDLER_PARAMS_KEY,
  IS_LOGGED_IN_KEY,
  SUCCESS_MESSAGE_KEY
} from "../../../../shared/Constants.ts";
import {
  DEFAULT_GLOBAL_STATE_REDUCER_KEY,
  GLOBAL_FIELD_SUBSCRIPTIONS_KEY,
  GLOBAL_STATE_LOAD_CONFIG_KEY,
  REQUEST_THUNK_REDUCERS_KEY
} from "../../../../framework/components/types/ComponentLoadConfig.ts";

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
  [REQUEST_THUNK_REDUCERS_KEY]:[
    {
      thunk: CREATE_EVENT_THUNK,
      componentReducer: (data: any)=>{
        if(!data.errorMessage){
          return {
            [SUCCESS_MESSAGE_KEY]: "Successfully created event"
          }
        }
        return data;
      }
    }
  ],
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

export class CreateEventComponent extends BaseTemplateDynamicComponent {
  constructor() {
    super("create-event-component", loadConfig);

  }

  connectedCallback(){
    if(PageState.pageLoaded) {
      this.updateWithDefaultReducer({isVisible: true})
    }
  }

  getTemplateStyle(): string {
    return templateStyle;
  }

  render(data: any): string {

    return `
    
    ${generateErrorMessage(data.errorMessage)}
    
    ${data[SUCCESS_MESSAGE_KEY] ? `<p class="${SUCCESS_MESSAGE_KEY}">${data[SUCCESS_MESSAGE_KEY]}</p>`: ``}
    <form onsubmit="return false">
      
        <h1>Create board game event for group ${getUrlParameter("groupName")}</h1>
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
        value: ""
      })}
      
      ${this.addShortInput({
        id: START_TIME_INPUT,
        [COMPONENT_LABEL_KEY]: "Start time",
        inputType: "text",
        value: ""
      })}
 
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
    </form>
    
    ${generateButton({
      text: "Create event",
      component: this,
      [EVENT_HANDLER_CONFIG_KEY]: CREATE_EVENT_CONFIG,
    })}
        
        
    ${generateButton({
      text: "Back to group",
      component: this,
      [EVENT_HANDLER_CONFIG_KEY]: VIEW_GROUP_PAGE_HANDLER_CONFIG,
      [EVENT_HANDLER_PARAMS_KEY]: {"name":getUrlParameter("groupName")}
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
