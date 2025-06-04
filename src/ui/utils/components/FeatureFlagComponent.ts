import { FEATURE_FLAGS, IS_PRODUCTION } from "../../../utils/params.ts";
import { BaseFeatureFlagComponent } from "../../../framework/components/BaseFeatureFlagComponent.ts";

export class FeatureFlagComponent extends BaseFeatureFlagComponent {
  constructor() {
    super();
  }
  // This should eventually call a feature flag API.
  isFeatureFlagEnabled(featureFlagName: string) {
    if (!(featureFlagName in FEATURE_FLAGS)) {
      console.warn(
        `Configuration not found for feature flag ${featureFlagName}`,
      );
      return false;
    }
    if (IS_PRODUCTION) {
      return FEATURE_FLAGS[featureFlagName].prodEnabled;
    } else {
      return FEATURE_FLAGS[featureFlagName].devEnabled;
    }
  }
}

if (!customElements.get("feature-flag-component")) {
  customElements.define("feature-flag-component", FeatureFlagComponent);
}
