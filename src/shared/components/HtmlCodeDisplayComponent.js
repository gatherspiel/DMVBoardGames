import {BaseTemplateComponent} from "@bponnaluri/places-js";
import hljs from 'https://unpkg.com/@highlightjs/cdn-assets@11.11.1/es/highlight.min.js';

export class HtmlCodeDisplayComponent extends BaseTemplateComponent {
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

    const code = this.getCode().replaceAll("&gt;",">")
      .replaceAll("&lt;","<");
    return `
    <code>
      <pre>
          ${hljs.highlightAuto(code).value}

      </pre>
    </code>
    `
  }

}