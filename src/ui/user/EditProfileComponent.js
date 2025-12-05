import {
  ApiActionType,
  ApiLoadAction,
  BaseDynamicComponent,
} from "@bponnaluri/places-js";
import {
  SUCCESS_MESSAGE_KEY,
  generateErrorMessage,
  generateSuccessMessage,
} from "../../shared/html/StatusIndicators.js";

import { API_ROOT } from "../shared/Params.js";
import { ImageUploadComponent } from "../../shared/components/ImageUploadComponent.js";
import { USER_DATA_STORE } from "../../data/user/UserDataStore.js";

import { generateButton } from "../../shared/html/ButtonGenerator.js";

customElements.define("image-upload-component", ImageUploadComponent);

const UPDATE_USER_DATA_ID = "update-user-data";
const USERNAME_INPUT = "username-input";
const USERNAME_ERROR_TEXT_KEY = "username-error-text"; /**/

export class EditProfileComponent extends BaseDynamicComponent {
  constructor() {
    super([
      {
        dataStore: USER_DATA_STORE,
      },
    ]);
  }

  getTemplateStyle() {
    return `
      <link rel="stylesheet" type="text/css"  href="/styles/sharedHtmlAndComponentStyles.css"/>
      <style>
        form {
          margin-top:1rem;
        }
      </style>      
    `;
  }

  attachHandlersToShadowRoot(shadowRoot) {
    let self = this;
    shadowRoot.addEventListener("click", (event) => {
      const targetId = event.target?.id;

      if (targetId === UPDATE_USER_DATA_ID) {
        event.preventDefault();

        const validationErrors = {};
        const elements =
          shadowRoot.getElementById("update-user-form")?.elements;
        const imageForm = shadowRoot.getElementById("image-upload-ui");

        const username = elements.namedItem(USERNAME_INPUT)?.value;
        if (!username || username.length === 0) {
          validationErrors[USERNAME_ERROR_TEXT_KEY] =
            "Name is a required field";
        }
        if (Object.keys(validationErrors).length > 0) {
          self.updateData(validationErrors);
          return;
        }
        const formData = {
          username: username,
          image: imageForm.getImage(),
          imageFilePath: imageForm.getImageFilePath(),
        };
        ApiLoadAction.getResponseData({
          body: JSON.stringify(formData),
          method: ApiActionType.PUT,
          url: API_ROOT + "/user",
        }).then((response) => {
          if (response.errorMessage) {
            self.updateData({
              ...formData,
              errorMessage: response.errorMessage,
              [SUCCESS_MESSAGE_KEY]: "",
            });
          } else {
            self.updateData({
              ...formData,
              errorMessage: "",
              [SUCCESS_MESSAGE_KEY]: "Successfully updated user",
            });
          }
        });
      }
    });
  }

  render(data) {
    return `
      <h1>Edit profile</h1>
        <form id ="update-user-form" onsubmit="return false">
          <div class="form-section">
              ${generateSuccessMessage(data?.[SUCCESS_MESSAGE_KEY])}
              ${generateErrorMessage(data?.errorMessage)}      
            <label class=" required-field">Name</label>
              <input
                id=${USERNAME_INPUT}
                name=${USERNAME_INPUT}
                value="${data.username}"
              >
              ${generateErrorMessage(data[USERNAME_ERROR_TEXT_KEY])}
            </div>      
          </div>
          <div class ="form-section" id="image-upload">
            <image-upload-component
              id="image-upload-ui"
              image-path="${data.imageFilePath}"
            ></image-upload-component>
          </div>  
          
          ${generateButton({
            id: UPDATE_USER_DATA_ID,
            text: "Submit",
            type: "submit",
          })}
      </form>
    </div>
    `;
  }
}
