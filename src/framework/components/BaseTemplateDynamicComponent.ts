import { BaseTemplateComponent } from "./BaseTemplateComponent.ts";
import { getElementWithSelector } from "./utils/ComponentUtils.ts";

export abstract class BaseTemplateDynamicComponent extends BaseTemplateComponent {
  updateData(data: any) {
    this.attachShadow({ mode: "open" });
    this.shadowRoot!.appendChild(this.getTemplate().content.cloneNode(true));
    const div = getElementWithSelector("div", this.shadowRoot!);
    div.innerHTML = this.generateHTML(data);
  }
}
