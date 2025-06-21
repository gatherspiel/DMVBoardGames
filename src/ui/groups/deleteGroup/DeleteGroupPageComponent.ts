import { BaseTemplateDynamicComponent } from "../../../framework/components/BaseTemplateDynamicComponent.ts";
import { GROUP_NAME_INPUT } from "../Constants.ts";
import { DELETE_GROUP_EVENT_CONFIG } from "./DeleteGroupPageHandlers.ts";
import { DELETE_GROUP_REQUEST_THUNK } from "./DeleteGroupRequestThunk.ts";
import type { DeleteGroupData } from "./types/DeleteGroupData.ts";
import { getUrlParameter } from "../../../framework/utils/urlParmUtils.ts";
import { getSharedButtonStyles } from "../../utils/sharedStyles.ts";

const template = document.createElement("template");
template.innerHTML = `
  <style>
    #delete-group-error-message {
      color:darkred;
    }
    #openGroupEditPageButton {
      padding: 2rem;
    }
  </style>
`;

const loadConfig = {
  thunkReducers: [
    {
      thunk: DELETE_GROUP_REQUEST_THUNK,
      componentStoreReducer: function (data: any) {
        console.log(JSON.stringify(data));
        if (data.errorMessage) {
          return {
            errorMessage: data.errorMessage,
          };
        } else {
          return {
            successMessage: "Successfully deleted group",
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
        existingGroupName: getUrlParameter("name"),
      };
    },
  },
};

export class DeleteGroupPageComponent extends BaseTemplateDynamicComponent {
  constructor() {
    super("create-group-page-component", loadConfig);
  }

  getTemplate(): HTMLTemplateElement {
    return template;
  }

  override getSharedStyle(): string {
    return getSharedButtonStyles();
  }

  render(data: DeleteGroupData): string {
    return `
      <h1>Create board game group</h1>     
        ${
          data.isVisible
            ? `
              <form onsubmit="return false">
              
                <label for="group-name">Enter group name to confirm deleting</label>
                <input 
                  class="group-data-input"
                  id=${GROUP_NAME_INPUT}
                  name=${GROUP_NAME_INPUT}
                  type="text" 
                  value="Test"

                />
                <button type="submit" ${this.createClickEvent(DELETE_GROUP_EVENT_CONFIG)}>Confirm delete</button>
              </form> 
              <p id="delete-group-error-message">${data.errorMessage ? data.errorMessage.trim() : ""}</p>
              
              <p>${data.successMessage ? data.successMessage.trim() : ""}</p>

            `
            : `<p>Insufficient permissions to delete group </p>`
        }    
    `;
  }
}

if (!customElements.get("delete-group-page-component")) {
  customElements.define(
    "delete-group-page-component",
    DeleteGroupPageComponent,
  );
}
