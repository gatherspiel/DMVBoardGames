import {AbstractPageComponent, BaseTemplateComponent, deserializeJSONProp} from "@bponnaluri/places-js";
import {
  convertDateTimeForDisplay,
  convertLocationStringForDisplay
} from "@bponnaluri/places-js";
import {generateButton} from "../../../../shared/components/ButtonGenerator.ts";
import {EventDetailsComponent} from "../../events/components/EventDetailsComponent.ts";


const template = `

  <link rel="stylesheet" type="text/css" href="/styles/sharedComponentStyles.css"/>
  <style>
 
    p {
      word-wrap: break-word;
      display: inline-block;
      white-space: normal;

      font-size: 1rem;
      font-weight:600;
        
      max-width: 65ch;
      margin-top: 0.5rem;
    }
    
    .event-time, .event-location {
      font-size: 1.25rem;
      font-weight: 600;
   }
   
   .event {
      border-bottom:  5px solid;
      border-image-source: url(assets/Section_Border_Tiny.png);
      border-image-slice: 5 5;
      border-image-repeat: round;
   }
    
  </style>
`;

const VIEW_EVENT_DETAILS_BUTTON_ID = "view-event-details-button";
export class GroupEventComponent extends BaseTemplateComponent {

  //Rerenders are not dependent on this data changing after the component is created.
  #eventData:any;

  constructor() {
    super();
    this.id = "";
    this.#eventData = deserializeJSONProp(this, "data");
  }

 override attachEventHandlersToDom(shadowRoot?: any) {
    const self = this;
    shadowRoot?.getElementById(VIEW_EVENT_DETAILS_BUTTON_ID).addEventListener("click", ()=>{
      AbstractPageComponent.updateRoute(
        EventDetailsComponent,
        {
          id:self.#eventData.id,
          groupId:self.#eventData.groupId
        })
   })
 }

  render(): string {
    this.id = this.getAttribute("key") ?? "";
    return `
      <div id=${this.id} class="event">
      
        <div class="ui-section">
          <h3>${this.#eventData.name}</h3>
          <p class = "event-time">${convertDateTimeForDisplay(this.#eventData.startTime)}</p>
          <p class = "event-location">Location: ${convertLocationStringForDisplay(this.#eventData.location)}</p>
          </br>  
          
           ${generateButton({
            class: "group-webpage-link",
            id: VIEW_EVENT_DETAILS_BUTTON_ID,
            text: "View event details",
          })}

        </div>
          
      </div>
    `;
  }

  getTemplateStyle(): string {
    return template;
  }
}

if (!customElements.get("group-page-event-component")) {
  customElements.define("group-page-event-component", GroupEventComponent);
}
