import { BaseTemplateDynamicComponent } from "../../../framework/components/BaseTemplateDynamicComponent.ts";
import { GROUP_NAME_INPUT } from "../Constants.ts";
import { DELETE_GROUP_EVENT_CONFIG } from "./DeleteGroupPageHandlers.ts";
import type { DeleteGroupData } from "./types/DeleteGroupData.ts";
import {getUrlParameter} from "../../../framework/utils/UrlParamUtils.ts";
import {DELETE_GROUP_REQUEST_THUNK} from "./DeleteGroupRequestThunk.ts";
import {generateButton} from "../../../shared/components/ButtonGenerator.ts";
import {generateErrorMessage} from "../../../framework/components/utils/StatusIndicators.ts";
import {
  COMPONENT_LABEL_KEY,
  EVENT_HANDLER_CONFIG_KEY,
  IS_LOGGED_IN_KEY,
  SUCCESS_MESSAGE_KEY
} from "../../../shared/Constants.ts";
import {
  DEFAULT_GLOBAL_STATE_REDUCER_KEY,
  GLOBAL_FIELD_SUBSCRIPTIONS_KEY,
  GLOBAL_STATE_LOAD_CONFIG_KEY,
  REQUEST_THUNK_REDUCERS_KEY
} from "../../../framework/components/types/ComponentLoadConfig.ts";

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
  [REQUEST_THUNK_REDUCERS_KEY]: [
    {
      thunk: DELETE_GROUP_REQUEST_THUNK,
      componentReducer:  (data: any) => {
        if (data.errorMessage) {
          return {
            errorMessage: data.errorMessage,
            [SUCCESS_MESSAGE_KEY]: "",
          };
        } else {
          return {
            errorMessage: "",
            [SUCCESS_MESSAGE_KEY]: "Successfully deleted group",
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
    this.updateWithDefaultReducer({isVisible: true, existingGroupName: getUrlParameter("name")})
  }

  render(data: DeleteGroupData): string {
    return `
      <form onsubmit="return false">
        ${this.addShortInput({
          id: GROUP_NAME_INPUT,
          [COMPONENT_LABEL_KEY]: "Enter group name to confirm deleting",
          inputType: "text",
          value: "Test"
        })} 
         ${generateButton({
          text: "Confirm delete",
          component: this,
          [EVENT_HANDLER_CONFIG_KEY]: DELETE_GROUP_EVENT_CONFIG,
        })}
      </form> 
      ${generateErrorMessage(data.errorMessage)}
      
      <p class="${SUCCESS_MESSAGE_KEY}">${data?.[SUCCESS_MESSAGE_KEY]?.trim() ?? ""}</p>   
    `;
  }
}

if (!customElements.get("delete-group-page-component")) {
  customElements.define(
    "delete-group-page-component",
    DeleteGroupPageComponent,
  );
}
