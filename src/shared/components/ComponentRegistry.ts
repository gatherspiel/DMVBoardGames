

export function getComponent(componentName: string): HTMLElement {

  const item = customElements.get(componentName);
  if(item){
    return new item.prototype.constructor()
  }

  throw Error(
    `Component ${componentName} is not configured to be dynamically created through a JavaScript constructor`,
  );
}
