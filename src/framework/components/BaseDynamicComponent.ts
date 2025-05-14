export abstract class BaseDynamicComponent extends HTMLElement {
  connectedCallback() {
    this.innerHTML = this.generateHTML();
  }

  abstract updateData(): void;
  abstract generateHTML(): string;
}
