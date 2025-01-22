import { Component } from "../../../framework/Component.js";

export class EventListComponent extends Component {
  constructor(parentNodeName, data) {
    super(parentNodeName, data);
  }

  render(componentState) {
    console.log("Rendering");
  }

  static createComponent(parentNodeName, data) {
    return new EventListComponent(parentNodeName, data);
  }
}
