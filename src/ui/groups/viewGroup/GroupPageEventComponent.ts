import {
  BaseTemplateComponent,
  deserializeJSONProp,
  getDateFromDateString
} from "@bponnaluri/places-js";
import {
  convertLocationStringForDisplay
} from "@bponnaluri/places-js";
import {generateLinkButton} from "../../../shared/components/ButtonGenerator.ts";


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
      padding-bottom: 0.5rem;
  }
   
  .raised {
    display: inline-block;
  }
    
  </style>
`;

export class GroupPageEventComponent extends BaseTemplateComponent {

  //Rerenders are not dependent on this data changing after the component is created.
  #eventData:any;

  constructor() {
    super();
    this.id = "";
    this.#eventData = deserializeJSONProp(this, "data");
  }


  render(): string {
    this.id = this.getAttribute("key") ?? "";
    return `
      <div id=${this.id} class="event">
      
        <div>
          <h3>${this.#eventData.name}</h3>
          <p class = "event-time">${getDateFromDateString(this.#eventData.startTime)}</p>
          <p class = "event-location">Location: ${convertLocationStringForDisplay(this.#eventData.location)}</p>
          </br>  
          
           ${generateLinkButton({
            text: "View event details",
            url: `groups/event.html?id=${encodeURIComponent(this.#eventData.id)}&groupId=${encodeURIComponent(this.#eventData.groupId)}`
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
  customElements.define("group-page-event-component", GroupPageEventComponent);
}
