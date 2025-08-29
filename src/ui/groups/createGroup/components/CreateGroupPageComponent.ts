import {
  GROUP_DESCRIPTION_INPUT,
  GROUP_NAME_INPUT,
  GROUP_URL_INPUT,
} from "../../Constants.ts";
import {generateButton} from "../../../../shared/components/ButtonGenerator.ts";
import {ApiActionTypes, generateErrorMessage, InternalApiAction} from "@bponnaluri/places-js";
import {
  COMPONENT_LABEL_KEY,
  IS_LOGGED_IN_KEY,
  SUCCESS_MESSAGE_KEY
} from "../../../../shared/Constants.ts";
import {BaseTemplateDynamicComponent} from "@bponnaluri/places-js";
import {LOGIN_THUNK} from "../../../auth/data/LoginThunk.ts";
import {API_ROOT} from "../../../../shared/Params.ts";

const templateStyle = `
  <link rel="stylesheet" type="text/css" href="/styles/sharedComponentStyles.css"/>

  <style>
    #group-description-input {
      height:500px;
      width: 800px;
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
      dataThunk:LOGIN_THUNK
    }];

const CREATE_GROUP_BUTTON_ID = "create-group-button-id";

export class CreateGroupPageComponent extends BaseTemplateDynamicComponent {
  constructor() {
    super(loadConfig);
  }

  getTemplateStyle(): string {
    return templateStyle;
  }

  connectedCallback(){

    const self = this;
    this.addEventListener("click", (event:any)=>{
      event.preventDefault();

      try {
        if(event.originalTarget.id === CREATE_GROUP_BUTTON_ID) {
          const params = {
            id: self.componentState.id,
            name: self.getFormValue(GROUP_NAME_INPUT),
            description: self.getFormValue(GROUP_DESCRIPTION_INPUT),
            url: self.getFormValue(GROUP_URL_INPUT)
          }

          InternalApiAction.getResponseData({
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
        }
      } catch(e:any){
        if(e.message !== `Permission denied to access property "id"`){
          throw e;
        }
      }
    });
  }

  render(createGroupData: any): string {

    return `
      <div id="create-group-page-container">
        <h1>Create board game group</h1>
        
          ${
            createGroupData.isLoggedIn
              ? `
                <form onsubmit="return false">
                
                 ${this.addShortInput({
                  id: GROUP_NAME_INPUT,
                  [COMPONENT_LABEL_KEY]: "Group Name",
                  inputType: "text",
                  value: createGroupData.name ?? ''
                })}   
                <br>
                
                ${this.addShortInput({
                  id: GROUP_URL_INPUT,
                  [COMPONENT_LABEL_KEY]: "Group URL",
                  inputType: "text",
                  value: createGroupData.url ?? ''
                })}   
                <br>
                
                ${this.addTextInput({
                  id: GROUP_DESCRIPTION_INPUT,
                  [COMPONENT_LABEL_KEY]: "Group Description",
                  inputType: "text",
                  value: createGroupData.description ?? ''
                })}   
                <br>
                
                 ${generateButton({
                  component: this,
                  id: CREATE_GROUP_BUTTON_ID,
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

if (!customElements.get("create-group-page-component")) {
  customElements.define(
    "create-group-page-component",
    CreateGroupPageComponent,
  );
}
