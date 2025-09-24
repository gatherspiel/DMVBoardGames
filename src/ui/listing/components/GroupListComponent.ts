import {BaseDynamicComponent} from "@bponnaluri/places-js";
import {generateLinkButton} from "../../../shared/components/ButtonGenerator.ts";
import {getDisplayName} from "../../../shared/DisplayNameConversion.ts";

import {GROUP_SEARCH_STORE} from "../data/search/GroupSearchStore.ts";
import {DEFAULT_SEARCH_PARAMETER} from "./group-search/Constants.ts";
import {LOGIN_STORE} from "../../auth/data/LoginStore.ts";

export class GroupListComponent extends BaseDynamicComponent {
  constructor() {
    super([{
      dataStore: GROUP_SEARCH_STORE,
      params: {
        city: DEFAULT_SEARCH_PARAMETER,
        day: DEFAULT_SEARCH_PARAMETER
      },
      fieldName:"data"
    },{
      dataStore: LOGIN_STORE,
      fieldName: "loginStatus"
   }]);
  }

  override getTemplateStyle(): string {
    return `
      <link rel="preload" as="style" href="/styles/sharedHtmlAndComponentStyles.css" onload="this.rel='stylesheet'"/>
      <style>
       li {
          padding-bottom: 1rem;
          padding-top:1rem;
        }
        ul {
          list-style:url(/assets/meeple_small.png);
          margin-top:0;
          padding-left:1.5rem;
        }
       .button-div {
          display: flex;
        }
        .section-separator-small {
          margin-left:-1rem;
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

  private getItemHtml(group: any, loggedIn: boolean) {
    const groupCitiesStr = (group.cities && group.cities.length >0) ?
        group.cities.map((name:string) => getDisplayName(name))?.join(", ") :
        "DMV Area"

    return `
      <li>
        ${generateLinkButton({
          text: group.name,
          url: `${group.hasRecurringEvents || loggedIn ? `groups.html?name=${encodeURIComponent(group.name)}` : `${group.url}`}`
        })}
        <span class="group-cities">${groupCitiesStr}</span>              
      </li>
    `;
  }
  render(state: any): string {
    if(state.data.groupData.length === 0){
      return `
          <p>No groups found</p>
          <div class="section-separator-small"></div> 
        `
    }

    let html = `<ul>`;
    for(let i = 0; i<state.data.groupData.length; i++){
      html+= `
        ${this.getItemHtml(state.data.groupData[i], state.loginStatus.loggedIn)}
        <div class="section-separator-small"></div> 

      `
    }
    return html + `</ul>`;
  }
}
