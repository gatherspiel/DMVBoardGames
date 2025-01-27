const CONTAINER_ROOT_KEY = "data-container";

export class Component {
  constructor(parentNode, data) {
    this.parentNode = parentNode;
    this.name = data.nodeName;
    this.data = data;
    this.renderRoot();
    Component.components[this.name] = this;
  }

  getNode() {
    return document.querySelector(`[${CONTAINER_ROOT_KEY}=${this.parentNode}]`);
  }

  renderRoot() {
    const id = this.data.nodeName;
    const classNames = this.data.classNames;
    const parentNode = this.getNode(this.parentNode);
    parentNode.innerHTML += `
      <div id=${id} class=${classNames.join(" ")}   
      </div>   
    `;
  }

  updateData(data) {
    const html = this.generateHtml(data);
    document.querySelector(`#${this.name}`).innerHTML = html;
  }

  generateHtml() {
    console.warn(`Component ${this.name} is missing a generateHtml method`);
  }

  render() {
    this.renderRoot();
  }

  static components = {};

  static createComponent(parentNodeName, data) {
    return new Component(parentNodeName, data);
  }
}
