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
import {CREATE_EVENT_CONFIG} from "../../viewEvent/EventDetailsHandler.ts";
import {CREATE_EVENT_THUNK} from "../../viewEvent/data/CreateEventThunk.ts";

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
  globalStateLoadConfig: {
    globalFieldSubscriptions: ["isLoggedIn"],
    waitForGlobalState: "isLoggedIn",
    defaultGlobalStateReducer: function (updates: Record<string, string>) {
      return {
        name: "",
        description: "",
        url: "",
        isVisible: updates["isLoggedIn"],
      };
    },
    thunkReducers: {
      thunk: CREATE_EVENT_THUNK,
      componentStoreReducer: function(data: any){
        console.log(JSON.stringify(data));
      }
    }
  },
};

export class CreateEventComponent extends BaseTemplateDynamicComponent {
  constructor() {
    super("create-event-component", loadConfig);
  }

  getTemplateStyle(): string {
    return templateStyle;
  }

  render(data: any): string {
    return `
    
    ${this.generateErrorMessage(data.errorMessage)}
    <form>
      ${data.isVisible ? `
        <h1>Create board game event</h1>
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
        <button ${this.createClickEvent(CREATE_EVENT_CONFIG)}>Create event</button>
        <a href="${window.location.origin}/groups.html?name=${encodeURIComponent(getUrlParameter("groupName"))}">
          Back to group
        </a>
      `
      
      : `<p>User does not have permission to access this page </p>`
      
      }  
    `;
  }
}

if (!customElements.get("create-event-component")) {
  customElements.define(
    "create-event-component",
    CreateEventComponent,
  );
}
