import { ApiLoadAction, PresentationComponent } from "/lib/places-js-latest.js";
import {
  SUCCESS_MESSAGE_KEY,
  generateErrorMessage,
  generateSuccessMessage,
} from "../../shared/html/StatusIndicators.js";

import { API_ROOT } from "/shared/Params.js";
import { GROUP_NAME_INPUT } from "./Constants.js";
import { LOGIN_STORE } from "../../data/user/LoginStore.js";

const CONFIRM_DELETE_BUTTON_ID = "confirm-delete-button";

import {DELETE_GROUP_STORE} from "/data/groups/DeleteGroupStore.js";

export class DeleteGroupComponent extends PresentationComponent {
  constructor() {
  
    super();
    const deleteGroup = ()=> { 
      const groupName = self
        .getRootNode()
        .getElementById(GROUP_NAME_INPUT)
        ?.value.trim();
      
      
      if (groupName !== DELETE_GROUP_STORE.getStoreData().existingGroupName) {
        DELETE_STORE_DATA.updateStoreData({
          name: groupName,
          errorMessage: "Group name not entered correctly",
        });
      } else {
        const id =
          new URLSearchParams(document.location.search).get("id") ?? "";
        const params = {
          method: "DELETE",
          url: `${API_ROOT}/groups/?id=${id}`,
        };

        ApiLoadAction.getResponseData(params).then((response) => {
          if (response.errorMessage) {
            this.updateStoreData({
              errorMessage: response.errorMessage,
              "successMessage": "",
            });
          } else {
            this.updateStoreData({
                errorMessage: "",
                "successMessage": "Successfully deleted group",
              });
            }
          });
        }
      }

    this.setClickEvents({
      "deleteGroup":deleteGroup
    });
    this.setStore(DELETE_GROUP_STORE);
  }

  //TODO: Make sure store is initialized with data from here
  /*DELETE_GROUP_STORE.updateStoreData({
    existingGroupName: groupName,
    isVisible: true,
  });*/

  render(data) {
    return `
      <div class="container-xl"> 
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
                value="${data.groupInput ?? ""}"
             />
           </div>
           <button id=${CONFIRM_DELETE_BUTTON_ID}>Confirm delete</button>
        </form>       
      </div> 
    `;
  }
}
