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

    const groupName = new URLSearchParams(document.location.search).get("name");
    const groupId =
          new URLSearchParams(document.location.search).get("id") ?? "";


    const deleteGroup = ()=> { 
      const enteredName = this
        .getRootNode()
        .getElementById("group-name-input")
        ?.value.trim();
       
      console.log(groupName+":"+enteredName);
      if (groupName !== enteredName) {
        DELETE_GROUP_STORE.updateStoreData({
          errorMessage: "Group name not entered correctly",
        });
      } else {
          
        const params = {
          method: "DELETE",
          url: `${API_ROOT}/groups/?id=${groupId}`,
        };
        
        ApiLoadAction.getResponseData(params).then((response) => {
          if (response.errorMessage) {
            DELETE_GROUP_STORE.updateStoreData({
              errorMessage: response.errorMessage,
              "successMessage": "",
            });
          } else {
            DELETE_GROUP_STORE.updateStoreData({
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
 
}
