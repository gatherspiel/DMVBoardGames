
export class ImageUploadComponent extends HTMLElement {

  constructor(){
    super();

    const filePath = this.getAttribute("image-path");
    if(filePath === null || filePath === undefined || filePath === "null" || filePath === "undefined" || filePath.length === 0){
      this.setAttribute("image-path","");
    }
    this.addEventListener("change", this.uploadImage)
    this.addEventListener("click",this.deleteImage)
  }

  //This was an image that was uploaded in the current session with base64 encoding.
  getImage(){
    if(this.getAttribute("image-path")?.includes("base64")) {
      return this.getAttribute("image-path")
    }
  }

  //This is an image that was already uploaded.
  getImageFilePath(){
    if(!this.getAttribute("image-path")?.includes("base64")) {
      return this.getAttribute("image-path") || '';
    }
  }

  deleteImage(event){
    const self = this;

    if(event.target.id === 'remove-uploaded-image'){
      self.setAttribute("image-path","");
      self.innerHTML = self.#getHtml();
      event.preventDefault();
    }
  }

  uploadImage(event){

    const self = this;
    if(event.target.id === 'upload-image-input'){

      let file = event.target.files[0];
      let reader = new FileReader();

      reader.readAsDataURL(file);
      reader.onload = function () {
        if(reader.result !== null) {
          self.setAttribute("image-path",reader.result.toString())
          self.innerHTML = self.#getHtml();
        }
      }
    }
  }

  connectedCallback(){
    this.innerHTML = this.#getHtml();
  }

  #getHtml(){

    const filePath = this.getAttribute("image-path")
    return `
      <label class=""><b>Upload image(optional)</b></label>
      <input class="image-upload-input" id="upload-image-input" name="image-upload-input" accept="image/png, image/jpeg" title="test" type="file" />
      ${(filePath !== null && filePath !== undefined && filePath !== "null" && filePath !== "undefined" && filePath.length > 0) ?
      `
          <label style="display:inline-block">Remove image</label>
          <button id="remove-uploaded-image" style="display:inline-block;">-</button>
          <br>
          <label class=""><b>Current image</b></label>` :
      ``
    }
      <img id="image-preview" 
        src="${
          this.getAttribute("image-path")}"
          style="width:400px"
          alt="">
      `
  }
}

