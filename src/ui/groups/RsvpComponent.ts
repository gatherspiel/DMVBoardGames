import {ApiActionTypes, ApiLoadAction, BaseDynamicComponent} from "@bponnaluri/places-js";
import {API_ROOT} from "../shared/Params.ts";
import {
  ERROR_MESSAGE_KEY,
  generateErrorMessage,
  generateSuccessMessage,
  SUCCESS_MESSAGE_KEY
} from "../../shared/html/StatusIndicators.ts";

export class RsvpComponent extends BaseDynamicComponent {

  #rsvpUrl:string;
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

  protected override getTemplateStyle(): string {
    return `
      <link rel="stylesheet" type="text/css" href="/styles/sharedHtmlAndComponentStyles.css"/>

      <style>
      </style>
    `
  }

  override attachHandlersToShadowRoot(shadowRoot:ShadowRoot){

    const self = this;

    shadowRoot?.addEventListener("click",(event:any)=>{
      if(event.target.className == "front"){

        if(!self.componentStore.userHasRsvp){

          ApiLoadAction.getResponseData({
            method: ApiActionTypes.POST,
            url: API_ROOT + this.#rsvpUrl
          }).then((response:any)=>{
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
            method: ApiActionTypes.DELETE,
            url: API_ROOT + this.#rsvpUrl
          }).then((response:any)=>{
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

  override render(data:any){
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