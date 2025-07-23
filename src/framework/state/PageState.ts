
export type PageStateItem = {
  component: HTMLElement,
  url: string
}

export class PageState {
  static activeComponent: HTMLElement;
  static pageLoaded: boolean;

  static #prevComponents: PageStateItem[] = [];

  static popPrevComponent(): PageStateItem | undefined {
    return PageState.#prevComponents.pop();
  }

  static pushComponentToHistory(component: HTMLElement, url: string) {
    PageState.#prevComponents.push({
      component: component,
      url: url
    });
  }
}
