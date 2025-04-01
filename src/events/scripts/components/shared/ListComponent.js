import { Component } from "../../../../framework/Component.js";

export class ListComponent extends Component {
  constructor(parentNodeName, data) {
    super(parentNodeName, data);
    this.title = data.title;
  }

  getItemHtml(data) {
    console.warn(
      "getItemHtml should be implemented in the child component class"
    );
  }

  generateHtml(data) {
    let html = `<h1>${this.title}</h1>`;
    Object.values(data).forEach((item) => {
      const itemHtml = this.getItemHtml(item);
      html += itemHtml;
    });
    return html;
  }
}
