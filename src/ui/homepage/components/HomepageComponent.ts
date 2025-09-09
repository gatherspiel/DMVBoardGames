import {BaseTemplateComponent} from "@bponnaluri/places-js";
import {GroupListComponent} from "./GroupListComponent.ts";
import {GroupSearchComponent} from "./group-search/GroupSearchComponent.js";
import {ListingNavComponent} from "../../../shared/components/ListingNavComponent.ts";
import {LoginStatusComponent} from "../../../shared/components/LoginStatusComponent.js";
import {OpenCreateGroupPageComponent} from "./OpenCreateGroupPageComponent.js";

customElements.define("group-list-component", GroupListComponent);
customElements.define("group-search-component", GroupSearchComponent);
customElements.define("listing-nav-component", ListingNavComponent);
customElements.define("login-status-component",LoginStatusComponent)
customElements.define("open-create-group-component", OpenCreateGroupPageComponent);

export class HomepageComponent extends BaseTemplateComponent {
  constructor(){
    super();
  }

  override getTemplateStyle():string{
    return `
      <link rel="stylesheet" type="text/css" href="/styles/sharedComponentStyles.css"/>

      <style>
       .section-separator-medium {
          border-bottom:  20px solid;
          border-image-source: url(assets/Section_Border_Medium.png);
          border-image-slice: 20 20;
          border-image-repeat: round;
          padding-top:0.5rem;
        }
    </style>
    `
  }

  render(){
    return `
      <open-create-group-component class = "ui-section">
      </open-create-group-component>     
      
      <listing-nav-component
        class="ui-section"
        id="show-info-ui"
        currentPage="index.html"
      >
      </listing-nav-component>      

     
      <div class="section-separator-medium"></div>
      <group-search-component class = "ui-section" id="group-search-component">
      </group-search-component>
      <div class="section-separator-medium"></div>
      <group-list-component class="ui-section"></group-list-component>
      
    `
  }
}

