import { getElementWithSelector } from "./utils/ComponentUtils.ts";
import { BaseDynamicComponent } from "./BaseDynamicComponent.ts";

export abstract class BaseTemplateDynamicComponent extends BaseDynamicComponent {
  override generateAndSaveHTML(data: any) {
    if (this.shadowRoot === null) {
      this.attachShadow({ mode: "open" });

      const template = this.getTemplate();

      let templateStyle = template.innerHTML
        .split(`<style>`)[1]
        .split(`</style`)[0];
      templateStyle += this.getSharedStyle();

      template.innerHTML = `<style> ${templateStyle} </style><div></div>`;
      this.shadowRoot!.appendChild(this.getTemplate().content.cloneNode(true));
    }

    const div = getElementWithSelector("div", this.shadowRoot!);
    div.innerHTML = this.render(data);
  }

  abstract getTemplate(): HTMLTemplateElement;

  getSharedStyle(): string {
    return "";
  }
}
