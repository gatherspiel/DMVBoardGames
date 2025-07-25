import { BaseTemplateComponent } from "../../framework/components/BaseTemplateComponent.ts";

const template = document.createElement("template");
template.innerHTML = `
  <style>
    
    nav {
      background-color: var(--clr-lighter-blue);
      background-image: url("/assets/wood.png");
    }
        
    #logo-div img {
      max-height: 4.5rem;
      padding-left: 0.5rem;
      padding-top: 0.25rem;
    }
    
    nav a,
    #jump-to a {
      background-color: none;
      color: white;
      font-size: 1.25rem;
      padding-bottom: 0.25rem;
      padding-top: 0.25rem;
      padding-left: 1rem;
      padding-right: 1rem;
      text-decoration: none;
      transition: all 0.3s ease;
    }
    
    nav a.active,
    #jump-to a.active {
      background-color: #04aa6d;
      color: white;
            text-decoration: none;
    }
    
    nav a:hover,
    #jump-to a:hover {
      background-color: var(--clr-darker-blue);
      color: white;
            text-decoration: none;

    }
    
    nav a:last-child {
      text-wrap: nowrap;
      text-decoration: none;
    }
        
    #nav-filler {
      display: inline-block;
      background-color: var(--clr-lighter-blue); 
      flex-grow:1;
    }
   
    @media not screen and (width < 32em) {
      #logo-div {
        float: left;
      }
      .top-nav {
        display: flex;
        flex-wrap: wrap;
        margin-top: 5px;
        padding-left: 0.5rem;     
      }
      nav a + a {
        margin-left: 1px;
        border-color: white;
        border-width: 1px;
      }
    }
    
    @media screen and (width < 32em) {
      #logo-div {
        display: flex;
        justify-content: center;
      }
      .top-nav {
        display: grid;
        text-align: center;
      }
      nav a + a {
        border-color: white;
        border-width: 1px;
      }
    }
  </style>
  <div>
</div>
`;

export class NavbarComponent extends BaseTemplateComponent {
  constructor() {
    super();
    // @ts-ignore
    window.start = Date.now();
    // @ts-ignore
  }

  override getTemplate(): HTMLTemplateElement {
    return template;
  }

  override render() {

    // Closing tags are on separate lines are to prevent extra spaces between links
    return `
      <nav>
        <div id="logo-div">
          <img src="assets/logo.svg"> </img>
        </div>
        <div class="ui-section top-nav">
          <div class="top-nav">
            <a href="${window.location.origin}/index.html">Home
            </a><a class="mid-element" href="${window.location.origin}/designers.html">Local designers
            </a><a href="${window.location.origin}/print_and_play.html">Print and Play
            </a><a href="https://gatherspiel.com/vision.html">Future plans
            </a><a href="${window.location.origin}/useful_links.html">Useful Links
            </a><a href="${window.location.origin}/feedback.html">Feedback     
            </a><a href="https://gatherspiel.com/help.html">Want to help with development </a>           
          </div>
        <div id="nav-filler"></div>
        </div>

      </nav>
    `;
  }
}

if (!customElements.get("navbar-component")) {
  customElements.define("navbar-component", NavbarComponent);
}
