export class FormSelector {

  private formSelectors: Set<string>;
  private shadowRoot: ShadowRoot | undefined;


  constructor() {
    this.formSelectors = new Set<string>();
  }

  clearFormSelectors() {
    this.formSelectors = new Set<string>();
  }

  addFormSelector(formSelector: string) {
    this.formSelectors.add(formSelector);
  }

  setShadowRoot(shadowRoot: ShadowRoot) {
    this.shadowRoot = shadowRoot;
  }

  hasValue(formSelector: string) {
    return this.formSelectors.has(formSelector);
  }

  getValue(formSelector: string) {
    if (!this.formSelectors.has(formSelector)) {
      throw new Error(`Invalid form selector ${formSelector}`);
    }

    if(!this.shadowRoot){
      throw new Error('Shadow root not configured');
    }
    return (this.shadowRoot.getElementById(formSelector) as HTMLTextAreaElement | HTMLInputElement)?.value ?? "";
  }
}