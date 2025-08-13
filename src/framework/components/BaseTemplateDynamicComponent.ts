import { BaseDynamicComponent } from "./BaseDynamicComponent.ts";

export abstract class BaseTemplateDynamicComponent extends BaseDynamicComponent {
  override generateAndSaveHTML(data: any, dependenciesLoaded:boolean) {
    if (this.shadowRoot === null) {
      this.attachShadow({ mode: "open" });

      let templateStyle = this.getTemplateStyle();

      const template = document.createElement("template");
      template.innerHTML = templateStyle + `<div></div>`;
      this.shadowRoot!.appendChild(template.content.cloneNode(true));
    }

    const div = this.shadowRoot!.querySelector("div");
    if (div === null) {
      throw new Error(`Did not find div when creating template component`);
    }

    if(this.showLoadingHtml && !dependenciesLoaded) {
      div.innerHTML = this.showLoadingHtml();
    }
    else {
      div.innerHTML = this.render(data);
    }

  }

  /*
   - Returns CSS styles specific to the component. The string should be in the format <style> ${CSS styles} </style>
   */
  abstract getTemplateStyle(): string;

  showLoadingHtml?():string

}
