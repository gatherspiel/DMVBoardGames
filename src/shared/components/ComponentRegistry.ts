import { LoginComponent } from "../../ui/auth/components/LoginComponent.ts";
import { OpenCreateGroupPageComponent } from "../../ui/groups/createGroup/components/OpenCreateGroupPageComponent.ts";
import { CreateGroupPageComponent } from "../../ui/groups/createGroup/components/CreateGroupPageComponent.ts";
import { EventDetailsComponent } from "../../ui/groups/event/components/EventDetailsComponent.ts";
import {CreateEventComponent} from "../../ui/groups/event/components/CreateEventComponent.ts";
import {HomepageComponent} from "../../ui/homepage/components/HomepageComponent.ts";

//This function is for dynamically creating components without having to manually import them from a HTML file
export function getComponent(componentName: string): HTMLElement {
  if (componentName === "login-component") {
    return new LoginComponent();
  }
  if (componentName === "open-create-group-page-component") {
    return new OpenCreateGroupPageComponent();
  }

  if (componentName === "create-group-page-component") {
    return new CreateGroupPageComponent();
  }

  if (componentName === "create-group-page-component") {
    return new CreateGroupPageComponent();
  }

  if (componentName === "event-details-component") {
    return new EventDetailsComponent();
  }

  if (componentName === "create-event-component") {
    return new CreateEventComponent();
  }

  if (componentName === "homepage-component"){
    return new HomepageComponent();
  }
  throw Error(
    `Component ${componentName} is not configured to be dynamically created through a JavaScript constructor`,
  );
}
