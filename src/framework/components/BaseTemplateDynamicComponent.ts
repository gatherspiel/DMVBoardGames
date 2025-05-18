import { getElementWithSelector } from "./utils/ComponentUtils.ts";
import { BaseDynamicComponent } from "./BaseDynamicComponent.ts";

export abstract class BaseTemplateDynamicComponent extends BaseDynamicComponent {
  override generateAndSaveHTML(data: any) {
    this.attachShadow({ mode: "open" });
    this.shadowRoot!.appendChild(this.getTemplate().content.cloneNode(true));
    const div = getElementWithSelector("div", this.shadowRoot!);
    div.innerHTML = this.generateHTML(data);
  }

  abstract getTemplate(): HTMLTemplateElement;
}
