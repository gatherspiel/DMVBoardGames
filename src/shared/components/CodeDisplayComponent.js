export class CodeDisplayComponent extends HTMLElement{

  //Code is from https://css-tricks.com/snippets/javascript/htmlentities-for-javascript/
  htmlEntities(str) {
    return String(str)
      .replaceAll(/&/g, "&amp;")
      .replaceAll(/</g, "&lt;")
      .replaceAll(/>/g, "&gt;")
      .replaceAll(/"/g, "&quot;");
  }

  //TODO: Add syntax highlighting.
  connectedCallback(){
    this.innerHTML = `<code><pre>
      ${this.htmlEntities(this.innerHTML.replaceAll("&gt;",">"))}
    </pre></code>`;
  }
}