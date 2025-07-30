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
import {HomepageComponent} from "../../ui/homepage/components/HomepageComponent.ts";

export const GROUP_PAGE_ROUTE = "groupPageRoute";
export const GROUP_EVENT_PAGE_ROUTE ="groupEventPageRoute";
export const ADD_GROUP_EVENT_PAGE_ROUTE ="addGroupEventPageRoute";
export const DELETE_GROUP_PAGE_ROUTE ="deleteGroupPageRoute";
export const CREATE_GROUP_PAGE_ROUTE ="createGroupPageRoute";

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
    window.addEventListener("popstate", () => {
      self.removeChild(PageState.activeComponent);

      const prevState = PageState.popPrevComponent();
      if(prevState){
        window.history.replaceState({"Test":"Test"},"Test",prevState.url)

        let component;
        const componentName = prevState.component.localName;
        switch(componentName){
          case 'group-page-component':
            component = new GroupComponent()
            break;
          case 'create-group-page-component':
            component = new CreateGroupPageComponent()
            break;
          case 'delete-group-page-component':
            component = new DeleteGroupPageComponent()
            break;
          case 'create-event-component':
            component = new CreateEventComponent()
            break;
          case 'event-details-component':
            component = new EventDetailsComponent()
            break;
          case 'homepage-component':
            component = new HomepageComponent()
            break;
          default:
            throw new Error(`Invalid component with class name ${componentName}`)
        }

        PageState.activeComponent = component;
        self.appendChild(component);
      }
    });
  }

  update(route:string,params?:Record<string, string>){
    clearRequestStores();
    clearComponentStores();
    this.removeChild(PageState.activeComponent)

    PageState.pushComponentToHistory(PageState.activeComponent, window.location.href)
    const componentToAdd = this.#getComponentAndUpdateUrl(route, params);

    this.appendChild(componentToAdd)
    PageState.activeComponent = componentToAdd;
  }

  #getComponentAndUpdateUrl(route:string, params?:Record<string, string>): HTMLElement{

    if(route === GROUP_PAGE_ROUTE) {
      this.#updateUrlWithQuery("groups.html", params)
      return new GroupComponent();
    }
    else if (route === CREATE_GROUP_PAGE_ROUTE){

      const url =`groups/create.html`
      this.#updateUrlWithQuery(url);
      return new CreateGroupPageComponent();

    }
    else if (route === DELETE_GROUP_PAGE_ROUTE){
      if(params){
        const url =`groups/delete.html?name=${encodeURIComponent(params.name)}&groupId=${params.id}`
        this.#updateUrlWithQuery(url);
        return new DeleteGroupPageComponent();
      }
    } if(route=== ADD_GROUP_EVENT_PAGE_ROUTE){
      if(params){
        const url = `groups/addEvent.html?groupName=${encodeURIComponent(params.name)}&groupId=${params.id}`
        this.#updateUrlWithQuery(url);
        return new CreateEventComponent();
      }
    } else if(route === GROUP_EVENT_PAGE_ROUTE) {
      if(params){
        const url = `/groups/event.html?id=${params.id}&groupId=${params.groupId}`
        this.#updateUrlWithQuery(url);
        return new EventDetailsComponent();
      } else {
        throw new Error(`Cannot navigate to group event page route without parameters`)
      }
    }
    throw new Error(`No route defined for ${route}`);
  }

  #updateUrlWithQuery(route:string, params?: any){
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

