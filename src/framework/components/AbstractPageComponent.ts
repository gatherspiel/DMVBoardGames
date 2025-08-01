
import { getComponent } from "../../shared/components/ComponentRegistry.ts";
import { setupStateFields} from "../../shared/InitGlobalStateConfig.ts";
import {PageState} from "../state/PageState.ts";

import {clearRequestStores} from "../state/data/RequestStore.ts";
import {clearComponentStores} from "../state/data/ComponentStore.ts";
import type {BaseDynamicComponent} from "./BaseDynamicComponent.ts";

//@ts-ignore
import {HomepageComponent} from "../../ui/homepage/components/HomepageComponent.ts";

export abstract class AbstractPageComponent extends HTMLElement {

  static #currentComponent: AbstractPageComponent;
  routeMap:Record<string, (params:any)=>string>;


  constructor() {
    super();

    setupStateFields();
    const componentName: string = this.getAttribute("componentName") ?? "";

    const self = this;

    this.getCommonComponents().forEach(function(component){
      self.appendChild(component);
    })
    this.routeMap = this.getRouteMap();

    PageState.activeComponent = getComponent(componentName);

    this.appendChild(PageState.activeComponent);

    AbstractPageComponent.#currentComponent = this;
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

  abstract getCommonComponents(): HTMLElement[];

  abstract getRouteMap():Record<string, (params:any)=>string>;

  static updateRoute(componentType:typeof BaseDynamicComponent, params?:Record<string, string>){
    AbstractPageComponent.#currentComponent.update(componentType, params);
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


