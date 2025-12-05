export class ShowHideComponentGuide extends HTMLElement {
  connectedCallback(){
    this.innerHTML = `
      
      <p>Note: This was only created to demonstrate how a places.js dynamic component can be created. It is recommended
      that you use the standard html details element instead.</p>
      <base-code-display-component>
      
import {BaseDynamicComponent} from "@bponnaluri/places-js";

const DEFAULT_SHOW_TEXT = "show";
const DEFAULT_HIDE_TEXT = "hide";

const SHOW_HIDE_BUTTON_ID = "show-hide-button";

/*
 A show hide component. This uses places.js with 
 shadow DOM to encapsulate event handlers and have dynamic state.
 */
export class ShowHideComponent extends BaseDynamicComponent {
  constructor() {
    super();
    this.showText = this.getAttribute("show-text") ?? DEFAULT_SHOW_TEXT
    this.hideText = this.getAttribute("hide-text") ?? DEFAULT_HIDE_TEXT

    this.content = this.innerHTML;
  }

  attachHandlersToShadowRoot(shadowRoot) {
    const self = this;

    shadowRoot.addEventListener("click",(event)=>{
      if(event.target.localName === "button"){
        if(!self.componentStore.showContent){
          self.updateData({
            buttonText: self.hideText,
            showContent: true
          })
        } else {
          self.updateData({
            buttonText: self.showText,
            showContent: false
          })
        }
      }
    })
  }

  getTemplateStyle() {
    return \`<style></style>\`
  }

  connectedCallback() {
    this.updateData({
      buttonText: this.showText,
      showContent: false
    })
  }

  render(state) {
    let html = \`<button id=\${SHOW_HIDE_BUTTON_ID}>\${state.buttonText}</button>\`

    if(state.showContent){
      html += this.content;
    }
    return html;
  }
}
      
</base-code-display-component>
    
    `
  }
}