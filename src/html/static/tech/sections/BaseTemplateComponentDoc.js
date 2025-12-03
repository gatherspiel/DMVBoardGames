export class BaseTemplateComponentDoc extends HTMLElement {
  connectedCallback(){
    this.innerHTML = `
       <p>This is a base class for rendering a component using the shadowDom without managing state-based UI with
          places.js.</p>
        <h4>Functions </h4>
        <ul>
          <li><b>render(data)</b>: Required function used to render HTML for the component.
          
          <details open="true">
              <summary>Example:</summary>
              <code-display-component>
render(userData) {
  return \`
    <h2>A component</h2>
  \`;
  }
  </details>
              </code-display-component>
          </li>
          <li><b>getTemplateStyle</b>: Required function for defining a component's style. It can also load external
            stylesheets.
            <details open="true">
              <summary>Example:</summary>
              <code-display-component>
getTemplateStyle() {
  return \`
    &ltlink 
      href="/styles/sharedStyles.css"
      rel="stylesheet" 
      type="text/css" />

    <style>
      a {
        color: white;
        text-decoration: none;;
      }
    </style>
  \`;
}
              </code-display-component>
            </details>
          </li>
        </ul>
    `
  }
}