import { Component } from "../../../framework/Component/Component.js";
import { getData } from "../data/mock/MockPageData.js";

export class GroupEventComponent extends Component {
  constructor(parentNodeName, data) {
    super(parentNodeName, data);
  }

  generateHtml() {
    console.warn("Not implmented");
    let html = "";
    return html;
  }

  static createComponent(parentNodeName, data) {
    return new GroupEventComponent(parentNodeName, data);
  }
}
