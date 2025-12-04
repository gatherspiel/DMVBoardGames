import {ImageUploadComponent} from "../../../shared/components/ImageUploadComponent.js";
customElements.define("image-upload-component",ImageUploadComponent)
export class ImageUploadExampleSection extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
     <b>HTML for adding image upload component with id and initial state</b>
        <code-display-component>
           <image-upload-component
             id="image-upload-ui"
             image-path="\${data.imageFilePath}"
           ></image-upload-component>
       </code-display-component>

        <b>Image upload component code</b>
        <code-display-component>\${this.htmlEntities(ImageUploadComponent.toString())}
       </code-display-component>

        <h2>Demo component here:</h2>
        <image-upload-component></image-upload-component>
        <br>
    `
  }
}