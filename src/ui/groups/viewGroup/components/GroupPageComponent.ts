import {
  GROUP_DESCRIPTION_INPUT, GROUP_DESCRIPTION_TEXT,
  GROUP_NAME_INPUT,
  GROUP_URL_INPUT,
} from "../../Constants.js";
import {GROUP_REQUEST_THUNK} from "../data/GroupRequestThunk.ts";

import {AbstractPageComponent, ApiActionTypes, serializeJSONProp} from "@bponnaluri/places-js";
import type { Event } from "../../../homepage/data/types/Event.ts";
import { BaseTemplateDynamicComponent } from "@bponnaluri/places-js";

import {
  generateButton,
  generateButtonForEditPermission,
  generateLinkButton
} from "../../../../shared/components/ButtonGenerator.ts";
import {
  SUCCESS_MESSAGE_KEY
} from "../../../../shared/Constants.ts";
import {CreateEventComponent} from "../../events/components/CreateEventComponent.ts";
import {DeleteGroupPageComponent} from "../../deleteGroup/DeleteGroupPageComponent.ts";
import {InternalApiAction} from "@bponnaluri/places-js";
import {API_ROOT} from "../../../../shared/Params.ts";

const template = `
  <link rel="stylesheet" type="text/css" href="/styles/sharedComponentStyles.css"/>

  <style>
     
    .${GROUP_DESCRIPTION_TEXT} {
      display: block;
      position: relative;
      padding: 0.5rem;
      border-radius: 12px;
      font-size: 1.5rem;
      color: var(--clr-dark-blue);
      background-color: #0AACFB;
      
      border: 10px solid pink;
      border-image-source: url(assets/meepleThree.png);
      border-image-slice: 10 10;
      border-image-repeat: round;
    }
    
    .group-data-input {
      height:24px;
      font-size:24px;
      display: block;
    }
        
    #${GROUP_NAME_INPUT} {
      width: 600px;
    }
    
    #${GROUP_URL_INPUT} {
      width: 600px;
    }
    
    #${GROUP_DESCRIPTION_INPUT} {
      height: 500px;
      width: 800px;
    }

    button {
      margin-top:0.5rem;
    }

    .group-webpage-link {
      display: inline-block;
    }
    #group-events {
      border-bottom:  20px solid;
      border-image-source: url(assets/Section_Border_Medium.png);
      border-image-slice: 20 20;
      border-image-repeat: round;
    }
    
    @media not screen and (width < 32em) {
      .${GROUP_DESCRIPTION_TEXT} {
        margin-top: 1rem;
      }
    }
    
    @media screen and (width < 32em) {
      h1 {
        margin: 0;    
      }
      .${GROUP_DESCRIPTION_TEXT} {
        padding: 0.5rem;
        margin-top: 1rem;
        font-size:1rem;
      }
      p {
        font-size:1rem;
      }
    }    
  </style>
  <div></div>
`;


const groupDataReducer = (groupData:any)=>{
  return {...groupData, [SUCCESS_MESSAGE_KEY]:''}
}

const loadConfig = [{
      dataThunk:GROUP_REQUEST_THUNK,
      componentReducer:groupDataReducer,
      urlParams:["name"]
    }]

const ADD_EVENT_BUTTON_ID = "add-event";
const CANCEL_UPDATES_BUTTON_ID = "cancel-updates";
const EDIT_GROUP_BUTTON_ID = "edit-group-button";
const DELETE_GROUP_BUTTON_ID = "delete-group"
const SAVE_UPDATES_BUTTON_ID = "save-updates";

export class GroupPageComponent extends BaseTemplateDynamicComponent {
  constructor() {
    super(loadConfig);
  }

  getTemplateStyle(): string {
    return template;
  }

