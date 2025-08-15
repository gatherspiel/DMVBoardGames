import type { Convention } from "../data/types/Convention.ts";
import { BaseTemplateDynamicComponent } from "../../../framework/components/BaseTemplateDynamicComponent.ts";
import {generateButton} from "../../../shared/components/ButtonGenerator.ts";
import {REDIRECT_HANDLER_CONFIG} from "../../../framework/handler/RedirectHandler.ts";
import {
  DEFAULT_GLOBAL_STATE_REDUCER_KEY,
  GLOBAL_FIELD_SUBSCRIPTIONS_KEY,
  GLOBAL_STATE_LOAD_CONFIG_KEY
} from "../../../framework/components/types/ComponentLoadConfig.ts";
import {EVENT_HANDLER_CONFIG_KEY, EVENT_HANDLER_PARAMS_KEY} from "../../../shared/Constants.ts";

const loadConfig = {
  [GLOBAL_STATE_LOAD_CONFIG_KEY]: {
    [GLOBAL_FIELD_SUBSCRIPTIONS_KEY]: ["gameLocations"],
    [DEFAULT_GLOBAL_STATE_REDUCER_KEY]: (data:any) => {
      return data.gameLocations.conventions;
    }
  },
};

const template = `
  <link rel="stylesheet" type="text/css" href="/styles/sharedComponentStyles.css"/>

   <style>
  .conv-list-item > * {
    display: inline-block;
  }
  
  h3 {
    font-size: 1.5rem;
  }
  
  p {
    padding-left: 0.5rem;
  }


</style>`;

export class ConventionListComponent extends BaseTemplateDynamicComponent {
  constructor() {
    super(loadConfig);
  }

  getItemHtml(convention: Convention) {
    return `
    <div id = convention-${convention.id} class="conv-list-item">
     <h3>
      ${generateButton({
        text: `${convention.name}`,
        component: this,
        [EVENT_HANDLER_CONFIG_KEY]: REDIRECT_HANDLER_CONFIG,
        [EVENT_HANDLER_PARAMS_KEY]: {url: convention.url}
      })}
      </h3>
      <p>Days: ${convention.days.join(", ")}</p>
    
    </div>
  `;
  }

  override getTemplateStyle(): string {
    return template;
  }
  render(data: Record<any, Convention>) {
    let html = `

      <div class="ui-section"><h1 class="hideOnMobile">Upcoming conventions</h1>
      <h2 class="showOnMobile">Upcoming conventions</h2>`;

    Object.values(data).forEach((item) => {
      const itemHtml = this.getItemHtml(item);
      html += itemHtml;
    });
    return html + "</div>";
  }
}

if (!customElements.get("convention-list-component")) {
  customElements.define("convention-list-component", ConventionListComponent);
}
