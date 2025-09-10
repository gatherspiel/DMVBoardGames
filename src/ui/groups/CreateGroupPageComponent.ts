import {
  GROUP_DESCRIPTION_INPUT,
  GROUP_NAME_INPUT,
  GROUP_URL_INPUT,
} from "./Constants.ts";
import {generateButton} from "../../shared/components/ButtonGenerator.ts";
import {ApiActionTypes, ApiLoadAction} from "@bponnaluri/places-js";
import {generateErrorMessage} from "../../shared/components/StatusIndicators.ts";
import {
  IS_LOGGED_IN_KEY,
  SUCCESS_MESSAGE_KEY
} from "../../shared/Constants.ts";
import {BaseDynamicComponent} from "@bponnaluri/places-js";
import {LOGIN_STORE} from "../auth/data/LoginStore.ts";
import { API_ROOT } from "../../shared/Params.ts";

const templateStyle = `
  <link rel="stylesheet" type="text/css" href="/styles/sharedHtmlAndComponentStyles.css"/>

  <style>
    #group-description-input {
      height:500px;
      width: 800px;
      margin-bottom: 1rem;
    }
    #create-group-page-container {
      padding-left: 1rem;
    }
  </style>
`;

const loadConfig = [{
      componentReducer:(data:any)=>{
        return {
          name: "",
          description: "",
          url: "",
          [IS_LOGGED_IN_KEY]: data.loggedIn
        }
      },
      dataStore:LOGIN_STORE
    }];

const CREATE_GROUP_BUTTON_ID = "create-group-button-id";

export class CreateGroupPageComponent extends BaseDynamicComponent {
  constructor() {
    super(loadConfig);
  }

  getTemplateStyle(): string {
    return templateStyle;
  }

  override attachEventsToShadowRoot(shadowRoot:ShadowRoot){

    var self = this;
    shadowRoot?.getElementById('create-group-form')?.addEventListener('submit',(event:any)=>{
       event.preventDefault();

       const data = event.target.elements;

       const params = {
         id: self.componentStore.id,
         name: data[0].value,
         description: data[1].value,
         url: data[2].value
       }

      ApiLoadAction.getResponseData({
        body: JSON.stringify(params),
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
            [SUCCESS_MESSAGE_KEY]: "Successfully created group",
          });
        }
      })
     })
  }

  render(createGroupData: any): string {

    return `
      <div id="create-group-page-container">
        <h1>Create board game group</h1>
        
          ${
            createGroupData.loggedIn
              ? `
                <form id="create-group-form">
                
                  <label>Group name</label>
                  <input
                    name=${GROUP_NAME_INPUT}
                    />${createGroupData.name}
                  </input>
                  
                  <br>
                  <label>Group url</label>
                  <input
                    name=${GROUP_URL_INPUT}
                    />
                  ${createGroupData.url}
                  </input>
                  
            
                  <br>
                  <label>Group description</label>
                  <br>
                  <textarea
                    id=${GROUP_DESCRIPTION_INPUT}
                    name=${GROUP_DESCRIPTION_INPUT}
                    />${createGroupData.description}</textarea>
                  <br>
          
     
                 ${generateButton({
                  id: CREATE_GROUP_BUTTON_ID,
                  type:"submit",
                  text: "Create group"
                })}
             
                </form>
               
                <p class="${SUCCESS_MESSAGE_KEY}">${createGroupData?.[SUCCESS_MESSAGE_KEY]?.trim() ?? ""}</p>
                ${generateErrorMessage(createGroupData.errorMessage)}
              `
              : `<p>You must log in to create a group </p>`
          }    
     </div> 
     `;

  }
}


