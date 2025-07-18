import { NavbarComponent } from "../../ui/static/navbarComponent.ts";
import { LoginComponent } from "../../ui/auth/components/LoginComponent.ts";
import { getComponent } from "./ComponentRegistry.ts";
import { setupStateFields} from "../InitGlobalStateConfig.ts";


export class PageComponent extends HTMLElement {

  static currentComponent: PageComponent;

  activeComponent: HTMLElement;

  constructor() {
    super();

    setupStateFields();
    const componentName: string = this.getAttribute("componentName") ?? "";
    this.appendChild(new NavbarComponent());
    this.appendChild(new LoginComponent());

    this.activeComponent = getComponent(componentName);
    this.appendChild(getComponent(componentName));

    PageComponent.currentComponent = this;

  }

  update(){
    this.removeChild(this.activeComponent)
  }
}


if (!customElements.get("page-component")) {
  customElements.define("page-component", PageComponent);
}
