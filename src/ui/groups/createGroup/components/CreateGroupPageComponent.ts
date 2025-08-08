import { BaseTemplateDynamicComponent } from "../../../../framework/components/BaseTemplateDynamicComponent.ts";
import { CREATE_GROUP_EVENT_CONFIG } from "../CreateGroupPageHandler.ts";
import { CREATE_GROUP_REQUEST_THUNK } from "../data/CreateGroupRequestThunk.ts";
import type { CreateGroupData } from "../data/types/CreateGroupData.ts";
import {
  GROUP_DESCRIPTION_INPUT,
  GROUP_NAME_INPUT,
  GROUP_URL_INPUT,
} from "../../Constants.ts";
import {generateButton} from "../../../../shared/components/ButtonGenerator.ts";
import {generateErrorMessage} from "../../../../framework/components/utils/StatusIndicators.ts";

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
  requestThunkReducers: [
    {
      thunk: CREATE_GROUP_REQUEST_THUNK,
      componentReducer: function (data: any) {
        if (data.errorMessage) {
          return {
            errorMessage: data.errorMessage,
            successMessage: "",
          };
        } else {
          return {
            errorMessage: "",
            successMessage: "Successfully created group",
          };
        }
      },
    },
  ],
  globalStateLoadConfig: {
    globalFieldSubscriptions: ["isLoggedIn"],
    defaultGlobalStateReducer: function (updates: Record<string, string>) {
      return {
        name: "",
        description: "",
        url: "",
        isVisible: updates["isLoggedIn"],
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
    this.updateStore({isVisible: true})
  }

  render(createGroupData: CreateGroupData): string {

    return `
      <div id="create-group-page-container">
        <h1>Create board game group</h1>
        
          ${
            createGroupData.isVisible
              ? `
                <form onsubmit="return false">
                
                 ${this.generateShortInput({
                  id: GROUP_NAME_INPUT,
                  componentLabel: "Group Name",
                  inputType: "text",
                  value: createGroupData.name ?? ''
                })}   
                 
                ${this.generateShortInput({
                  id: GROUP_URL_INPUT,
                  componentLabel: "Group URL",
                  inputType: "text",
                  value: createGroupData.url ?? ''
                })}   
                  
                ${this.generateTextInput({
                  id: GROUP_DESCRIPTION_INPUT,
                  componentLabel: "Group Description",
                  inputType: "text",
                  value: createGroupData.description ?? ''
                })}   
    
                <br>
                
                 ${generateButton({
                  text: "Create group",
                  component: this,
                  eventHandlerConfig: CREATE_GROUP_EVENT_CONFIG,
                })}
             
                </form>
               
                <p class="success-message">${createGroupData?.successMessage?.trim() ?? ""}</p>
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
