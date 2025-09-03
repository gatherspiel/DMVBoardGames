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
}
