import type {EventHandlerThunkConfig} from "../../framework/state/update/event/types/EventHandlerThunkConfig.ts";
import {
  PageComponent
} from "../components/PageComponent.ts";
import {GroupComponent} from "../../ui/groups/viewGroup/components/GroupComponent.ts";
import {EventDetailsComponent} from "../../ui/groups/event/components/EventDetailsComponent.ts";
import {CreateEventComponent} from "../../ui/groups/event/components/CreateEventComponent.ts";
import {DeleteGroupPageComponent} from "../../ui/groups/deleteGroup/DeleteGroupPageComponent.ts";
import {CreateGroupPageComponent} from "../../ui/groups/createGroup/components/CreateGroupPageComponent.ts";

export const VIEW_GROUP_PAGE_HANDLER_CONFIG: EventHandlerThunkConfig = {
  eventHandler: function(event){
    PageComponent.updateRoute(GroupComponent, event.params);
  }
}

export const VIEW_GROUP_EVENT_PAGE_HANDLER_CONFIG: EventHandlerThunkConfig = {
  eventHandler: function(event){
    PageComponent.updateRoute(EventDetailsComponent, event.params);
  }
}

export const CREATE_EVENT_PAGE_HANDLER_CONFIG: EventHandlerThunkConfig = {
  eventHandler: function(event){
    PageComponent.updateRoute(CreateEventComponent, event.params);
  }
}

export const DELETE_GROUP_PAGE_HANDLER_CONFIG: EventHandlerThunkConfig = {
  eventHandler: function(event){
    PageComponent.updateRoute(DeleteGroupPageComponent, event.params);
  }
}


export const CREATE_GROUP_PAGE_HANDLER_CONFIG: EventHandlerThunkConfig = {
  eventHandler: function(event){
    PageComponent.updateRoute(CreateGroupPageComponent, event.params);
  }
}
