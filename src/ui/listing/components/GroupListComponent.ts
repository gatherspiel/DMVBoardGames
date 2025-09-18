import {BaseDynamicComponent} from "@bponnaluri/places-js";
import {generateLinkButton} from "../../../shared/components/ButtonGenerator.ts";
import {getDisplayName} from "../../../shared/DisplayNameConversion.ts";

import {GROUP_SEARCH_STORE} from "../data/search/GroupSearchStore.ts";
import {DEFAULT_SEARCH_PARAMETER} from "./group-search/Constants.ts";

export class GroupListComponent extends BaseDynamicComponent {
  constructor() {
    super([{
      dataStore: GROUP_SEARCH_STORE,
      params: {
        city: DEFAULT_SEARCH_PARAMETER,
        day: DEFAULT_SEARCH_PARAMETER
      }
    }]);
  }

  override getTemplateStyle(): string {
    return `
      <link rel="preload" as="style" href="/styles/sharedHtmlAndComponentStyles.css" onload="this.rel='stylesheet'"/>
      <style>
        .button-div {
          display: flex;
        }
        @media not screen and (width < 32em) {
          .group-cities {
            display: inline-block;
            margin-left: 2rem;
          }
          .raised {
            display: inline-block;
          }
        }  
        @media screen and (width < 32em) {
          a {
            margin-top: 1rem;
          }
          .group-cities {
            display: none; 
          }
          .ui-section .event-group:not(:first-child) {
            margin-top: 0.5rem;
          }
          .raised {
            margin-top: 0.5rem;
            margin-left:2rem;
            margin-right:2rem;
          }
        } 
      </style>
    `;
  }

  private getItemHtml(group: any) {

    const groupCitiesStr = group.cities ?
        group.cities.map((name:string) => getDisplayName(name))?.join(", ") :
        "DMV Area"
    return `
      <div>
        ${generateLinkButton({
          text: group.name,
          url: `groups.html?name=${encodeURIComponent(group.name)}`
        })}
        <p class="group-cities">${groupCitiesStr}</p>              
      </div>
    `;
  }

  render(data: any): string {
    let html = `<div class="ui-section">`;
    html+= `${this.getItemHtml(data.groupData[0])}`

    for(let i = 1; i<data.groupData.length; i++){
      html+= `
        <div class="section-separator-small"></div> 
        ${this.getItemHtml(data.groupData[i])}
      `
    }
    if(data.groupData.length === 0)  {
      html += `<p>No groups found.</p>`;
    }

    return html + `</div>`;
  }
}
