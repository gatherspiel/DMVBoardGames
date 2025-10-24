import {
  BaseDynamicComponent,
} from "@bponnaluri/places-js";
import {LOGIN_STORE} from "../../ui/auth/data/LoginStore.ts";
import {LOGOUT_STORE} from "../../ui/auth/data/LogoutStore.ts";
import {USER_DATA_STORE} from "../../ui/auth/data/UserDataStore";
import {IMAGE_BUCKET_URL} from "../Params";
const SIGN_OUT_LINK_ID = "signout-link"
export class LoginStatusComponent extends BaseDynamicComponent {
  constructor() {
    super([{
        dataStore:LOGIN_STORE,
        fieldName: "auth_data"
      },{
        componentReducer: (data:any)=>{
          if(data.imageFilePath){
            data.imageFilePath = IMAGE_BUCKET_URL + data.imageFilePath;
          }
          return data;
        },
        dataStore: USER_DATA_STORE,
        fieldName: "user_data",
      }]
    );
  }

  override getTemplateStyle(): string {
    return `
      <link rel="stylesheet" type="text/css" href="/styles/sharedHtmlAndComponentStyles.css"/>

      <style>
        a {
          color: white;
          text-decoration: none;;
        }
        #user-image-icon {
          clip-path: circle();
          height:3rem;
        }
        @media not screen and (width < 32em) {
          a {
            margin-left:2rem;
          }
          p {
            display: inline-block;
          }
          #links-container div{
            display: inline-block;
          }
          #user-text-container {
            margin-top:0.5rem;
            text-align: right;
          }
          #user-text {
            font-size:1rem;
          }
          #user-image-container, #username-container {
            display: inline-block;
          }
          #username-container {
            font-size:1rem;
            margin-left: 1rem;
            padding-top:1rem;
          }
          #user-text-container-filler {
            flex-grow:1;
          }
          #user-text-container-inner {
            display: flex;
          }
          .raised {
            display: inline-block;
          }
     
        }
        @media screen and (width < 32em) {
          p {
            margin-top:0;
          }
          .raised {
            margin-top:0.5rem;
          }
          a {
            display: block;
            line-height: 1.25;
            margin-bottom:0.5rem;
          }
          #user-text-container {
            margin-bottom:1.5rem;
          }
          #user-text {
            margin-top:1rem;
          }
        }  
      </style>
    `;
  }

  override attachHandlersToShadowRoot(shadowRoot?: any){
    shadowRoot.addEventListener("click",(event:any)=>{
      if(event.target.id === SIGN_OUT_LINK_ID) {
        LOGOUT_STORE.fetchData({}, LOGIN_STORE)
      }
    })
  }

  override render(data:any){

    const authData = data["auth_data"];
    const userData = data["user_data"];
    if(authData.loggedIn){
      return `
      <div id="login-status-container">
        <div id="links-container">
           <div id="${SIGN_OUT_LINK_ID}">Sign out</div>
          <div><a href="/beta/editProfile.html">Edit profile</a></div>
        </div>

        <div id="user-text-container">
          <div id="user-text-container-inner">
              <div id="user-text-container-filler"></div>
              <div id="user-image-container">
                ${userData.imageFilePath ? `<img id="user-image-icon" src="${userData.imageFilePath}"></img>` : ``}
              </div>
              <div id="username-container">
                <span>${userData.username || authData.data.user.email}</span>
                <div></div>
              </div>
          </div>
        </div>
  </div>
      `
    }
    return `
      <a href="/beta/login.html">Login</a>
      <a href="/beta/createAccount.html">Create account</a>
    `;
  }
}

