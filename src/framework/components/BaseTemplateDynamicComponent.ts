import { getElementWithSelector } from "./utils/ComponentUtils.ts";
import { BaseDynamicComponent } from "./BaseDynamicComponent.ts";

export abstract class BaseTemplateDynamicComponent extends BaseDynamicComponent {
  override generateAndSaveHTML(data: any) {
    if (this.shadowRoot === null) {
      this.attachShadow({ mode: "open" });

      let templateStyle = this.getTemplateStyle();

      templateStyle = templateStyle.split(`<style>`)[1].split(`</style`)[0];
      templateStyle += this.getSharedStyle();

      const template = document.createElement("template");
      template.innerHTML = `<style> ${templateStyle} </style><div></div>`;

      this.shadowRoot!.appendChild(template.content.cloneNode(true));
    }

    const div = getElementWithSelector("div", this.shadowRoot!);
    div.innerHTML = this.render(data);
  }

  abstract getTemplateStyle(): string;

  getSharedStyle(): string {
    return "";
  }
}
