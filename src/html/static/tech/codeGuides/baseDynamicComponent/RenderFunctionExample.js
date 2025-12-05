import {HtmlCodeDisplayComponent} from "../../../../../shared/components/HtmlCodeDisplayComponent.js";

export class RenderFunctionExample extends HtmlCodeDisplayComponent {
  getCode(){
    return `
render(userData) {
  return \`
  <div id="login-status-container">
    <div id="links-container">
      <div id="\${SIGN_OUT_LINK_ID}">Sign out</div>

      <div id="edit-profile-div">
        <a href="/html/user/editProfile.html">
          Edit profile
        </a>
      
      </div>
    </div>
    <div id="user-text-container">
      <div id="user-text-container-inner">
        <div id="user-text-container-filler"></div>
        <div id="user-image-container">
          \${userData.imageFilePath ?
            \`<img 
                id="user-image-icon" 
                src="\${userData.imageFilePath}"/>\` 
            : \`\`
          
        }
        </div>
        <div id="username-container">
          <span>
            \${userData.username || 
             this.getAttribute("email")}
          </span>
        </div>
      </div>
    </div>
  </div>
\`;`

  }
}