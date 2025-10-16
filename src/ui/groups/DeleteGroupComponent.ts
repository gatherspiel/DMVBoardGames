import {ApiActionTypes, BaseDynamicComponent, ApiLoadAction} from "@bponnaluri/places-js";
import { GROUP_NAME_INPUT } from "./Constants.ts";
import {generateButton} from "../../shared/html/ButtonGenerator.ts";
import {generateErrorMessage, generateSuccessMessage} from "../../shared/html/StatusIndicators.ts";
import {
  SUCCESS_MESSAGE_KEY
} from "../../shared/Constants.ts";

import {API_ROOT} from "../../shared/Params.ts";
import {LOGIN_STORE} from "../auth/data/LoginStore.ts";

const CONFIRM_DELETE_BUTTON_ID = "confirm-delete-button";

export class DeleteGroupComponent extends BaseDynamicComponent {
  constructor() {
    super([{
      dataStore: LOGIN_STORE
    }]);
  }

  getTemplateStyle(): string {
    return `
      <link rel="stylesheet" type="text/css" href="/styles/sharedHtmlAndComponentStyles.css"/>
      <style>
        #delete-group-error-message {
          color:darkred;
        }
        #group-name-input {
          display: block;
          margin-bottom: 1rem;
        }
        #openGroupEditPageButton {
          padding: 2rem;
        }
      </style>    
    `;
  }

  connectedCallback(){

    const groupName = (new URLSearchParams(document.location.search)).get("name") ?? ""
    document.title = `Delete group ${groupName}?`
    this.updateData({
      existingGroupName: groupName,
      isVisible: true,
    });
  }

  override attachHandlersToShadowRoot(shadowRoot?: any) {
    const self = this;
    shadowRoot?.addEventListener("click",(event:any)=>{

      if(event.target.id === CONFIRM_DELETE_BUTTON_ID) {
        const groupName: any = (shadowRoot.getElementById(GROUP_NAME_INPUT) as HTMLInputElement)?.value.trim();

        if (groupName !== this.componentStore.existingGroupName) {
          self.updateData({
            name: groupName,
            errorMessage: "Group name not entered correctly",
          });
        } else {

          const id = (new URLSearchParams(document.location.search)).get("id") ?? "";
          const params = {
            method: ApiActionTypes.DELETE,
            url: `${API_ROOT}/groups/?id=${id}`
          };

          ApiLoadAction.getResponseData(params).then((response: any) => {
            if (response.errorMessage) {
              self.updateData({
                errorMessage: response.errorMessage,
                [SUCCESS_MESSAGE_KEY]: "",
              });
            } else {
              self.updateData({
                errorMessage: "",
                [SUCCESS_MESSAGE_KEY]: "Successfully deleted group",
              });
            }
          })
        }
      }
    })
  }

  render(data: any): string {
    return `
      <h1>${document.title}</h1>
      <form onsubmit="return false">
        <div id="form-status-div">
          ${generateErrorMessage(data.errorMessage)}
          ${generateSuccessMessage(data[SUCCESS_MESSAGE_KEY])}      
        </div>
        
        <div class = "form-section">
          <label class="required-field">Enter group name to confirm deleting</label>
          <input
              id=${GROUP_NAME_INPUT}
              value="${data.groupInput ?? ''}"
           />
         </div>
         ${generateButton({
          id: CONFIRM_DELETE_BUTTON_ID,
          text: "Confirm delete"
        })}
      </form>       
    `;
  }
}


