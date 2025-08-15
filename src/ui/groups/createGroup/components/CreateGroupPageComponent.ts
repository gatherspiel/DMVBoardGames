import { BaseTemplateDynamicComponent } from "../../../../framework/components/BaseTemplateDynamicComponent.ts";
import { CREATE_GROUP_EVENT_CONFIG } from "../CreateGroupPageHandler.ts";
import { CREATE_GROUP_REQUEST_THUNK } from "../data/CreateGroupRequestThunk.ts";
import {
  GROUP_DESCRIPTION_INPUT,
  GROUP_NAME_INPUT,
  GROUP_URL_INPUT,
} from "../../Constants.ts";
import {generateButton} from "../../../../shared/components/ButtonGenerator.ts";
import {generateErrorMessage} from "../../../../framework/components/utils/StatusIndicators.ts";
import {
  COMPONENT_LABEL_KEY,
  EVENT_HANDLER_CONFIG_KEY,
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
    #group-description-input {
      height:500px;
      width: 800px;
    }
    #create-group-page-container {
      padding-left: 1rem;
    }
  </style>
`;

const loadConfig = {
  [REQUEST_THUNK_REDUCERS_KEY]: [
    {
      thunk: CREATE_GROUP_REQUEST_THUNK,
      componentReducer:  (data: any) => {
        if (data.errorMessage) {
          return {
            errorMessage: data.errorMessage,
            [SUCCESS_MESSAGE_KEY]: "",
          };
        } else {
          return {
            errorMessage: "",
            [SUCCESS_MESSAGE_KEY]: "Successfully created group",
          };
        }
      },
    },
  ],
  [GLOBAL_STATE_LOAD_CONFIG_KEY]: {
    [GLOBAL_FIELD_SUBSCRIPTIONS_KEY]: [IS_LOGGED_IN_KEY],
    [DEFAULT_GLOBAL_STATE_REDUCER_KEY]: (updates: Record<string, string>) => {
      return {
        name: "",
        description: "",
        url: "",
        isVisible: updates[IS_LOGGED_IN_KEY],
      };
    },
  },
};

export class CreateGroupPageComponent extends BaseTemplateDynamicComponent {
  constructor() {
    super("create-group-page-component", loadConfig);
  }

  getTemplateStyle(): string {
    return templateStyle;
  }

  connectedCallback(){
    this.updateWithDefaultReducer({isVisible: true})
  }

  render(createGroupData: any): string {

    return `
      <div id="create-group-page-container">
        <h1>Create board game group</h1>
        
          ${
            createGroupData.isVisible
              ? `
                <form onsubmit="return false">
                
                 ${this.addShortInput({
                  id: GROUP_NAME_INPUT,
                  [COMPONENT_LABEL_KEY]: "Group Name",
                  inputType: "text",
                  value: createGroupData.name ?? ''
                })}   
                 
                ${this.addShortInput({
                  id: GROUP_URL_INPUT,
                  [COMPONENT_LABEL_KEY]: "Group URL",
                  inputType: "text",
                  value: createGroupData.url ?? ''
                })}   
                  
                ${this.addTextInput({
                  id: GROUP_DESCRIPTION_INPUT,
                  [COMPONENT_LABEL_KEY]: "Group Description",
                  inputType: "text",
                  value: createGroupData.description ?? ''
                })}   
    
                <br>
                
                 ${generateButton({
                  text: "Create group",
                  component: this,
                  [EVENT_HANDLER_CONFIG_KEY]: CREATE_GROUP_EVENT_CONFIG,
                })}
             
                </form>
               
                <p class="${SUCCESS_MESSAGE_KEY}">${createGroupData?.[SUCCESS_MESSAGE_KEY]?.trim() ?? ""}</p>
                ${generateErrorMessage(createGroupData.errorMessage)}
              `
              : `<p>You must log in to create a group </p>`
          }    
     </div> 
     `;

  }
}

if (!customElements.get("create-group-page-component")) {
  customElements.define(
    "create-group-page-component",
    CreateGroupPageComponent,
  );
}
