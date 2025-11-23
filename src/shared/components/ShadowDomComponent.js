/**
 * Component that wraps static HTML and styles in a shadow DOM component. This is useful for making it harder
 * for bots to scrape the contents and having scoped styles.
 */
export class ShadowDomComponent extends HTMLElement {
  connectedCallback() {
    this.attachShadow({ mode: "open" });
    const template = document.createElement("template");
    template.innerHTML = this.innerHTML;
    this.innerHTML = "";
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }
}