import type {BaseDynamicComponent, EventHandlerThunkConfig} from "@bponnaluri/places-js";
import {EVENT_HANDLER_CONFIG_KEY, EVENT_HANDLER_PARAMS_KEY} from "../Constants.ts";

export type LinkButtonConfig = {
  class?:string
  text: string
  url: string
}

export type ButtonConfig = {
  class?: string,
  component?:BaseDynamicComponent,
  id?:string,
  text:string,
  type?:string,
  [EVENT_HANDLER_CONFIG_KEY]?: EventHandlerThunkConfig
  [EVENT_HANDLER_PARAMS_KEY]?:Record<string, string>
}

export function generateLinkButton(config:LinkButtonConfig){
  return `
    <div class="raised ${config.class ?? ''}">
      <span class="shadow"></span>
       <span class="edge"></span>
       <span class="front">
          <a onclick="event.stopPropagation()" href=${config.url}>${config.text} </a>
       </span>   
    </div>
  `
}

export function generateButton(config:ButtonConfig){
  const buttonClasses = `raised activeHover${config.class ? ` ${config.class}` : ``}`;

  const event = config[EVENT_HANDLER_CONFIG_KEY];
  return `
    <button 
      class="${buttonClasses}"
      name="action"
      value="${config.text}"
      ${event && config.component ? config.component.createEvent(config[EVENT_HANDLER_CONFIG_KEY], "click",config[EVENT_HANDLER_PARAMS_KEY]) : ``}
      ${config.type ?? `type=${config.type}`}>
      
      <span class="shadow"></span>
       <span class="edge"></span>
       <span class="front" ${config.id ? `id="${config.id}"`: ``}>${config.text}</span>   
    </button>
  `
}

export function generateButtonForEditPermission(config:ButtonConfig){

  const userCanEditPermission = config.component?.hasUserEditPermissions();
  if(userCanEditPermission === undefined){
    throw new Error(`permissions.userCanEdit state not defined for component`);
  }
  if(!userCanEditPermission) {
    return '';
  }

  return generateButton(config);
}