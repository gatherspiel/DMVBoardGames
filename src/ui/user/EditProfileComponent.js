import { ApiLoadAction, PresentationComponent } from "/lib/places-js-latest.js";

import { API_ROOT } from "/shared/Params.js";
import { ImageUploadComponent } from "../../shared/components/ImageUploadComponent.js";
import { USER_DATA_STORE } from "../../data/user/UserDataStore.js";
import {EDIT_PROFILE_STORE} from "/data/user/EditProfileStore.js";

customElements.define("image-upload-component", ImageUploadComponent);

export class EditProfileComponent extends PresentationComponent {
  constructor() {
    super();

    const updateUserProfile = ()=> {

      const validationErrors = {};
      const elements = this
        .getRootNode()
        .getElementById("update-user-form")?.elements;
      
      const imageForm = this.getRootNode().getElementById("image-upload-ui");

      const username = elements.namedItem("username-input")?.value;
      if (!username || username.length === 0) {
        EDIT_PROFILE_STORE.updateStoreData({
          "username-error-text":"Name is a required field"
        });
        return;
      }

      const formData = {
        username: username,
        image: imageForm.getImage(),
        imageFilePath: imageForm.getImageFilePath(),
      };
      ApiLoadAction.getResponseData({
        body: JSON.stringify(formData),
        method: "PUT",
        url: API_ROOT + "/user",
      }).then((response) => {
        if (response.errorMessage) {
          EDIT_PROFILE_STORE.updateStoreData({
            errorMessage: response.errorMessage,
            successMessage: ""
          });
        } else {
          console.log("Hi");
          EDIT_PROFILE_STORE.updateStoreData({
            errorMessage: "",
            successMessage: "Successfully updated user"
          });
        }
      });
    }

    this.setClickEvents({
			"updateUserProfile":updateUserProfile
		});

		this.setStore(EDIT_PROFILE_STORE);

  }
 
}
