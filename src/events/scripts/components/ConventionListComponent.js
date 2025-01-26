import { ListComponent } from "./shared/ListComponent.js";

export class ConventionListComponent extends ListComponent {
  constructor(parentNodeName, data) {
    super(parentNodeName, data);
  }

  getItemHtml(convention) {
    return `
    <div id = convention-${convention.id}>
     <h3>
        <a href=${convention.link}>${convention.title}</a>
      </h3>
      <p>Days: ${convention.days.join()}</p>
    
    </div>
  `;
  }

  static createComponent(parentNodeName, data) {
    return new ConventionListComponent(parentNodeName, data);
  }
}
