import {
  ApiActionTypes,
  ApiLoadAction,
  BaseDynamicComponent,
} from "@bponnaluri/places-js";
import {API_ROOT} from "../Params";
import {generateErrorMessage, generateSuccessMessage} from "./StatusIndicators";
import {generateButton} from "./ButtonGenerator";

import {ImageUploadComponent} from "./ImageUploadComponent";
import {SUCCESS_MESSAGE_KEY} from "../Constants";
import {USER_DATA_STORE} from "../../ui/auth/data/UserDataStore";
customElements.define('image-upload-component', ImageUploadComponent);

const UPDATE_USER_DATA_ID = "update-user-data";
const USERNAME_INPUT = "username-input";
const USERNAME_ERROR_TEXT_KEY = "username-error-text";/**/

export class EditProfileComponent extends BaseDynamicComponent {
  constructor() {
    super([
      {
        dataStore: USER_DATA_STORE,
      }]);
  }
  override getTemplateStyle():string {
    return `
      <link rel="stylesheet" type="text/css"  href="/styles/sharedHtmlAndComponentStyles.css"/>
      <style>
        form {
          margin-top:1rem;
        }
      </style>      
    `
  }

  override attachHandlersToShadowRoot(shadowRoot:ShadowRoot){

    let self = this;
    shadowRoot?.addEventListener("click",(event:any)=>{
      const targetId = event.target?.id;

      if(targetId === UPDATE_USER_DATA_ID){
        event.preventDefault();

        const validationErrors:Record<string,string> = {}
        const elements = (shadowRoot?.getElementById('update-user-form') as HTMLFormElement)?.elements
        const imageForm = shadowRoot.getElementById("image-upload-ui") as ImageUploadComponent;

        const username = (elements.namedItem(USERNAME_INPUT) as HTMLInputElement)?.value;
        if(!username || username.length === 0){
          validationErrors[USERNAME_ERROR_TEXT_KEY] = "Name is a required field"
        }
        if(Object.keys(validationErrors).length >0){
          self.updateData(validationErrors);
          return;
        }

        const formData = {
          username: username,
          image: imageForm.getImage(),
          imageFilePath: imageForm.getImageFilePath()
        }
        ApiLoadAction.getResponseData({
          body: JSON.stringify(formData),
          method: ApiActionTypes.PUT,
          url: API_ROOT + "/user",
        }).then((response:any)=>{
          if(response.errorMessage){
            self.updateData({
              ...formData,
              errorMessage: response.errorMessage,
              [SUCCESS_MESSAGE_KEY]: ''
            })
          } else {
            self.updateData({
              ...formData,
              errorMessage: '',
              [SUCCESS_MESSAGE_KEY]: "Successfully updated user"
            })
          }
        })
      }
    })
  }

  render(data:any){
    console.log(data)
    return `
      <h1>Edit profile</h1>
        <form id ="update-user-form" onsubmit="return false">
          <div class="form-section">
              ${generateSuccessMessage(data?.[SUCCESS_MESSAGE_KEY])}
              ${generateErrorMessage(data?.errorMessage)}      
            <label class="form-field-header required-field">Name</label>
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
            type:"submit",
          })}
      </form>
    </div>
    `
  }

}