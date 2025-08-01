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
import {PageState} from "../../../../framework/state/PageState.ts";
import {generateButton} from "../../../../shared/components/ButtonGenerator.ts";
import {
  VIEW_GROUP_PAGE_HANDLER_CONFIG
} from "../../../../shared/nav/NavEventHandlers.ts";
import {generateErrorMessage} from "../../../../framework/components/utils/StatusIndicators.ts";

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
  requestThunkReducers:[
    {
      thunk: CREATE_EVENT_THUNK,
      componentStoreReducer: function(data: any){
        if(!data.errorMessage){
          return {
            successMessage: "Successfully created event"
          }
        }
        return data;
      }
    }
  ],
  globalStateLoadConfig: {
    globalFieldSubscriptions: ["isLoggedIn"],
    defaultGlobalStateReducer: function (updates: Record<string, string>) {
      PageState.pageLoaded = true;
      return {
        name: "",
        description: "",
        url: "",
        isVisible: updates["isLoggedIn"],
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
      this.updateStore({isVisible: true})
    }
  }

  getTemplateStyle(): string {
    return templateStyle;
  }

  render(data: any): string {

    return `
    
    ${generateErrorMessage(data.errorMessage)}
    
    ${data.successMessage ? `<p>${data.successMessage}</p>`: ``}
    <form onsubmit="return false">
      
        <h1>Create board game event for group ${getUrlParameter("groupName")}</h1>
         <form>
    
      ${this.generateInputFormItem({
        id: EVENT_NAME_INPUT,
        componentLabel: "Event name",
        inputType: "text",
        value: data.name
      })}
      
      ${this.generateTextInputFormItem({
        id: EVENT_DESCRIPTION_INPUT,
        componentLabel: "Event description",
        inputType: "text",
        value: data.description
      })}
      
       ${this.generateInputFormItem({
        id: EVENT_URL_INPUT,
        componentLabel: "Event URL",
        inputType: "text",
        value: data.url
      })}
       
      ${this.generateInputFormItem({
        id: START_DATE_INPUT,
        componentLabel: "Start date",
        inputType: "text",
        value: ""
      })}
      
      ${this.generateInputFormItem({
        id: START_TIME_INPUT,
        componentLabel: "Start time",
        inputType: "text",
        value: ""
      })}
 
      ${this.generateInputFormItem({
        id: END_TIME_INPUT,
        componentLabel: "End time",
        inputType: "text",
        value: ""
      })}     
      <br>
  
      ${this.generateInputFormItem({
        id: EVENT_LOCATION_INPUT,
        componentLabel: "Event location",
        inputType: "text",
        value: data.location ?? ""
      })}     
    </form>
    
    ${generateButton({
      text: "Create event",
      component: this,
      eventHandlerConfig: CREATE_EVENT_CONFIG,
    })}
        
        
    ${generateButton({
      text: "Back to group",
      component: this,
      eventHandlerConfig: VIEW_GROUP_PAGE_HANDLER_CONFIG,
      eventHandlerParams: {"name":getUrlParameter("groupName")}
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
