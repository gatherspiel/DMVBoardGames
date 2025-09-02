import {ApiActionTypes, BaseDynamicComponent, ApiLoadAction} from "@bponnaluri/places-js";
import { GROUP_NAME_INPUT } from "./Constants.ts";
import {generateButton} from "../../shared/components/ButtonGenerator.ts";
import {generateErrorMessage} from "@bponnaluri/places-js";
import {
  SUCCESS_MESSAGE_KEY
} from "../../shared/Constants.ts";

import {API_ROOT} from "../../shared/Params.ts";
import {LOGIN_STORE} from "../auth/data/LoginStore.ts";

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

const loadConfig = [{
      dataStore: LOGIN_STORE
    }];


const CONFIRM_DELETE_BUTTON_ID = "confirm-delete-button";

export class DeleteGroupPageComponent extends BaseDynamicComponent {
  constructor() {
    super(loadConfig);
  }

  getTemplateStyle(): string {
    return template;
  }

  connectedCallback(){
    this.updateData({
      isVisible: true,
      existingGroupName: (new URLSearchParams(document.location.search)).get("name") ?? ""})
  }

  override attachEventHandlersToDom(shadowRoot?: any) {
    const self = this;
    shadowRoot?.getElementById(CONFIRM_DELETE_BUTTON_ID).addEventListener("click",()=>{
      const groupName:any = (shadowRoot.getElementById(GROUP_NAME_INPUT) as HTMLInputElement)?.value.trim();

      if(groupName !== this.componentState.existingGroupName){
        self.updateData({
          name:groupName,
          errorMessage: "Group name not entered correctly",
        });
      } else {

        const id = (new URLSearchParams(document.location.search)).get("groupId") ?? "";
        const params = {
          method: ApiActionTypes.DELETE,
          url: `${API_ROOT}/groups/?name=${encodeURIComponent(groupName)}&id=${id}`
        };

        ApiLoadAction.getResponseData(params).then((response:any)=>{
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
    })
  }

  render(data: any): string {

    console.log("Hi");
    return `
      <form onsubmit="return false">
      
      
      <label>Enter group name to confirm deleting</label>
      <input
          id=${GROUP_NAME_INPUT}
          value="${data.groupInput ?? ''}"
       />
      <br>

         ${generateButton({
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
