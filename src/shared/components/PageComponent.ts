import {GroupPageComponent} from "../../ui/groups/viewGroup/GroupPageComponent.ts";
import {CreateGroupPageComponent} from "../../ui/groups/CreateGroupPageComponent.ts";
import {DeleteGroupPageComponent} from "../../ui/groups/DeleteGroupPageComponent.ts";
import {CreateEventComponent} from "../../ui/groups/events/CreateEventComponent.ts";
import {EventDetailsComponent} from "../../ui/groups/events/EventDetailsComponent.ts";

//@ts-ignore
import {HomepageComponent} from "../../ui/homepage/components/HomepageComponent.ts";
//@ts-ignore
import {LoginComponent} from "../../ui/auth/LoginComponent.ts";

//@ts-ignore
import {LoginStatusComponent} from "./LoginStatusComponent.ts";
import {AbstractPageComponent} from "@bponnaluri/places-js";

export class PageComponent extends AbstractPageComponent {

  override getCommonComponents(): HTMLElement[] {
    return [];
  }

  override getRouteMap(): Record<string, (params: any) => string> {
    return {
      [GroupPageComponent.name]: () => "groups.html",
      [CreateGroupPageComponent.name]: ()=>"groups/create.html",
      [DeleteGroupPageComponent.name]: (params:any)=>
        `groups/delete.html?name=${encodeURIComponent(params.name)}&groupId=${params.id}`
      ,
      [CreateEventComponent.name]: (params:any)=>
        `groups/addEvent.html?name=${encodeURIComponent(params.name)}&groupId=${params.id}`
      ,
      [EventDetailsComponent.name]: (params:any)=>
        `/groups/event.html?id=${params.id}&groupId=${params.groupId}`
    }
  }
}


if (!customElements.get("page-component")) {
  customElements.define("page-component", PageComponent);
}