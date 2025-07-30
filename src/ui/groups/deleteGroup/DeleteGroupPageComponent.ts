import { BaseTemplateDynamicComponent } from "../../../framework/components/BaseTemplateDynamicComponent.ts";
import { GROUP_NAME_INPUT } from "../Constants.ts";
import { DELETE_GROUP_EVENT_CONFIG } from "./DeleteGroupPageHandlers.ts";
import type { DeleteGroupData } from "./types/DeleteGroupData.ts";
import {getUrlParameter} from "../../../framework/utils/UrlParamUtils.ts";
import {DELETE_GROUP_REQUEST_THUNK} from "./DeleteGroupRequestThunk.ts";
import {generateButton} from "../../../shared/components/ButtonGenerator.ts";
import {generateErrorMessage} from "../../../framework/components/utils/StatusIndicators.ts";

const template = `
  <link rel="stylesheet" type="text/css" href="/styles/sharedComponentStyles.css"/>

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
        console.log(data)
        if (data.errorMessage) {
          return {
            errorMessage: data.errorMessage,
            successMessage: "",
          };
        } else {
          return {
            errorMessage: "",
            successMessage: "Successfully deleted group",
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
        existingGroupName: getUrlParameter("name")
      };
    },
  },
};

export class DeleteGroupPageComponent extends BaseTemplateDynamicComponent {
  constructor() {
    super("delete-group-page-component", loadConfig);
  }

  getTemplateStyle(): string {
    return template;
  }

  connectedCallback(){
    this.updateStore({isVisible: true, existingGroupName: getUrlParameter("name")})
  }

  render(data: DeleteGroupData): string {
    return `
      <form onsubmit="return false">
        ${this.generateInputFormItem({
          id: GROUP_NAME_INPUT,
          componentLabel: "Enter group name to confirm deleting",
          inputType: "text",
          value: "Test"
        })} 
         ${generateButton({
          text: "Confirm delete",
          component: this,
          eventHandlerConfig: DELETE_GROUP_EVENT_CONFIG,
        })}
      </form> 
      ${generateErrorMessage(data.errorMessage)}
      
      <p>${data?.successMessage?.trim() ?? ""}</p>   
    `;
  }
}

if (!customElements.get("delete-group-page-component")) {
  customElements.define(
    "delete-group-page-component",
    DeleteGroupPageComponent,
  );
}
