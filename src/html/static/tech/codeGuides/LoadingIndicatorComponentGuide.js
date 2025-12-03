export class LoadingIndicatorComponentGuide extends HTMLElement {
  connectedCallback(){
    this.innerHTML = `

          <h3>Detailed example of using loading indicator config with a custom image</h3>

          <h4>Loading config</h4>
          <code-display-component>
export class LoadingIndicatorComponent extends HTMLElement {
  constructor() {
    super();
    this.imagePath = this.getAttribute("image-path");
  }
  connectedCallback() {
    this.attachShadow({ mode: "open" });
    const templateStyle = \`
      <style>
        #meeple-one {
          position: absolute;
          height:4px;
          width:4px;
          top:50px;
          left:25px;
        }
        #meeple-two {
          position: absolute;
          top:43px;
          left:43px;
        }
        #meeple-three {
          position: absolute;
          top:25px;
          left:50px;
        }
        #meeple-four {
          position: absolute;
          top:7px;
          left:43px;
        }
        #meeple-five {
          position: absolute;
          top:0;
          left:25px;
        }
        #meeple-six {
          position: absolute;
          top:7px;
          left:7px;
        }
        #meeple-seven {
          position: absolute;
          top:25px;
          left:0;
        }
        #meeple-seven img {
          height:3px;
          width:3px;
        }
        #meeple-six img {
          height:5px;
          width:5px;
        }
        #meeple-five img {
          height:7px;
          width:7px;
        }
        #meeple-four img {
          height:9px;
          width:9px;
        }
        #meeple-three img {
          height:11px;
          width:11px;
        }
        #meeple-two img {
          height:13px;
          width:13px;
        }
        #meeple-one img {
          height:15px;
          width:15px;
        }
        .loader {
          animation: l27 1s infinite steps(8);
          height: 65px;
          margin-left:auto;
          margin-right:auto;
          margin-top:2rem;
          width: 65px;
        }
        @keyframes l27 {
          100% {
            transform-origin: 32.5px 32.5px;
            transform: rotate(1turn);
          }
        }
        .meeple {
          width:15px;
          height:15px;
          animation: l28 1s infinite steps(8);
        }
        @keyframes l28 {
          100% {
            transform-origin: 7.5px 7.5px;
            transform: rotate(-1turn)
          }
        }
      </style>\`;

    const template = document.createElement("template");
    template.innerHTML =
      templateStyle + \`
        <div class="loader">
          <div class="meeple" id="meeple-one">
            <img src="${this.imagePath}">
          </div>
          <div class="meeple"  id="meeple-two">
            <img src="${this.imagePath}">
          </div>
          <div class="meeple"  id="meeple-three">
            <img src="${this.imagePath}">
          </div>
          <div class="meeple"  id="meeple-four" >
            <img src="${this.imagePath}">
          </div>
          <div class="meeple"  id="meeple-five" >
            <img src="${this.imagePath}">
          </div>
          <div class="meeple"  id="meeple-six" >
            <img src="${this.imagePath}">
          </div>
          <div class="meeple"  id="meeple-seven" >
            <img src="${this.imagePath}">
          </div>
        </div>
    \`;
    this.shadowRoot.appendChild(template.content.cloneNode(true));
    }
}
customElements.define(
  "loading-indicator-component",
  LoadingIndicatorComponent,
);
</code-display-component>

<code-display-component>
export const LOADING_INDICATOR_CONFIG = {
  generateLoadingIndicatorHtml: () => {
    return \`
      <loading-indicator-component
        image-path="/assets/images/meeple_small.png"
      >
      </loading-indicator-component>
    \`;
    },
  minTimeMs: 500,
};

          </code-display-component>    
    `
  }
}