import { Component } from "../../../framework/Component.js";

export class EventComponent extends Component {
  constructor(parentNodeName, data) {
    super(parentNodeName, data);
  }

  generateHtml() {
    console.warn("Not implmented");
    let html = "";
    return html;
  }

  static createComponent(parentNodeName, data) {
    return new EventComponent(parentNodeName, data);
  }
}
