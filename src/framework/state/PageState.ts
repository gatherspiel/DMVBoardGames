import type {BaseDynamicComponent} from "../components/BaseDynamicComponent.ts";

export type PageStateItem = {
  component: HTMLElement,
  componentType: typeof BaseDynamicComponent,
  url: string
}

export class PageState {
  static activeComponent: HTMLElement;
  static activeComponentType: typeof BaseDynamicComponent;

  static pageLoaded: boolean;

  static #prevComponents: PageStateItem[] = [];

  static popPrevComponent(): PageStateItem | undefined {
    return PageState.#prevComponents.pop();
  }

  static pushComponentToHistory(component: HTMLElement, url: string, componentType: typeof BaseDynamicComponent) {
    PageState.#prevComponents.push({
      component: component,
      componentType: componentType,
      url: url
    });
  }
}
