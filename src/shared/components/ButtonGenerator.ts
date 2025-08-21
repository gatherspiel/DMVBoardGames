import type {BaseDynamicComponent} from "@bponnaluri/places-js";
import type {EventHandlerThunkConfig} from "@bponnaluri/places-js";
import {EVENT_HANDLER_CONFIG_KEY, EVENT_HANDLER_PARAMS_KEY} from "../Constants.ts";

export type ButtonConfig ={
  class?: string,
  type?:string,
  id?:string,
  text:string,
  component: BaseDynamicComponent,
  [EVENT_HANDLER_CONFIG_KEY]?: EventHandlerThunkConfig
  [EVENT_HANDLER_PARAMS_KEY]?:Record<string, string>
}

export function generateButton(config:ButtonConfig){
  const buttonClasses = `raised activeHover${config.class ? ` ${config.class}` : ``}`;

  const event = config[EVENT_HANDLER_CONFIG_KEY];
  return `
    <button 
      class="${buttonClasses}"
      name="action"
      value="${config.text}"
      ${event ? config.component.createEvent(config[EVENT_HANDLER_CONFIG_KEY], "click",config[EVENT_HANDLER_PARAMS_KEY]) : ``}
      ${config.type ?? `type=${config.type}`}>
      
      <span class="shadow"></span>
       <span class="edge"></span>
       <span class="front" ${config.id ? `id="${config.id}"`: ``}>
          ${config.text} 
        </span>   
    </button>
  `
}

export function generateButtonForEditPermission(config:ButtonConfig){

  const userCanEditPermission = config.component.hasUserEditPermissions();
  if(userCanEditPermission === undefined){
    throw new Error(`permissions.userCanEdit state not defined for component`);
  }
  if(!userCanEditPermission) {
    return '';
  }

  return generateButton(config);
}