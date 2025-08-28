import {GroupPageComponent} from "../../ui/groups/viewGroup/components/GroupPageComponent.ts";
import {AbstractPageComponent} from "@bponnaluri/places-js";
import type {EventHandlerThunkConfig} from "@bponnaluri/places-js";

export const VIEW_GROUP_PAGE_HANDLER_CONFIG: EventHandlerThunkConfig = {
  eventHandler: event => {
    //@ts-ignore
    AbstractPageComponent.updateRoute(GroupPageComponent, event.params)
  }
}

