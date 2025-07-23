import { NavbarComponent } from "../../ui/static/navbarComponent.ts";
import { LoginComponent } from "../../ui/auth/components/LoginComponent.ts";
import { getComponent } from "./ComponentRegistry.ts";
import { setupStateFields} from "../InitGlobalStateConfig.ts";
import {GroupPageComponent} from "../../ui/groups/viewGroup/components/GroupPageComponent.ts";
import {HomepageComponent} from "../../ui/homepage/components/HomepageComponent.ts";
import {PageState} from "../../framework/state/pageState.ts";

export const GROUP_PAGE_ROUTE = "groupPageRoute";

export class PageComponent extends HTMLElement {

  static currentComponent: PageComponent;


  constructor() {
    super();

    setupStateFields();
    const componentName: string = this.getAttribute("componentName") ?? "";
    this.appendChild(new NavbarComponent());
    this.appendChild(new LoginComponent());

    PageState.activeComponent = getComponent(componentName);
    this.appendChild(PageState.activeComponent);

    PageComponent.currentComponent = this;

    const self = this;
    window.addEventListener("popstate", (event) => {
      console.log("Event:"+event.state)
        self.removeChild(PageState.activeComponent);

        if(PageState.prevComponent){
          PageState.activeComponent = new HomepageComponent()
          self.appendChild(PageState.activeComponent);
        }

    });

  }

  update(route:string,params?:Record<string, string>){
    this.removeChild(PageState.activeComponent)
    PageState.prevComponent = PageState.activeComponent;

    const componentToAdd = this.#getComponentAndUpdateUrl(route, params);

    this.appendChild(componentToAdd)
    PageState.activeComponent = componentToAdd;
  }


  #getComponentAndUpdateUrl(route:string, params?:Record<string, string>): HTMLElement{

    if(route === GROUP_PAGE_ROUTE) {
      this.#updateUrlWithQuery("groups.html", params)
      return new GroupPageComponent();
    }else {
      throw new Error(`No route defined for ${route}`);
    }
  }

  #updateUrlWithQuery(route:string, params: any){
    let updatedUrl = route;
    if(params){
      const paramData:string[] = [];
      Object.keys(params).forEach((function(key){
        paramData.push(`${key}=${encodeURIComponent(params[key])}`)
      }));

      if(paramData.length ===1){
        updatedUrl += `?${paramData.join("&")}`
      }
    }
    window.history.pushState({"Test":"Test"},"Test",updatedUrl)
  }
}


if (!customElements.get("page-component")) {
  customElements.define("page-component", PageComponent);
}


