import { NavbarComponent } from "../../ui/static/navbarComponent.ts";
import { LoginComponent } from "../../ui/auth/components/LoginComponent.ts";
import { getComponent } from "./ComponentRegistry.ts";
import { setupStateFields} from "../InitGlobalStateConfig.ts";
import {GroupPageComponent} from "../../ui/groups/viewGroup/components/GroupPageComponent.ts";
import {HomepageComponent} from "../../ui/homepage/components/HomepageComponent.ts";


export class PageComponent extends HTMLElement {

  static currentComponent: PageComponent;

  activeComponent: HTMLElement;
  prevComponent: HTMLElement | undefined;

  constructor() {
    super();

    setupStateFields();
    const componentName: string = this.getAttribute("componentName") ?? "";
    this.appendChild(new NavbarComponent());
    this.appendChild(new LoginComponent());

    this.activeComponent = getComponent(componentName);
    this.appendChild(this.activeComponent);

    PageComponent.currentComponent = this;

    const self = this;
    // Handle forward/back buttons
    window.addEventListener("popstate", (event) => {
      // If a state has been provided, we have a "simulated" page
      // and we update the current page.
      console.log("Event:"+event.state)
        self.removeChild(self.activeComponent);
        // Simulate the loading of the previous page

        if(self.prevComponent){
          self.activeComponent = new HomepageComponent()
          self.appendChild(self.activeComponent);
        }

    });

  }

  update(){
    this.removeChild(this.activeComponent)

    this.prevComponent = this.activeComponent;
    window.history.pushState({"Test":"Test"},"Test","groups.html?name=Beer & Board Games")

    const component = new GroupPageComponent();
    this.appendChild(component)
    this.activeComponent = component;
  }
}


if (!customElements.get("page-component")) {
  customElements.define("page-component", PageComponent);
}


