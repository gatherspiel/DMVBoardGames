import {AbstractPageComponent} from "../../framework/components/AbstractPageComponent.ts";
import {LoginComponent} from "../../ui/auth/components/LoginComponent.ts";
import {GroupComponent} from "../../ui/groups/viewGroup/components/GroupComponent.ts";
import {CreateGroupPageComponent} from "../../ui/groups/createGroup/components/CreateGroupPageComponent.ts";
import {DeleteGroupPageComponent} from "../../ui/groups/deleteGroup/DeleteGroupPageComponent.ts";
import {CreateEventComponent} from "../../ui/groups/event/components/CreateEventComponent.ts";
import {EventDetailsComponent} from "../../ui/groups/event/components/EventDetailsComponent.ts";


export class PageComponent extends  AbstractPageComponent {

  override getCommonComponents(): HTMLElement[] {
    return [new LoginComponent()];
  }

  override getRouteMap(): Record<string, (params: any) => string> {
    return {
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
  }
}


if (!customElements.get("page-component")) {
  customElements.define("page-component", PageComponent);
}