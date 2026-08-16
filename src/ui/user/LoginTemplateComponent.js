import { BaseTemplateComponent } from "/lib/places-js-latest.js";

export class LoginTemplateComponent extends BaseTemplateComponent{

  getTemplateStyle(){
    return `
      <link
        rel="stylesheet" 
        href="/styles/kelp.css"
      />
      <link
        rel="stylesheet"
        href="/styles/sharedHtmlOnlyStyles.css"
      />
      <link
        rel="stylesheet" 
        href="/styles/sharedHtmlAndComponentStyles.css"
      />
      <style>
        #login-component-container {
          padding-top: 0.25rem;
        }
        input {
          display: block;
        }
        #component-buttons {
          padding-top:0.5rem;
        }   
        .ui-input {
          display: inline-block;
        }
        #email {
          display: inline-block;
        }          
        @media not screen and (width < 32em) {
          #email {
          display: inline-block;
          margin-right:2.85rem;
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
      </style>
    `
  }

  render() {
    return `
      <login-component></login-component>
    `
  }

}
