export class CodeDisplayComponent extends HTMLElement{

  //Code is from https://css-tricks.com/snippets/javascript/htmlentities-for-javascript/
  htmlEntities(str) {
    return String(str)
      .replaceAll(/&/g, "&amp;")
      .replaceAll(/</g, "&lt;")
      .replaceAll(/>/g, "&gt;")
      .replaceAll(/"/g, "&quot;");
  }

  connectedCallback(){

    /*
      If the component is nested inside another web component, then it will be recreated with the text
     */
    if(this.innerHTML.startsWith("<code><pre>")){
      return;
    }

    this.innerHTML = `<code><pre>
      ${
        this.htmlEntities(
          this.innerHTML
            .replaceAll("&gt;",">")
            .replaceAll("&lt;","<")

        )
      }
    </pre></code>`;
  }
}