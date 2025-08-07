import type {BaseDynamicComponent} from "../../framework/components/BaseDynamicComponent.ts";
import type {EventHandlerThunkConfig} from "../../framework/state/update/event/types/EventHandlerThunkConfig.ts";
import {hasUserEditPermissions} from "../../framework/state/data/ComponentStore.ts";

export type ButtonConfig ={
  class?: string,
  type?:string,
  text:string,
  component: BaseDynamicComponent,
  eventHandlerConfig: EventHandlerThunkConfig
  eventHandlerParams?:Record<string, string>
}

export function generateButton(config:ButtonConfig){
  const buttonClasses = `raised activeHover${config.class ? ` ${config.class}` : ``}`;
  return `
    <button 
      class="${buttonClasses}"
      name="action"
      value="${config.text}"
      ${config.component.createClickEvent(config.eventHandlerConfig, config.eventHandlerParams)}
      ${config.type ?? `type=${config.type}`}>
      
      <span class="shadow"></span>
       <span class="edge"></span>
       <span class="front">
          ${config.text} 
        </span>   
    </button>
  `
}

export function generateButtonForEditPermission(config:ButtonConfig){

  const componentStoreName = config.component.componentStoreName;
  const userCanEditPermission = hasUserEditPermissions(componentStoreName);
  if(userCanEditPermission === undefined){
    throw new Error(`permissions.userCanEdit state not defined for component state ${componentStoreName}`);
  }
  if(!userCanEditPermission) {
    return '';
  }

  return generateButton(config);
}