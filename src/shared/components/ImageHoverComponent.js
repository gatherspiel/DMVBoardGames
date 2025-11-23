/**
 * Web component used to display an image when hovering over it
 */
export class ImageHoverComponent extends HTMLElement {
  constructor() {
    super();
    this.imagePath = this.getAttribute("src");
  }
  connectedCallback() {
    this.attachShadow({ mode: "open" });
    const templateStyle = `      
      <style>
        .image-preview {
          height:500px;
          z-index: 9999;
        }
        .image-preview:hover{
          position: absolute;
          z-index: 9999;
          height:100%;
          width:100%;
        }
      </style>`;

    const template = document.createElement("template");
    template.innerHTML =
      templateStyle +
      `     
          <img class="image-preview" src="${this.imagePath}">
      `;
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }
}
