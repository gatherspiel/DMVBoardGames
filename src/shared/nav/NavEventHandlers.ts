import {GroupComponent} from "../../ui/groups/viewGroup/components/GroupComponent.ts";
import {EventDetailsComponent} from "../../ui/groups/events/components/EventDetailsComponent.ts";
import {CreateEventComponent} from "../../ui/groups/events/components/CreateEventComponent.ts";
import {DeleteGroupPageComponent} from "../../ui/groups/deleteGroup/DeleteGroupPageComponent.ts";
import {CreateGroupPageComponent} from "../../ui/groups/createGroup/components/CreateGroupPageComponent.ts";
import {AbstractPageComponent} from "@bponnaluri/places-js";
import type {EventHandlerThunkConfig} from "@bponnaluri/places-js";

export const VIEW_GROUP_PAGE_HANDLER_CONFIG: EventHandlerThunkConfig = {
  eventHandler: event => {
    console.log("Click time:" + Date.now());
    //@ts-ignore
    AbstractPageComponent.updateRoute(GroupComponent, event.params)
  }
}

export const VIEW_GROUP_EVENT_PAGE_HANDLER_CONFIG: EventHandlerThunkConfig = {
  eventHandler: event =>
    AbstractPageComponent.updateRoute(EventDetailsComponent, event.params)
}

export const CREATE_EVENT_PAGE_HANDLER_CONFIG: EventHandlerThunkConfig = {
  eventHandler: event =>
    AbstractPageComponent.updateRoute(CreateEventComponent, event.params)
}

export const DELETE_GROUP_PAGE_HANDLER_CONFIG: EventHandlerThunkConfig = {
  eventHandler: event =>
    AbstractPageComponent.updateRoute(DeleteGroupPageComponent, event.params)
}


export const CREATE_GROUP_PAGE_HANDLER_CONFIG: EventHandlerThunkConfig = {
  eventHandler: event =>
    AbstractPageComponent.updateRoute(CreateGroupPageComponent, event.params)
}


