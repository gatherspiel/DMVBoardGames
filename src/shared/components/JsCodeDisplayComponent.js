import {BaseTemplateComponent} from "@bponnaluri/places-js";
import hljs from 'https://unpkg.com/@highlightjs/cdn-assets@11.11.1/es/highlight.min.js';


/**
 * This component converts code into a format for display with syntax highlighting
 *
 * Note: If HTML is contained in the code, it should be escaped before adding it to this component for display
 */
export class JsCodeDisplayComponent extends BaseTemplateComponent{

  constructor() {
    super();
    this.content = this.innerHTML.replaceAll("&gt;",">")
        .replaceAll("&lt;","<");

    this.innerHTML = "";
  }

  disconnectedCallback(){
    this.innerHTML = `<p>Potato</p>`
  }
  getTemplateStyle(){
    return `
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.1/styles/default.min.css">

      <style>
        pre {
          background-color:#f6f8fa;
        }
      </style>
    `
  }

  render(){


    return `
    <code>
      <pre>
          ${hljs.highlightAuto(this.content).value}

      </pre>
    </code>
    `
  }
}