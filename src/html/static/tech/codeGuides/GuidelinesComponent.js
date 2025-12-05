export class GuidelinesComponent extends HTMLElement{
  connectedCallback(){
    this.innerHTML = `
     <p>This section contains recommendations for effectively using places.js</p>

        <ul id="guidelines-list">
          <li>Before using places.js, think carefully about your use case and whether or not it makes sense to
          use places.js. There are many instances where using places.js over vanilla JavaScript will add complexity
            such as creating a basic show hide component or an image hover component. If you are unsure about using places.js,
            it is recommended that you try experimenting it on a new project or a small part of an existing project.
            <br>
            <br>
            In a website that uses places.js, often it will make sense to create pages using standard web components
            or not use any JavaScript. Places.js is designed to be used on specific parts of a website with
            complex interactivity or backend data fetching.
            <br>
            <br>
            As a general rule when creating a website, one should make sure to minimize the amount of complexity
            and dependencies. Sometimes, this means using HTML on certain pages or using a non tech solution. For
            example, places.js could theoretically be used to create a coin flipping application to randomly pick
            the start player for a 2 player board game. However, if one of the players has a physical coin, that
            could be used instead.
         </li>
          <li>Use a multi page architecture(MPA) instead of a single page architecture(SPA): Places.js has been designed
            and optimized around support for an MPA website architecture, and the framework has not been fully tested
            with a SPA architecture. Second, I think it is very important for software projects to limit complexity
            in order to minimize long term maintainability, speed up development, and minimize the risk of bugs.
            An MPA isolates complexity to a specific part of a website, which makes it easier to test and reason about
            the effects of a change, while helping to reduce the complexity of change.
          </li>
          <li>
            Maintain a simple component hierarchy and minimize nested components: As a general guideline, avoid having more
            than 3 layers of nested places.js components. This will make it easier to understand and maintain code while
            making sure the UI isn't complex. A simple UI will help users quickly accomplish what they are looking to do.
          </li>
          <li>
            Consider using standard web components where interactivity needs aren't complex: Sometimes, it will
            make more sense to use a standard web component on a web page to minimize complexity.  Also, standard web
            components can be embedded inside places.js web components.

            For example, this documentation page is mostly HTML with native JS web components. The main use of
            places.js on this documentation page is to create components to show code examples. Places.js
            components are used to make sure the code examples are inside shadow DOM. This ensures a separation
            between syntax highlighting styles and the styles for the rest of the page, and it makes sure that
            CSS inside example code style tags doesn't affect outside styling.
            <br/>
            <br/>
            One example is show hide components. HTML provides a native show hide component that doesn't require
            JavaScript. Components nested inside such as the "base-dynamic-component-doc" component in the following
            example can include a native show hide component. To do so, the html should be rendered after
            connectedCallback is called.
            <details open>
              <summary></summary>
              <base-code-display-component>
  <details>
    <summary>
      BaseDynamicComponent
    </summary>
    &ltbase-dynamic-component-doc></base-dynamic-component-doc>
  
  </details>
              </base-code-display-component>
            </details>
                       Another example is a component that resizes an image when a mouse pointer is hovering over an image. Adding
            a hover style using CSS is sufficient to provide interactivity.
            <details open>
            <summary></summary>
            <image-hover-component-guide></image-hover-component-guide>
</details>
            On the other hand, a component that is responsible for querying a backend API to update a user's event
            RSVP status, show the status of the RSVP API call, and show an updated RSVP count is a good candidate
            for a places.js component.
          </li>
        </ul>
    `
  }
}