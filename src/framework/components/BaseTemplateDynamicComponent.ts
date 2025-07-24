import { getElementWithSelector } from "./utils/ComponentUtils.ts";
import { BaseDynamicComponent } from "./BaseDynamicComponent.ts";

export abstract class BaseTemplateDynamicComponent extends BaseDynamicComponent {
  override generateAndSaveHTML(data: any) {
    if (this.shadowRoot === null) {
      this.attachShadow({ mode: "open" });

      let templateStyle = this.getTemplateStyle();

      const template = document.createElement("template");
      template.innerHTML = templateStyle + `<div></div>`;
      this.shadowRoot!.appendChild(template.content.cloneNode(true));
    }

    const div = getElementWithSelector("div", this.shadowRoot!);
    div.innerHTML = this.render(data);
  }

  /*
   - Returns CSS styles specific to the component. The string should be in the format <style> ${CSS styles} </style>
   */
  abstract getTemplateStyle(): string;

}
