import {
  GROUP_DESCRIPTION_INPUT,
  GROUP_NAME_INPUT,
  GROUP_URL_INPUT,
} from "./Constants.ts";
import {generateButton, generateDisabledButton} from "../../shared/html/ButtonGenerator.ts";
import {ApiActionTypes, ApiLoadAction} from "@bponnaluri/places-js";
import {generateErrorMessage, generateSuccessMessage} from "../../shared/html/StatusIndicators.ts";
import {
  IS_LOGGED_IN_KEY,
  SUCCESS_MESSAGE_KEY
} from "../../shared/Constants.ts";
import {BaseDynamicComponent} from "@bponnaluri/places-js";
import {LOGIN_STORE} from "../auth/data/LoginStore.ts";
import {API_ROOT} from "../../shared/Params.ts";
import {getGameTypeTagSelectHtml, getTagSelectedState} from "../../shared/html/SelectGenerator.ts";

import {FaqComponent} from "../../shared/html/FaqComponent.ts";
import {ImageUploadComponent} from "../../shared/html/ImageUploadComponent.ts";
import {SiteRulesComponent} from "../../shared/html/SiteRulesComponent.ts";

customElements.define('faq-component',FaqComponent)
customElements.define('image-upload-component',ImageUploadComponent)
customElements.define('site-rules-component',SiteRulesComponent)

const AGREE_RULES_ID ="agree-rules-id";
const CREATE_GROUP_BUTTON_ID = "create-group-button-id";

const DESCRIPTION_ERROR_TEXT_KEY = "descriptionErrorText";
const NAME_ERROR_TEXT_KEY = "nameErrorText";

export class CreateGroupComponent extends BaseDynamicComponent {
  constructor() {
    super([{
      componentReducer:(data:any)=>{
        return {
          name: "",
          description: "",
          url: "",
          [IS_LOGGED_IN_KEY]: data.loggedIn
        }
      },
      dataStore:LOGIN_STORE
    }]);
  }

  getTemplateStyle(): string {
    return `
      <link rel="stylesheet" type="text/css" href="/styles/sharedHtmlAndComponentStyles.css"/>
      <style>
        button {
          display: block;

        }
        #${GROUP_NAME_INPUT},#${GROUP_DESCRIPTION_INPUT},#${GROUP_URL_INPUT} {
          display: block;
        } 
        #create-group-container {
          padding-left: 1rem;
        }
        #game-type-tag-select {
          margin-bottom:1rem;
        }  
        #image-upload-container {
          margin-bottom: 1rem;
        }
        #game-type-tag-select input {
          display: inline-block;
        }      
        #game-type-tag-select label {
          padding-left: 0.25rem;
        }  
        #group-description-input {
          height: 10rem;
          width: 50rem;
        }   
        #rules-content {
          margin-top:1rem;
        }
        .raised {
          margin-top:0.5rem;
        }
        @media not screen and (width < 32em) {
          #group-description-input {
             width: 800px; 
          }
        }
        @media screen and (width < 32em) {
          #group-description-input {
            width:330px;
          }
        }
      </style>
    `;
  }


