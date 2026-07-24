import { BaseTemplateComponent } from "/lib/places-js-latest.js";

const CREATE_ACCOUNT_ID = "complete-registration";
const CREATE_ACCOUNT_ID_DISABLED = "complete-registration-disabled";

export class CreateAccountTemplateComponent extends BaseTemplateComponent {


  getTemplateStyle() {
    return `  
      <link rel="stylesheet" type="text/css"  href="/styles/kelp.css"/>
      <link rel="stylesheet" type="text/css"  href="/styles/sharedHtmlAndComponentStyles.css"/>
      <style>
       #{AGREE_RULES_ID} {
          font-weight:600;
        }
         #${CREATE_ACCOUNT_ID}{
          display:block;
        } 
        #${CREATE_ACCOUNT_ID_DISABLED} .front {
          background: gray;
        }
        #email {
          display: inline-block;
        }
        #component-buttons {
          padding-top:0.5rem;
        }   
        #ui-input input {
          display: block;
        }
        #username-input,#password-input,#confirm-password-input {
          width:20rem;
        }
 
        .${CREATE_ACCOUNT_ID},.${CREATE_ACCOUNT_ID_DISABLED}{
          margin-top:0.5rem;
        }
        .ui-input {
          display: block;
        }  
       
       @media not screen and (width < 32em) { 
          #email {
            display: inline-block;
          }
        }
        
        @media screen and (width < 32em) {
          #login-component-container {
            text-align: center;
          }
          .login-element {
            font-size:1rem;
          }
        }
      </style>`;
  }

}
