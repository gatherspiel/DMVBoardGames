import { addTemplateToComponent } from "./utils/ComponentUtils.ts";

export abstract class BaseTemplateComponent extends HTMLElement {
  connectedCallback() {
    const id = this.getAttribute("key");
    if (id === null) {
      throw new Error("id is not defined");
    }

    addTemplateToComponent(this);
  }

  abstract getTemplate(): HTMLTemplateElement;

  abstract render(data?: any): string;
}
