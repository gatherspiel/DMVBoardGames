import { BaseTemplateDynamicComponent } from "../../../../framework/components/BaseTemplateDynamicComponent.ts";
import {
  getSharedButtonAndLinkStyles,
  getSharedUiSectionStyles,
} from "../../../utils/SharedStyles.ts";

const template = `
  <style>

    
  </style>
`;

export class EventDetailsComponent extends BaseTemplateDynamicComponent {
  constructor() {
    super("group-event-component");
  }

  connectedCallback() {
    this.updateStore({});
  }

  render(): string {
    console.log("Hi");

    return `
      <div class="ui-section">
         <h1>View group event</h1>
      <button>Edit event</button>  
      <button>Back to group</button> 
</div>
 
    `;
  }

  override getSharedStyle() {
    return getSharedUiSectionStyles() + getSharedButtonAndLinkStyles();
  }

  getTemplateStyle(): string {
    return template;
  }
}

if (!customElements.get("event-details-component")) {
  customElements.define("event-details-component", EventDetailsComponent);
}
