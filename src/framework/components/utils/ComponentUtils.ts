import type { BaseTemplateComponent } from "../BaseTemplateComponent.ts";

export function createJSONProp(data: any) {
  let json = JSON.stringify(data);
  return json.replaceAll(" ", "\u00A0");
}

export function retrieveJSONProp(component: HTMLElement, propName: string) {
  const jsonStr = component.getAttribute(propName)!.replaceAll("\u00A0", " ");
  return JSON.parse(jsonStr);
}

export function getElementWithId(id: String): Element {
  return getElementWithSelector(`#${id}`);
}

export function getElementWithSelector(
  selector: string,
  queryScope: Document | ShadowRoot = document,
): Element {
  const element = queryScope.querySelector(selector);
  if (element === null) {
    throw new Error(`Did not find element with selector ${selector}`);
  }

  return element;
}

export function addTemplateToComponent(component: BaseTemplateComponent) {
  component.attachShadow({ mode: "open" });

  const shadowRoot = component.shadowRoot;
  if (!shadowRoot) {
    throw new Error("shadowRoot is not defined");
  }

  const template = component.getTemplate();
  component.shadowRoot?.appendChild(template.content.cloneNode(true));

  const div = component.shadowRoot?.querySelector("div");
  if (!div) {
    throw new Error("template must be defined with a <div></div> tag");
  }

  div.innerHTML = component.render();
}
