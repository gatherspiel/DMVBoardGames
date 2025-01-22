import { Component } from "../../../framework/Component.js";

export class ConventionListComponent extends Component {
  constructor(parentNodeName, data) {
    super(parentNodeName, data);
  }

  getConventionHtml(convention) {
    return `
    <div id = convention-${convention.id}>
     <h3>
        <a href=${convention.link}>${convention.title}</a>
      </h3>
      <p>Days: ${convention.days.join()}</p>
    
    </div>
  `;
  }

  generateHtml(conventionData) {
    let html = `<h1> Upcoming conventions</h1>`;
    Object.values(conventionData).forEach((convention) => {
      const conventionHtml = this.getConventionHtml(convention);
      html += conventionHtml;
    });
    return html;
  }

  static createComponent(parentNodeName, data) {
    return new ConventionListComponent(parentNodeName, data);
  }
}
