import { NavbarComponent } from "../../ui/static/NavbarComponent.ts";
import { LoginComponent } from "../../ui/auth/components/LoginComponent.ts";
import { getComponent } from "./ComponentRegistry.ts";
import { setupStateFields} from "../InitGlobalStateConfig.ts";
import {GroupComponent} from "../../ui/groups/viewGroup/components/GroupComponent.ts";
import {PageState} from "../../framework/state/PageState.ts";
import {EventDetailsComponent} from "../../ui/groups/event/components/EventDetailsComponent.ts";
import {CreateEventComponent} from "../../ui/groups/event/components/CreateEventComponent.ts";
import {DeleteGroupPageComponent} from "../../ui/groups/deleteGroup/DeleteGroupPageComponent.ts";
import {CreateGroupPageComponent} from "../../ui/groups/createGroup/components/CreateGroupPageComponent.ts";
import {clearRequestStores} from "../../framework/state/data/RequestStore.ts";
import {clearComponentStores} from "../../framework/state/data/ComponentStore.ts";
import type {BaseDynamicComponent} from "../../framework/components/BaseDynamicComponent.ts";

//@ts-ignore
import {HomepageComponent} from "../../ui/homepage/components/HomepageComponent.ts";

export class PageComponent extends HTMLElement {

  static #currentComponent: PageComponent;
  routeMap:any = {
    [GroupComponent.name]: function(){return "groups.html"},
    [CreateGroupPageComponent.name]: function(){return "groups/create.html"},
    [DeleteGroupPageComponent.name]: function(params:any){
      return `groups/delete.html?name=${encodeURIComponent(params.name)}&groupId=${params.id}`
    },
    [CreateEventComponent.name]: function(params:any){
      return `groups/delete.html?name=${encodeURIComponent(params.name)}&groupId=${params.id}`
    },
    [EventDetailsComponent.name]: function(params:any) {
      return `/groups/event.html?id=${params.id}&groupId=${params.groupId}`
    }
  }
  
  constructor() {
    super();

    setupStateFields();
    const componentName: string = this.getAttribute("componentName") ?? "";
    this.appendChild(new NavbarComponent());
    this.appendChild(new LoginComponent());

    PageState.activeComponent = getComponent(componentName);

    this.appendChild(PageState.activeComponent);

    PageComponent.#currentComponent = this;
    const self = this;
    window.addEventListener("popstate", () => {
      self.removeChild(PageState.activeComponent);

      const prevState = PageState.popPrevComponent();
      if(prevState){
        window.history.replaceState({"Test":"Test"},"Test",prevState.url)

        // @ts-ignore
        PageState.activeComponent = getComponent(prevState.component.localName)
        self.appendChild(PageState.activeComponent);
      }
    });
  }

  static updateRoute(componentType:typeof BaseDynamicComponent, params?:Record<string, string>){
    PageComponent.#currentComponent.update(componentType, params);
  }

  update(componentType:typeof BaseDynamicComponent,params?:Record<string, string>){
    clearRequestStores();
    clearComponentStores();
    this.removeChild(PageState.activeComponent)

    PageState.pushComponentToHistory(PageState.activeComponent, window.location.href, PageState.activeComponentType)
    const componentToAdd = this.#getComponentAndUpdateUrl(componentType, params);
    this.appendChild(componentToAdd)

    PageState.activeComponent = componentToAdd;
    PageState.activeComponentType = componentType;
  }

  #getComponentAndUpdateUrl(componentType:any, params?:Record<string, string>): HTMLElement{
    if(!(componentType.name in this.routeMap)){
      throw new Error(`No route defined for ${componentType.name}`);
    }

    const url = this.routeMap[componentType.name](params);
    this.#updateUrlWithQuery(url,params);

    return new componentType();
  }

  #updateUrlWithQuery(url:string, params?: any){
    let updatedUrl = url;
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
