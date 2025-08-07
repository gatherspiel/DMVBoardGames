import type {FormInputConfig} from "./components/types/FormInputConfig.ts";

export class FormSelector {

  private formSelectors: Set<string>;
  private shadowRoot: ShadowRoot | undefined;

  constructor() {
    this.formSelectors = new Set<string>();
  }

  clearFormSelectors() {
    this.formSelectors = new Set<string>();
  }

  setShadowRoot(shadowRoot: ShadowRoot) {
    this.shadowRoot = shadowRoot;
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

  generateInputFormSelector(formConfig:FormInputConfig){
    let formValue = formConfig.value;
    if(!formValue && this.formSelectors.has(formConfig.id)){
      formValue = this.getValue(formConfig.id);
    }

    this.formSelectors.add(formConfig.id);
    return `
      <label for=${formConfig.id}>${formConfig.componentLabel}</label>
      ${formConfig.lineBreakAfterLabel !== false? `<br>` : ''}
      <input
        ${formConfig.className ? `class="${formConfig.className}"` : ``}
        id=${formConfig.id}
        name=${formConfig.id}
        type=${formConfig.inputType}
        value="${formValue}"
        />
        <br>
    `
  }

  generateTextInputFormItem(formConfig:FormInputConfig){
    let formValue = formConfig.value;
    if(!formValue && this.formSelectors.has(formConfig.id)){
      formValue = this.getValue(formConfig.id);
    }
    this.formSelectors.add(formConfig.id);

    return `
      <label for=${formConfig.id}>${formConfig.componentLabel}</label>
      ${formConfig.lineBreakAfterLabel !== false? `<br>` : ''}
      <textarea
        ${formConfig.className ? `class="${formConfig.className}"` : ``}
        id=${formConfig.id}
        name=${formConfig.id}
        type=${formConfig.inputType}
        />${formValue}
      </textarea>
      <br>
    `
  }

}