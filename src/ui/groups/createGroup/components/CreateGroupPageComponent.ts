import { BaseTemplateDynamicComponent } from "../../../../framework/components/BaseTemplateDynamicComponent.ts";
import { CREATE_GROUP_EVENT_CONFIG } from "./CreateGroupPageHandler.ts";
import { CREATE_GROUP_REQUEST_THUNK } from "../data/CreateGroupRequestThunk.ts";
import type { CreateGroupData } from "../data/types/CreateGroupData.ts";
import {
  GROUP_DESCRIPTION_INPUT,
  GROUP_NAME_INPUT,
  GROUP_URL_INPUT,
} from "../../Constants.ts";

const template = document.createElement("template");
template.innerHTML = `
  <style>
    #create-group-error-message {
      color:darkred;
    }
    #openGroupEditPageButton {
      padding: 2rem;
    }
  </style>
  <div>
    <h1>Create group</h1>
</div>
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
    waitForGlobalState: "isLoggedIn",
    defaultGlobalStateReducer: function (updates: Record<string, string>) {
      return {
        name: "",
        summary: "",
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

  getTemplate(): HTMLTemplateElement {
    return template;
  }

  render(createGroupData: CreateGroupData): string {
    return `
      <h1>Create board game group</h1>
      
        ${
          createGroupData.isVisible
            ? `
              <form onsubmit="return false">
              
                <label for="group-name">Group Name</label>
                <input 
                  class="group-data-input"
                  id=${GROUP_NAME_INPUT}
                  name=${GROUP_NAME_INPUT}
                  type="text" 
                  value="${createGroupData.name}"
                />
          
                <label for="group-url">Group URL:</label>
                <input 
                  class="group-data-input" 
                  id = "group-url-input"
                  name=${GROUP_URL_INPUT}
                  type="text"
                  value= "${createGroupData.url}"   
                /> 
          
                <label for="group-description">Group Description</label>
                <textarea class="group-data-input" id = "group-description-input" type="text" id=${GROUP_DESCRIPTION_INPUT} name=${GROUP_DESCRIPTION_INPUT}> ${createGroupData.summary}
                </textarea>
                <button type="submit" ${this.createClickEvent(CREATE_GROUP_EVENT_CONFIG)}>Create group</button>
           
              </form>
              
              
              <p>${createGroupData.successMessage ? createGroupData.successMessage.trim() : ""}</p>
              <p id="create-group-error-message">${createGroupData.errorMessage ? createGroupData.errorMessage.trim() : ""}</p>

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
