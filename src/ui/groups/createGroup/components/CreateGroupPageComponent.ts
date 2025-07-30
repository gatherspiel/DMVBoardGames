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
import {createRequestStore} from "../../../../framework/state/data/RequestStore.ts";

const templateStyle = `
  <link rel="stylesheet" type="text/css" href="/styles/sharedComponentStyles.css"/>

  <style>
    #create-group-error-message {
    }
  </style>
`;

const loadConfig = {
  thunkReducers: [
    {
      thunk: CREATE_GROUP_REQUEST_THUNK,
      componentStoreReducer: function (data: any) {
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
    createRequestStore(CREATE_GROUP_REQUEST_THUNK.requestStoreId ?? '', CREATE_GROUP_REQUEST_THUNK)

  }

  render(createGroupData: CreateGroupData): string {

    return `
      <h1>Create board game group</h1>
      
        ${
          createGroupData.isVisible
            ? `
              <form onsubmit="return false">
              
               ${this.generateInputFormItem({
                id: GROUP_NAME_INPUT,
                componentLabel: "Group Name",
                inputType: "text",
                value: createGroupData.name
              })}   
               
              ${this.generateInputFormItem({
                id: GROUP_URL_INPUT,
                componentLabel: "Group URL",
                inputType: "text",
                value: createGroupData.url
              })}   
                
              ${this.generateTextInputFormItem({
                id: GROUP_DESCRIPTION_INPUT,
                componentLabel: "Group Description",
                inputType: "text",
                value: createGroupData.description
              })}   
  
              <br>
              
               ${generateButton({
                text: "Create group",
                component: this,
                eventHandlerConfig: CREATE_GROUP_EVENT_CONFIG,
              })}
           
              </form>
             
              <p>${createGroupData?.successMessage?.trim() ?? ""}</p>
              ${this.generateErrorMessage(createGroupData.errorMessage)}
            `
            : `<p>You must log in to create a group </p>`
        }    
    `;
  }
}

if (!customElements.get("create-group-page-component")) {
  customElements.define(
    "create-group-page-component",
    CreateGroupPageComponent,
  );
}
