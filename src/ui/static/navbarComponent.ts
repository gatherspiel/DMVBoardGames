import { BaseTemplateComponent } from "../../framework/components/BaseTemplateComponent.ts";

const template = document.createElement("template");
template.innerHTML = `
  <style>
  
    #nav-container {
      background-color: darkblue;  
      display: inline-block;
      margin-top: 5px;
      padding-bottom: 5px;
    }
  
    nav a,
    #jump-to a {
      background-color: var(--clr-lighter-blue);
      color: white;
      font-size: 1.25rem;
      padding: 0.25rem 0.5rem 0.5rem;
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
    
    nav a + a {
      margin-left: 0.05rem;
    }
  </style>
  <div>
</div>
`;

export class NavbarComponent extends BaseTemplateComponent {
  constructor() {
    super();
  }

  override getTemplate(): HTMLTemplateElement {
    return template;
  }

  override render() {
    // Closing tags on separate lines are to prevent extra spaces between links
    return `
      <nav>
        <div id="nav-container">
          <a href="index.html">Home
          </a><a class="mid-element" href="designers.html">Local designers
          </a><a href="print_and_play.html">Print and Play
          </a><a href="/plans.html">Future plans
          </a><a href="useful_links.html">Useful Links</a>       
        </div>

      </nav>
    `;
  }
}

if (!customElements.get("navbar-component")) {
  customElements.define("navbar-component", NavbarComponent);
}
