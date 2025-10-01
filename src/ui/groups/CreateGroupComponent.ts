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
import { API_ROOT } from "../../shared/Params.ts";
import {getGameTypeTagSelectHtml, getTagSelectedState} from "../../shared/html/SelectGenerator.ts";
import {getSiteRulesHtml} from "../../shared/html/SiteRules.ts";

const AGREE_RULES_ID ="agree-rules-id";
const CREATE_GROUP_BUTTON_ID = "create-group-button-id";

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
        #game-type-tag-select input {
          display: inline-block;
        }      
        #game-type-tag-select label {
          padding-left: 0.25rem;
        }  
        #group-description-input {
          height:500px;
          margin-bottom: 1rem;
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
      if(targetId === AGREE_RULES_ID){
        self.updateData({
          [AGREE_RULES_ID]: event.target.checked,
        })
      }
    });

    shadowRoot?.getElementById('create-group-form')?.addEventListener('submit',(event:any)=>{
      event.preventDefault();

      const data = event.target.elements;

      ApiLoadAction.getResponseData({
        body: JSON.stringify({
          id: self.componentStore.id,
          name: (data.namedItem(GROUP_NAME_INPUT) as HTMLInputElement)?.value,
          description: (data.namedItem(GROUP_DESCRIPTION_INPUT) as HTMLInputElement)?.value,
          url: (data.namedItem(GROUP_URL_INPUT) as HTMLInputElement)?.value,
          gameTypeTags: getTagSelectedState(shadowRoot)
        }),
        method: ApiActionTypes.POST,
        url: API_ROOT + `/groups/`,
      }).then((data:any)=>{

        if (data.errorMessage) {
          self.updateData({
            errorMessage: data.errorMessage,
            [SUCCESS_MESSAGE_KEY]: "",
          });
        } else {
          self.updateData({
            errorMessage: "",
            [SUCCESS_MESSAGE_KEY]: `
              Successfully created group. A site admin will review the group information before the group is visible on
              dmvboardgames.com.
             
              Email gulu@createthirdplaces.com if you have any questions or comments on the process for creating groups.
             `,
          });
        }
      })
    });
  }

  render(data: any): string {
    return `
      <div id="create-group-container">
        <h1>Create board game group</h1>  
        ${
      data.loggedIn
            ? `
              ${generateSuccessMessage(data?.[SUCCESS_MESSAGE_KEY])}

              <form id="create-group-form" onsubmit="return false">  
                <label>Group name</label>
                <input
                  id=${GROUP_NAME_INPUT}
                  name=${GROUP_NAME_INPUT}
                  />${data.name}
                </input>
                
                <label>Group url</label>
                <input
                  id=${GROUP_URL_INPUT}
                  name=${GROUP_URL_INPUT}
                  />
                ${data.url}
                </input>
                
                <label>Group description</label>
                <textarea
                  id=${GROUP_DESCRIPTION_INPUT}
                  name=${GROUP_DESCRIPTION_INPUT}
                  />${data.description}
                </textarea>
                
                ${getGameTypeTagSelectHtml()}

                <div class="section-separator-medium"></div>
                
                <div id="rules-content">
                  <label for="${AGREE_RULES_ID}">I agree to the site rules listed below</label>
                  <input type="checkbox" id="${AGREE_RULES_ID}" ${data[AGREE_RULES_ID] ? 'checked' : ''}>
  
                  ${getSiteRulesHtml()}
                </div>
                ${data[AGREE_RULES_ID]  ? 
                  generateButton({
                    id: CREATE_GROUP_BUTTON_ID,
                    text: "Create group",
                    type:"submit",
                  }):
                  generateDisabledButton({
                    text:"Create group"
                  })}

              </form>
             
              ${generateErrorMessage(data.errorMessage)}
            `
            : `<p>You must log in to create a group </p>`
          }    
     </div> 
     `;
  }
}


