import {ApiActionTypes, BaseTemplateDynamicComponent, InternalApiAction} from "@bponnaluri/places-js";
import { GROUP_NAME_INPUT } from "../Constants.ts";
import {getUrlParameter} from "@bponnaluri/places-js";
import {generateButton} from "../../../shared/components/ButtonGenerator.ts";
import {generateErrorMessage} from "@bponnaluri/places-js";
import {
  COMPONENT_LABEL_KEY,
  IS_LOGGED_IN_KEY,
  SUCCESS_MESSAGE_KEY
} from "../../../shared/Constants.ts";
import {
  DEFAULT_GLOBAL_STATE_REDUCER_KEY,
  GLOBAL_FIELD_SUBSCRIPTIONS_KEY,
  GLOBAL_STATE_LOAD_CONFIG_KEY,
} from "@bponnaluri/places-js";
import {API_ROOT} from "../../../shared/Params.ts";

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


const CONFIRM_DELETE_BUTTON_ID = "confirm-delete-button";

export class DeleteGroupPageComponent extends BaseTemplateDynamicComponent {
  constructor() {
    super(loadConfig);
  }

  getTemplateStyle(): string {
    return template;
  }

  retrieveAndValidateFormInputs() {

    const name = this.getFormValue(GROUP_NAME_INPUT);
    const id = getUrlParameter("groupId");

    if(name !== this.componentState.existingGroupName){
      return {
        errorMessage: "Group name not entered correctly",
      };
    }

    return {
      groupInput: name,
      id: id
    }
  }

  connectedCallback(){
    this.retrieveData({isVisible: true, existingGroupName: getUrlParameter("name")})
  }

  override attachEventHandlersToDom(shadowRoot?: any) {
    const self = this;
    shadowRoot?.getElementById(CONFIRM_DELETE_BUTTON_ID).addEventListener("click",()=>{
      const formInputs:any = self.retrieveAndValidateFormInputs();
      if(formInputs.errorMessage){
        self.retrieveData(formInputs);
      } else {

        const params = {
          method: ApiActionTypes.DELETE,
          url: `${API_ROOT}/groups/?name=${encodeURIComponent(formInputs.groupInput)}&id=${formInputs.id}`
        };

        InternalApiAction.getResponseData(params).then((response:any)=>{
          if (response.errorMessage) {
            self.retrieveData({
              errorMessage: response.errorMessage,
              [SUCCESS_MESSAGE_KEY]: "",
            });
          } else {
            self.retrieveData({
              errorMessage: "",
              [SUCCESS_MESSAGE_KEY]: "Successfully deleted group",
            });
          }
        })
      }
    })
  }

  render(data: any): string {
    return `
      <form onsubmit="return false">
        ${this.addShortInput({
          id: GROUP_NAME_INPUT,
          [COMPONENT_LABEL_KEY]: "Enter group name to confirm deleting",
          inputType: "text",
          value: data.groupInput ?? ''
        })} 
         ${generateButton({
          component: this,
          id: CONFIRM_DELETE_BUTTON_ID,
          text: "Confirm delete"
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
