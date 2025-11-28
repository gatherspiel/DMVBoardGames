import {BaseTemplateComponent} from "@bponnaluri/places-js";
import hljs from 'https://unpkg.com/@highlightjs/cdn-assets@11.11.1/es/highlight.min.js';

export class CodeDisplayComponent extends BaseTemplateComponent{

  constructor() {
    super();
    this.content = this.innerHTML.replaceAll("&gt;",">")
        .replaceAll("&lt;","<");
  }
  //Code is from https://css-tricks.com/snippets/javascript/htmlentities-for-javascript/
  htmlEntities(str) {
    return String(str)
      .replaceAll(/&/g, "&amp;")
      .replaceAll(/</g, "&lt;")
      .replaceAll(/>/g, "&gt;")
      .replaceAll(/"/g, "&quot;");
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