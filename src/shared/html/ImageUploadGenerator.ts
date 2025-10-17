
export const REMOVE_IMAGE_FROM_GROUP_ID = "remove-image-from-group-id"
export function generateImageUploadForm(imagePath:string, inputId:string){
  return `
    <label>Upload image</label>
    <input class="image-upload-input" id="${inputId}" name="image-upload-input" accept="image/png, image/jpeg" title="test" type="file" />
    ${imagePath ?
      `
        <label style="display:inline-block">Remove image</label>
        <button id="${REMOVE_IMAGE_FROM_GROUP_ID}">-</button>
        <br>
        <label class="form-field-header">Current image</label>` :
    ``
    }
    <img id="image-preview" 
      src="${imagePath}"
      style="width:400px"
      alt="">
  `
}