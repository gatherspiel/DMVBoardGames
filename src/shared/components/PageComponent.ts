import { NavbarComponent } from "../../ui/static/navbarComponent.ts";
import { LoginComponent } from "../../ui/auth/components/LoginComponent.ts";
import { getComponent } from "./ComponentRegistry.ts";
import { setupStateFields} from "../InitGlobalStateConfig.ts";
import {GroupPageComponent} from "../../ui/groups/viewGroup/components/GroupPageComponent.ts";
import {HomepageComponent} from "../../ui/homepage/components/HomepageComponent.ts";
import {getUrlParameter} from "../../framework/utils/UrlParamUtils.ts";

export const GROUP_PAGE_ROUTE = "groupPageRoute";

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
    window.addEventListener("popstate", (event) => {
      console.log("Event:"+event.state)
        self.removeChild(self.activeComponent);

        if(self.prevComponent){
          self.activeComponent = new HomepageComponent()
          self.appendChild(self.activeComponent);
        }

    });

  }

  update(route:string,params?:Record<string, string>){
    this.removeChild(this.activeComponent)
    this.prevComponent = this.activeComponent;

    const routeData = this.#getRouteData(route);

    let updatedUrl = routeData.url;

    if(params){
      const paramData:string[] = [];
      Object.keys(params).forEach((function(key){
        paramData.push(`${key}=${encodeURIComponent(params[key])}`)
      }));

      if(paramData.length ===1){
        updatedUrl += `?${paramData.join("&")}`
      }
    }

    console.log(updatedUrl)
    window.history.pushState({"Test":"Test"},"Test",updatedUrl)

    console.log(getUrlParameter("name"));

    const component = new GroupPageComponent();
    this.appendChild(component)
    this.activeComponent = component;
  }


  #getRouteData(route:string):any{
    if(route === GROUP_PAGE_ROUTE) {
      return {
        url:`groups.html`,
      }
    }else {
      throw new Error(`No route defined for ${route}`);
    }
  }
}


if (!customElements.get("page-component")) {
  customElements.define("page-component", PageComponent);
}


