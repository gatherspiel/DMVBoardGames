export abstract class BaseComponent extends HTMLElement {
  connectedCallback() {
    const id = this.getAttribute("key");
    if (id === null) {
      throw new Error("id is not defined");
    }

    this.attachShadow({ mode: "open" });

    const shadowRoot = this.shadowRoot;
    if (!shadowRoot) {
      throw new Error("shadowRoot is not defined");
    }

    const template = this.getTemplate();
    this.shadowRoot?.appendChild(template.content.cloneNode(true));

    const div = this.shadowRoot?.querySelector("div");
    if (!div) {
      throw new Error("template must be defined with a <div></div> tag");
    }

    div.innerHTML = this.generateHTML();
  }

  abstract getTemplate(): HTMLTemplateElement;

  abstract generateHTML(): string;
}
