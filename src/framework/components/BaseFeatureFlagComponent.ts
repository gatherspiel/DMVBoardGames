export abstract class BaseFeatureFlagComponent extends HTMLElement {
  featureFlagName: string;
  protected constructor() {
    super();
    this.featureFlagName = "";
  }

  abstract isFeatureFlagEnabled(featureFlagName: string): boolean;

  async connectedCallback() {
    const featureFlagName = this.getAttribute("featureFlagName");

    if (!featureFlagName) {
      throw new Error(
        "FeatureFlagComponent must have a featureFlagName property",
      );
    }
    if (this.isFeatureFlagEnabled(featureFlagName)) {
      await this.showComponent();
    }
  }

  async showComponent() {
    const componentPath = this.getAttribute("componentPath");
    if (!componentPath) {
      throw new Error(
        "FeatureFlagComponent must have a componentPath property",
      );
    }
    const componentImport = await import(componentPath);

    const pathSplit = componentPath.split("/");
    const className = pathSplit[pathSplit.length - 1].split(".")[0];

    let htmlTagName = "";
    for (let i = 0; i < className.length; i++) {
      const char = className.charAt(i);
      if (char.toUpperCase() === char) {
        if (i !== 0) {
          htmlTagName += "-";
        }
        htmlTagName += char.toLowerCase();
      } else {
        htmlTagName += char;
      }
    }
    if (!customElements.get(htmlTagName)) {
      customElements.define(htmlTagName, componentImport[className]);
    }
    this.innerHTML = `<${htmlTagName}></${htmlTagName}>`;
  }
}