  override attachEventsToShadowRoot(shadowRoot:ShadowRoot) {
    var self = this;
    shadowRoot?.addEventListener("click", function(event:any){
      event.preventDefault();

      try {
        const targetId = event.originalTarget?.id;
        if(targetId === EDIT_GROUP_BUTTON_ID) {
          self.updateData({
            isEditing: true,
          })
        }
        if(targetId === ADD_EVENT_BUTTON_ID){
          const params = {
            id: self.componentState.id,
            name:self.componentState.name,
          }
          AbstractPageComponent.updateRoute(CreateEventComponent, params)
        }
        if(targetId === DELETE_GROUP_BUTTON_ID){
          const params = {
            id: self.componentState.id,
            name:self.componentState.name,
          }
          AbstractPageComponent.updateRoute(DeleteGroupPageComponent,params)
        }
        if(targetId === CANCEL_UPDATES_BUTTON_ID) {
          self.updateData({
            isEditing: false
          })
        }
        if(targetId === SAVE_UPDATES_BUTTON_ID){
          const params = {
            id: self.componentState.id,
            name: (shadowRoot?.getElementById(GROUP_NAME_INPUT) as HTMLTextAreaElement)?.value,
            description: (shadowRoot?.getElementById(GROUP_DESCRIPTION_INPUT) as HTMLTextAreaElement)?.value,
            url: (shadowRoot?.getElementById(GROUP_URL_INPUT) as HTMLTextAreaElement)?.value
          }

          InternalApiAction.getResponseData({
            body: JSON.stringify(params),
            method: ApiActionTypes.PUT,
            url: API_ROOT + `/groups/?name=${encodeURIComponent(params.name)}`,
          }).then(()=>{

            self.updateData({...params,
              isEditing: false,
              [SUCCESS_MESSAGE_KEY]: 'Group update successful'
            });
          })
        }
      } catch(e:any){
        if(e.message !== `Permission denied to access property "id"`){
          throw e;
        }
      }
    })
  }

  render(groupData: any): string {
    if (!groupData.permissions) {
      return `<h1>Loading</h1>`;
    }
    return `

     <div class="ui-section">
     ${groupData[SUCCESS_MESSAGE_KEY] ? `<h2>Group update successful</h2>` : ``}
     ${
       !groupData.isEditing
         ? `<div class="group-title">
       <h1>
         ${generateLinkButton({
           class: "group-webpage-link",
           text: groupData.name,
           url:groupData.url
         })}
       </h1>

       ${generateButtonForEditPermission({
         component: this,
         id:EDIT_GROUP_BUTTON_ID,
         text: "Edit group info",
       })}
       
       ${generateButtonForEditPermission({
           component: this, 
           id: ADD_EVENT_BUTTON_ID,
           text: "Add event",
         })}
       
       ${generateButtonForEditPermission({
           component: this,
           id: DELETE_GROUP_BUTTON_ID,
           text: "Delete group",
         })}

       </div>
    
   
        <div class="${GROUP_DESCRIPTION_TEXT}">
          <p>${groupData.description}</p> 
        </div>
       ` 
         : `
      <h1>Editing group information</h1>
        
      <form>
        <label>Group name</label>
        <input
          id=${GROUP_NAME_INPUT}
          value="${groupData.name}"
          />
        <br>
          
        <label>Group description</label>
        <br>

        <textarea
          id=${GROUP_DESCRIPTION_INPUT}
          />${groupData.description}
        </textarea>        
        <br>
 
        <label>Group url</label>
        <input
          id=${GROUP_URL_INPUT}
          value=${groupData.url}
          />
        <br>       
         
         ${generateButton({
           id: SAVE_UPDATES_BUTTON_ID,
           text: "Save updates",
           type: "submit",
         })}
         
         ${generateButton({
           id: CANCEL_UPDATES_BUTTON_ID,
           text: "Cancel updates",
           type: "submit",
         })}    
        </form> 
      `
     }
    <h1 class="hideOnMobile">Upcoming events</h1>
      <div id="group-events">
      ${
        groupData.eventData.length === 0
          ? `<p id="no-event">Click on group link above for event information</p>`
          : `${groupData.eventData
              .map((event: Event) => {
                return `
              <group-page-event-component
                key = ${groupData.id + "event-" + event.id}
                data =${serializeJSONProp({groupId: groupData.id,...event})}
              >
 
              </group-page-event-component>

            `;
              })
              .join(" ")}
          <p>Only events for the next 30 days will be visible. See the group page for information on other events.</p>
          `
      }
      </div>
    `;
  }
}

if (!customElements.get("group-page-component")) {
  customElements.define("group-page-component", GroupPageComponent);
}
