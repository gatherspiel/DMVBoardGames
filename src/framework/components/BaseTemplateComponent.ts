import { addTemplateToComponent } from "./utils/ComponentUtils.ts";

export abstract class BaseTemplateComponent extends HTMLElement {
  connectedCallback() {
    addTemplateToComponent(this);
  }

  abstract getTemplate(): HTMLTemplateElement;

  abstract render(data?: any): string;
}