  override attachHandlersToShadowRoot(shadowRoot:ShadowRoot){

    const self = this;

    shadowRoot?.addEventListener("click",(event:any)=>{

      const targetId = event.target?.id;
      const elements = (shadowRoot?.getElementById('create-group-form') as HTMLFormElement)?.elements

      if(targetId === AGREE_RULES_ID){

        self.updateData({
          [AGREE_RULES_ID]: event.target.checked,
          description: (elements.namedItem(GROUP_DESCRIPTION_INPUT) as HTMLInputElement)?.value,
          gameTypeTags: getTagSelectedState(shadowRoot),
          imagePath: (shadowRoot.getElementById("image-upload-ui") as ImageUploadComponent).getAttribute("image-path"),
          name: (elements.namedItem(GROUP_NAME_INPUT) as HTMLInputElement)?.value,
          url: (elements.namedItem(GROUP_URL_INPUT) as HTMLInputElement)?.value,
        })
      }

      if(targetId === CREATE_GROUP_BUTTON_ID){
        event.preventDefault();

        const validationErrors:Record<string,string> = {}
        const groupName = (elements.namedItem(GROUP_NAME_INPUT) as HTMLInputElement)?.value;
        if(!groupName || groupName.length === 0){
          validationErrors[NAME_ERROR_TEXT_KEY] = "Name is a required field"
        }
        const groupDescription = (elements.namedItem(GROUP_DESCRIPTION_INPUT) as HTMLInputElement)?.value;
        if(!groupDescription || groupDescription.length === 0){
          validationErrors[DESCRIPTION_ERROR_TEXT_KEY]="Description is a required field"
        }
        if(Object.keys(validationErrors).length >0){
          self.updateData(validationErrors);
          return;
        }

        ApiLoadAction.getResponseData({
          body: JSON.stringify({
            id: self.componentStore.id,
            name: groupName,
            description: groupDescription,
            image: (shadowRoot.getElementById("image-upload-ui") as ImageUploadComponent).getAttribute("image-path"),
            url: (elements.namedItem(GROUP_URL_INPUT) as HTMLInputElement)?.value,
            gameTypeTags: Object.keys(getTagSelectedState(shadowRoot))
          }),
          method: ApiActionTypes.POST,
          url: API_ROOT + `/groups/`,
        }).then((data:any)=>{

          if (data.errorMessage) {
            self.updateData({
              errorMessage: data.errorMessage,
              [DESCRIPTION_ERROR_TEXT_KEY]: '',
              [NAME_ERROR_TEXT_KEY]: '',
              [SUCCESS_MESSAGE_KEY]: "",
            });
          } else {
            self.updateData({
              errorMessage: "",
              [DESCRIPTION_ERROR_TEXT_KEY]: '',
              [NAME_ERROR_TEXT_KEY]: '',
              [SUCCESS_MESSAGE_KEY]: `
              Successfully created group. A site admin will review the group information before the group is visible on
              dmvboardgames.com. Email gulu@createthirdplaces.com if you have any questions or comments.
             `,
            });
          }
        })
      }
    });
  }

  render(data: any): string {
    return `
      <div id="create-group-container">
        <h1>Create group</h1>
        <div class="section-separator-small"></div>  
        ${
            data.loggedIn
            ? `
              <form id="create-group-form" onsubmit="return false">
                <div id="form-status-div">
                  ${generateSuccessMessage(data?.[SUCCESS_MESSAGE_KEY])}
                  ${generateErrorMessage(data?.errorMessage)}           
                </div>
                <div class="form-section"> 
                  <label class="form-field-header required-field">Name</label>
                  <input
                    id=${GROUP_NAME_INPUT}
                    name=${GROUP_NAME_INPUT}
                    value="${data.name}"
                    >
                    ${generateErrorMessage(data[NAME_ERROR_TEXT_KEY])}
                </div>  
                <div class="form-section">
                  <label class="form-field-header required-field">Description</label>
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
                  <label class="form-field-header">Url(optional)</label>
                  <input
                    id=${GROUP_URL_INPUT}
                    name=${GROUP_URL_INPUT}
                    value=${data.url}
                    >
                </div>
                ${getGameTypeTagSelectHtml(data.gameTypeTags)}
                <label class="form-field-header required-field" for="${AGREE_RULES_ID}">I agree to the site rules listed below</label>
                <input type="checkbox" id="${AGREE_RULES_ID}" ${data[AGREE_RULES_ID] ? 'checked' : ''}>
                
                ${data[AGREE_RULES_ID]  ? 
                  generateButton({
                    id: CREATE_GROUP_BUTTON_ID,
                    text: "Create group",
                    type:"submit",
                  }):
                  generateDisabledButton({
                    text:"Create group"
                  })}
                <div class="section-separator-medium"></div>
                <site-rules-component></site-rules-component>
                <faq-component></faq-component>
              </form>
              ${generateErrorMessage(data.errorMessage)}
            `
            : `<p>You must log in to create a group </p>`
          }    
     </div> 
     `;
  }
}


