import {
  GROUP_DESCRIPTION_INPUT,
  GROUP_NAME_INPUT,
  GROUP_URL_INPUT,
} from "./Constants.ts";
import {generateButton} from "../../shared/components/ButtonGenerator.ts";
import {ApiActionTypes, ApiLoadAction} from "@bponnaluri/places-js";
import {generateErrorMessage, generateSuccessMessage} from "../../shared/components/StatusIndicators.ts";
import {
  IS_LOGGED_IN_KEY,
  SUCCESS_MESSAGE_KEY
} from "../../shared/Constants.ts";
import {BaseDynamicComponent} from "@bponnaluri/places-js";
import {LOGIN_STORE} from "../auth/data/LoginStore.ts";
import { API_ROOT } from "../../shared/Params.ts";
import {getGameTypeTagSelectHtml, getTagSelectedState} from "../../shared/components/SelectGenerator.ts";


const CREATE_GROUP_BUTTON_ID = "create-group-button-id";

export class CreateGroupPageComponent extends BaseDynamicComponent {
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
  
        #${GROUP_NAME_INPUT},#${GROUP_DESCRIPTION_INPUT},#${GROUP_URL_INPUT} {
          display: block;
        }
        #create-group-page-container {
          padding-left: 1rem;
        }
        #group-description-input {
          height:500px;
          margin-bottom: 1rem;
        }
        
        #game-type-tag-select input {
          display: inline-block;
        }
        
        #game-type-tag-select {
          margin-bottom:1rem;
        }
        
        #game-type-tag-select label {
          padding-left: 0.25rem;
        }
        
        .label-border-left {
          border-left: 1px solid black;
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

  render(createGroupData: any): string {
    return `
      <div id="create-group-page-container">
        <h1>Create board game group</h1>
        
          ${
            createGroupData.loggedIn
              ? `

                ${generateSuccessMessage(createGroupData?.[SUCCESS_MESSAGE_KEY])}

                <form id="create-group-form" onsubmit="return false">
                
                  <label>Group name</label>
                  <input
                    id=${GROUP_NAME_INPUT}
                    name=${GROUP_NAME_INPUT}
                    />${createGroupData.name}
                  </input>
                  
                  <label>Group url</label>
                  <input
                    id=${GROUP_URL_INPUT}
                    name=${GROUP_URL_INPUT}
                    />
                  ${createGroupData.url}
                  </input>
                  
                  <label>Group description</label>
                  <textarea
                    id=${GROUP_DESCRIPTION_INPUT}
                    name=${GROUP_DESCRIPTION_INPUT}
                    />${createGroupData.description}
                  </textarea>
                  
                  ${getGameTypeTagSelectHtml()}

                 ${generateButton({
                  id: CREATE_GROUP_BUTTON_ID,
                  type:"submit",
                  text: "Create group"
                })}
             
                </form>
               
                ${generateErrorMessage(createGroupData.errorMessage)}
              `
              : `<p>You must log in to create a group </p>`
          }    
     </div> 
     `;

  }
}


