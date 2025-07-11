import { retrieveJSONProp } from "../../../../framework/components/utils/ComponentUtils.ts";
import { BaseTemplateDynamicComponent } from "../../../../framework/components/BaseTemplateDynamicComponent.ts";
import {
  convertDateTimeForDisplay,
  convertLocationStringForDisplay
} from "../../../../framework/utils/EventDataUtils.ts";

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
      margin-right: 5rem;
    }
    
    .event-time, .event-location {
      font-size: 1.25rem;
      font-weight: 600;
   }
   
   .event {
      border-top: 1px solid var(--clr-lighter-blue);
   }
    
  </style>
`;

export class GroupPageEventComponent extends BaseTemplateDynamicComponent {
  constructor() {
    super("event-component");
    this.id = "";
  }

  connectedCallback() {
    this.updateStore({});
  }

  render(): string {
    this.id = this.getAttribute("key") ?? "";
    const eventData = retrieveJSONProp(this, "data");

    return `
      <div id=${this.id} class="event">
      
        <div class="ui-section">
          <h3>${eventData.name}</h3>
          <p class = "event-time">${convertDateTimeForDisplay(eventData.startTime)}</p>
          <p class = "event-location">Location: ${convertLocationStringForDisplay(eventData.location)}</p>
          </br>  
          
          <a href="/groups/event.html?id=${eventData.id}">View event details</a>
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
