
import {  ApiActionType,ApiLoadAction, BaseDynamicComponent } from "/lib/places-js-latest.js";
import {
  GROUP_DESCRIPTION_INPUT,
  GROUP_NAME_INPUT,
  GROUP_URL_INPUT,
} from "./Constants.js";
import { IS_LOGGED_IN_KEY, LOGIN_STORE } from "../../data/user/LoginStore.js";
import {
  generateErrorMessage,
  generateSuccessMessage,
} from "../../shared/html/StatusIndicators.js";

import {
  getGameTypeTagSelectHtml,
  getTagSelectedState,
} from "../../shared/html/SelectGenerator.js";
import { API_ROOT } from "../shared/Params.js";
import { FaqComponent } from "../static/FaqComponent.js";
import { ImageUploadComponent } from "../../shared/components/ImageUploadComponent.js";
import { SUCCESS_MESSAGE_KEY } from "../../shared/html/StatusIndicators.js";
import { SiteRulesComponent } from "../static/SiteRulesComponent.js";

customElements.define("faq-component", FaqComponent);
customElements.define("image-upload-component", ImageUploadComponent);
customElements.define("site-rules-component", SiteRulesComponent);

const AGREE_RULES_ID = "agree-rules-id";
const CREATE_GROUP_BUTTON_ID = "create-group-button-id";

const DESCRIPTION_ERROR_TEXT_KEY = "descriptionErrorText";
const NAME_ERROR_TEXT_KEY = "nameErrorText";

export class CreateGroupComponent extends BaseDynamicComponent {
  constructor() {
    super([
      {
        componentReducer: (data) => {
          return {
            name: "",
            description: "",
            url: "",
            [IS_LOGGED_IN_KEY]: data.loggedIn,
          };
        },
        dataStore: LOGIN_STORE,
      },
    ]);
   
    const self = this;

    this.addEventListener("click", (event) => {
      const targetId = event.target?.id;
      const elements = self.getRootNode().getElementById("create-group-form")?.elements;

      if (targetId === AGREE_RULES_ID) {
        self.updateData({
          [AGREE_RULES_ID]: event.target.checked,
          description: elements.namedItem(GROUP_DESCRIPTION_INPUT)?.value,
          gameTypeTags: getTagSelectedState(self.getRootNode()),
          imagePath: self.getRootNode()
            .getElementById("image-upload-ui")
            .getAttribute("image-path"),
          name: elements.namedItem(GROUP_NAME_INPUT)?.value,
          url: elements.namedItem(GROUP_URL_INPUT)?.value,
        });
      }

      if (targetId === CREATE_GROUP_BUTTON_ID) {
        event.preventDefault();

        const validationErrors = {};
        const groupName = elements.namedItem(GROUP_NAME_INPUT)?.value;
        if (!groupName || groupName.length === 0) {
          validationErrors[NAME_ERROR_TEXT_KEY] = "Name is a required field";
        }
        const groupDescription = elements.namedItem(
          GROUP_DESCRIPTION_INPUT,
        )?.value;
        if (!groupDescription || groupDescription.length === 0) {
          validationErrors[DESCRIPTION_ERROR_TEXT_KEY] =
            "Description is a required field";
        }
        if (Object.keys(validationErrors).length > 0) {
          self.updateData(validationErrors);
          return;
        }

        ApiLoadAction.getResponseData({
          body: JSON.stringify({
            id: self.componentStore.id,
            name: groupName,
            description: groupDescription,
            image: self.getRootNode()
              .getElementById("image-upload-ui")
              .getAttribute("image-path"),
            url: elements.namedItem(GROUP_URL_INPUT)?.value,
            gameTypeTags: Object.keys(getTagSelectedState(self.getRootNode())),
          }),
          method: ApiActionType.POST,
          url: API_ROOT + `/groups/`,
        }).then((data) => {
          if (data.errorMessage) {
            self.updateData({
              errorMessage: data.errorMessage,
              [DESCRIPTION_ERROR_TEXT_KEY]: "",
              [NAME_ERROR_TEXT_KEY]: "",
              [SUCCESS_MESSAGE_KEY]: "",
            });
          } else {
            self.updateData({
              errorMessage: "",
              [DESCRIPTION_ERROR_TEXT_KEY]: "",
              [NAME_ERROR_TEXT_KEY]: "",
              [SUCCESS_MESSAGE_KEY]: `
              Successfully created group. A site admin will review the group information before the group is visible on
              dmvboardgames.com. Email gulu@createthirdplaces.org if you have any questions or comments.
             `,
            });
          }
        });
      }
    });

  }
  

  render(data) {
    return `
      <div class="container-xl">
        <h1>Create group</h1>
        <form id="create-group-form" onsubmit="return false" style="${data.loggedIn ? `` : `display:none`}">
          <div id="form-status-div">
            ${generateSuccessMessage(data?.[SUCCESS_MESSAGE_KEY])}
            ${generateErrorMessage(data?.errorMessage)}           
          </div>
          <div class="form-section"> 
            <label class=" required-field">Name</label>
            <input
              id=${GROUP_NAME_INPUT}
              name=${GROUP_NAME_INPUT}
              value="${data.name}"
              >
              ${generateErrorMessage(data[NAME_ERROR_TEXT_KEY])}
          </div>  
          <div class="form-section">
            <label class=" required-field">Description</label>
            <textarea
              id=${GROUP_DESCRIPTION_INPUT}
              name=${GROUP_DESCRIPTION_INPUT}
              >${data.description}</textarea>
            ${generateErrorMessage(data[DESCRIPTION_ERROR_TEXT_KEY])}
          </div>    
          <div id="image-upload-container">
            <image-upload-component
              id="image-upload-ui"
              image-path="${data.imagePath}"
            ></image-upload-component>              
          </div>
          <div class="form-section">
            <label class="">Url(optional)</label>
            <input
              id=${GROUP_URL_INPUT}
              name=${GROUP_URL_INPUT}
              value=${data.url}
              >
          </div>
          ${getGameTypeTagSelectHtml(data.gameTypeTags)}
          <label class=" required-field" for="${AGREE_RULES_ID}">I agree to the site rules listed below</label>
          <input type="checkbox" id="${AGREE_RULES_ID}" ${data[AGREE_RULES_ID] ? "checked" : ""}>
          
          ${
            data[AGREE_RULES_ID]
              ? `<button class="primary" id=${CREATE_GROUP_BUTTON_ID}>Create group</button>`
              : `<button class="muted">Create group</button>`
          }
          <site-rules-component></site-rules-component>
          <faq-component></faq-component>
        </form>
         ${generateErrorMessage(data.errorMessage)}   
        <p style="${!data.loggedIn ? `` : `display:none`}">You must log in to create a group </p> 
     </div> 
     `;
  }
}
