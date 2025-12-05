import {SetupComponentExample} from "../codeGuides/setup/SetupComponentExample.js";
import {SetupHtmlExample} from "../codeGuides/setup/SetupHtmlExample.js";

customElements.define('setup-component-example',SetupComponentExample);
customElements.define('setup-html-example',SetupHtmlExample);

export class SetupInstructionsComponent extends HTMLElement {
  connectedCallback(){
    this.innerHTML = `
      <details open>
        <summary>Installing framework</summary>
          <h4>Using npm</h4>
          <ul>
            <li>
              <pre>npm install @bponnaluri/places-js</pre>
            </li>
          </ul>

          
          <h4>Building from source</h4>
          <ul>
            <li>Clone the places.js repo located <a href="https://github.com/gatherspiel/places-js">here</a></li>
            <li>
               Run the following commands<pre>npm run build</pre>  <pre>npm install</pre>
            </li>
            <li>Copy the generated places-js.esm.js file to your project.</li>
          </ul>
         
      </details>
      
      <details open>
        <summary>Creating your first component</summary>
        
        Below is an example of how to create a user feeedback component 
        
        <h4>HTML</h4>
        <setup-html-example></setup-html-example>
        
        <b>FeedbackComponent.js</b>
        <setup-component-example></setup-component-example>
      </details>

    </details>
      
    `
  }
}