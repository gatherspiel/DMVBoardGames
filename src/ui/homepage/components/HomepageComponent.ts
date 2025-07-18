import {GameStoreListComponent} from "./GameStoreListComponent.ts";
import {ConventionListComponent} from "./ConventionListComponent.ts";
import {GroupPageEventComponent} from "../../groups/viewGroup/components/GroupPageEventComponent.ts";
import {EventListComponent} from "./event-list/EventListComponent.ts";
import {EventSearchComponent} from "./event-search/EventSearchComponent.ts";

export class HomepageComponent extends HTMLElement {


  connectedCallback(){

    console.log(GameStoreListComponent.name)
    console.log(ConventionListComponent.name)
    console.log(GroupPageEventComponent.name);
    console.log(EventListComponent.name);
    console.log(EventSearchComponent.name);

    this.innerHTML = `
     <div class="ui-separator"></div>
      <div class="ui-section">
        <nav>
          <div id="nav-container">
    
            <div>Click for more info about</div>
    
            <button onclick="document.location='#convention-list'">Conventions</button>
            <button onclick="document.location='#game-store'">Game Stores</button>
            <button onclick="document.location='#game-restaurant-list'">Bars And Cafés</button>
    
          </div>
    
        </nav>
    
      </div>
    
    
      <div id="event-search" class="page-section"></div>
    
      <div data-container="root">
        <event-search-component id="eventList" class="page-section">
        </event-search-component>
    
        <div class="ui-separator"></div>
    
        <div id="event-list" class="page-section">
          <event-list-component></event-list-component>
        </div>
    
        <div id="convention-list" class="page-section">
          <convention-list-component data-test="testing">
            <p></p>
          </convention-list-component>
        </div>
    
        <div id="game-restaurant-list" class="page-section">
          <game-restaurant-list-component></game-restaurant-list-component>
        </div>
    
        <div id="game-store" class="page-section">
          <game-store-list-component></game-store-list-component>
        </div>
      </div>
    </div>
    
  
    `
  }
}

if (!customElements.get("homepage-component")) {
  customElements.define("homepage-component", HomepageComponent);
}