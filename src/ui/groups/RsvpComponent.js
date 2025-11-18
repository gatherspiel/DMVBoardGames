import {ApiActionType, ApiLoadAction, BaseDynamicComponent} from "@bponnaluri/places-js";
import {API_ROOT} from "../shared/Params.js";
import {
  ERROR_MESSAGE_KEY,
  generateErrorMessage,
  generateSuccessMessage,
  SUCCESS_MESSAGE_KEY
} from "../../shared/html/StatusIndicators.js";

export class RsvpComponent extends BaseDynamicComponent {

  #rsvpUrl;
  constructor() {
    super([]);

    const eventId = parseInt(this.getAttribute("event-id") ?? '0');
    this.#rsvpUrl =   `/groups/events/${eventId}/rsvp`

  }

  connectedCallback(){
    this.updateData({
      rsvpCount:parseInt(this.getAttribute('rsvp-count') ?? '0'),
      userHasRsvp:this.getAttribute("current-user-rsvp") === "true"
    })
  }

  getTemplateStyle() {
    return `
      <link rel="stylesheet" type="text/css" href="/styles/sharedHtmlAndComponentStyles.css"/>

      <style>
      </style>
    `
  }

  attachHandlersToShadowRoot(shadowRoot){

    const self = this;

    shadowRoot.addEventListener("click",(event)=>{
      if(event.target.className == "front"){

        if(!self.componentStore.userHasRsvp){

          ApiLoadAction.getResponseData({
            method: ApiActionType.POST,
            url: API_ROOT + this.#rsvpUrl
          }).then((response)=>{
            if(response.errorMessage){
              self.updateData({
                [ERROR_MESSAGE_KEY]: "Failed RSVP:"+response.errorMessage,
                [SUCCESS_MESSAGE_KEY]: '',
              })
            } else {
              self.updateData({
                [ERROR_MESSAGE_KEY]: '',
                [SUCCESS_MESSAGE_KEY]: "RSVP successful",
                rsvpCount: self.componentStore.rsvpCount + 1,
                userHasRsvp: true
              })
            }
          })
        }else {
          ApiLoadAction.getResponseData({
            method: ApiActionType.DELETE,
            url: API_ROOT + this.#rsvpUrl
          }).then((response)=>{
            if(response.errorMessage){
              self.updateData({
                [ERROR_MESSAGE_KEY]: "Failed to cancel RSVP:"+response.errorMessage,
                [SUCCESS_MESSAGE_KEY]: ''
              })
            } else {
              self.updateData({
                [ERROR_MESSAGE_KEY]: '',
                [SUCCESS_MESSAGE_KEY]: "RSVP cancelled",
                rsvpCount: self.componentStore.rsvpCount - 1,
                userHasRsvp: false
              })
            }
          })
        }
      }
    })
  }

  render(data){
    let rsvpStr = ``;
    if(data.rsvpCount && data.rsvpCount !== 0){
      rsvpStr = data.rsvpCount === 1 ?
        `1 RSVP` :
        `${data.rsvpCount} RSVPs`
    }

    const rsvpButtonText =
      data.userHasRsvp ? "Cancel RSVP" : "RSVP";
    return `

     ${this.getAttribute("user-can-update-rsvp") !== "false"  ? `<button 
        class="raised activeHover"
      >  
        <span class="edge"></span>
        <span class="front">${rsvpButtonText}</span>   
      </button>` : ``}
      
      <p>${rsvpStr}</p>
      ${generateErrorMessage(data.errorMessage)}
      ${generateSuccessMessage(data.successMessage)}

    `
  }

}