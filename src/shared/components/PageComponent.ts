import {AbstractPageComponent} from "../../framework/components/AbstractPageComponent.ts";
import {GroupComponent} from "../../ui/groups/viewGroup/components/GroupComponent.ts";
import {CreateGroupPageComponent} from "../../ui/groups/createGroup/components/CreateGroupPageComponent.ts";
import {DeleteGroupPageComponent} from "../../ui/groups/deleteGroup/DeleteGroupPageComponent.ts";
import {CreateEventComponent} from "../../ui/groups/events/components/CreateEventComponent.ts";
import {EventDetailsComponent} from "../../ui/groups/events/components/EventDetailsComponent.ts";

//@ts-ignore
import {HomepageComponent} from "../../ui/homepage/components/HomepageComponent.ts";
//@ts-ignore
import {LoginComponent} from "../../ui/auth/components/LoginComponent.ts";

//@ts-ignore
import {LoginStatusComponent} from "./LoginStatusComponent.ts";

export class PageComponent extends  AbstractPageComponent {

  override getCommonComponents(): HTMLElement[] {
    return [];
  }

  override getRouteMap(): Record<string, (params: any) => string> {
    return {
      [GroupComponent.name]: () => "groups.html",
      [CreateGroupPageComponent.name]: ()=>"groups/create.html",
      [DeleteGroupPageComponent.name]: (params:any)=>
        `groups/delete.html?name=${encodeURIComponent(params.name)}&groupId=${params.id}`
      ,
      [CreateEventComponent.name]: (params:any)=>
        `groups/delete.html?name=${encodeURIComponent(params.name)}&groupId=${params.id}`
      ,
      [EventDetailsComponent.name]: (params:any)=>
        `/groups/event.html?id=${params.id}&groupId=${params.groupId}`
    }
  }
}


if (!customElements.get("page-component")) {
  customElements.define("page-component", PageComponent);
}