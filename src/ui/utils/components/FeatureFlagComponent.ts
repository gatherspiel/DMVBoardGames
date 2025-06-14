import { LoginComponent } from "../../auth/components/LoginComponent.ts";
import {
  FEATURE_FLAGS,
  IS_PRODUCTION,
  IS_TEST,
} from "../../../utils/params.ts";
import { OpenCreateGroupPageComponent } from "../../groups/createGroup/components/OpenCreateGroupPageComponent.ts";

export class FeatureFlagComponent extends HTMLElement {
  constructor() {
    super();

    const componentName: string = this.getAttribute("componentName") ?? "";
    const featureFlagName: string = this.getAttribute("featureFlagName") ?? "";

    if (isFeatureFlagEnabled(featureFlagName)) {
      this.appendChild(getComponent(componentName));
    }
  }
}

if (!customElements.get("feature-flag-component")) {
  customElements.define("feature-flag-component", FeatureFlagComponent);
}

function getComponent(componentName: string): HTMLElement {
  if (componentName === "login-component") {
    return new LoginComponent();
  }
  if (componentName === "open-create-group-page-component") {
    return new OpenCreateGroupPageComponent();
  }
  throw Error(
    `Component ${componentName} is not configured to work with feature-flag-component`,
  );
}

export function isFeatureFlagEnabled(name: string): boolean {
  if (!(name in FEATURE_FLAGS)) {
    console.error(`Feature flag with name ${name} is not defined`);
    return false;
  }
  if (IS_PRODUCTION) {
    return FEATURE_FLAGS[name].prodEnabled;
  }
  if (IS_TEST) {
    return FEATURE_FLAGS[name].testEnabled;
  }
  return FEATURE_FLAGS[name].devEnabled;
}
