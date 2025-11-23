import { BaseTemplateComponent } from "@bponnaluri/places-js";
import { ImageUploadComponent } from "../../shared/components/ImageUploadComponent.js";

customElements.define("image-upload-component", ImageUploadComponent);
export class CodeComponent extends BaseTemplateComponent {
  getTemplateStyle() {
    return `
      <style>
        .website-screenshot {
          border: 1px solid black;
          display: block;
          width:600px;
        }
      
</style>
    `;
  }

  //Code is from https://css-tricks.com/snippets/javascript/htmlentities-for-javascript/
  htmlEntities(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  render() {
    return `
      <h1>Code notes</h1>
      
      <p>dmvboardgames.com is built using vanilla JS, CSS, HTML, Java, and PostgreSQL.<p> One key goal with this
      tech stack is to minimize dependencies while making sure an architecture to minimize tech debt can be maintained
      as more features are added</p>
      
      <h2>Here are some main goals that the architecture and tech stack follows</h2>
 
      <ul>
        <li><p>Minimize dependencies: Unecessary dependencies add complexity and adds risk because of changes to the dependencies.
        Also, it helps make the code easier to follow. I want the code to serve as an example that people can follow to build 
        their own interactive websites or contribute changes to this site.</p>
         
         <p>A key aspect that will be followed here is designing the codebase to be understood by anyone who has a
          basic understanding of the tech stack here. On the UI, this means not deploying with external
          frameworks or libraries such as Angular, NextJs, React, or Tailwind CSS. The backend uses a lightweight framework
          called <a href="https://javalin.io/">Javalin</a> over a more complex framework such as <a href="https://spring.io/">Spring</a>
        </li>
        
        <li>Open source: All code associated with this website is open source and can be seen <a href="https://github.com/gatherspiel">here</a>
          The goal of dmvboardgames.com is to promote human connection through board games as a way of increasing interest in public spaces. 
          This website is not a profit making entity,
        </li>
        <li><p>Manual UI testing: UI should primarily be done manually. This allows testing for subjective criteria such
        as usuablity in addition to correctness.  Automated UI tests will not have the context necessary to
        understand subjective critiera, and maintaining them is a cost.  Finally, bots are blocked from scraping the site 
        and adding support for UI tests is likely to effect bot blocking measures. Additional thoughts are
        <a href="/html/static/tech/manualtesting">here</a></p> </li>
        
        <p>On the other hand, the backend relies on automated database integration tests. With the backend, the expected output 
        can be clearly defined with objective criteria, the tests are not affected by UI changes, and code from the tests
        cannot be used to bypass block blocking measures. Backend tests are <a href="here">https://github.com/gatherspiel/backend/tree/main/src/test/java/app/service</a></p>
        </li>
        
        <li>No use of AI. All code and documentation for this site is human created without assistance from generative AI tools. Also, 
        AI will not be used for any website functionality, including personalized recommendations or searches. When 
        users see events or other content, it should be because they made a decision to view that content. Users are 
        also prohibited from submitting any content that is created with the help of generative AI.</li>
</ul>
      <h2>Folder structure of UI</h2>
      
      <ul>
        <li>data: Contains data stores associated with the UI. They contain information about API calls or other necessary
        data fetching logic. They use a base data store class in the places.js framework located <a href="https://github.com/gatherspiel/places-js/blob/main/src/state/update/DataStore.ts">here</a>
        <li>ui: Interactive web components. It also contains static content that is inside web 
        component shadow DOM to make it more difficult for bots to scrape this website. The components here are built
        using a custom framework places.js I developed for asynchronous data fetching, state management, and webcomponents. Documentation for the
        framework is <a href="/html/static/tech/placesjs.html">here</a>
 
        <li>shared: Web components and other utilities used for project that don't have logic specific to a page
         on dmvboardgames.com. All files in this folder  have zero dependencies.</li>
        <li> html: html for the user facing web pages. Most of these pages will have content with their associated 
        components in the UI folder.</li>
</li>
      </ul>
      
      <h1>Updates</h1>
      
      
      <h2>Image component: 10-29-2025</h2>
      
      <p>I was working on functionality to enable users to upload images to groups and events. This involved 
       adding image upload functionality on forms for 4 different actions, creating groups, editing groups,
        creating events, and editing events. As I was working on adding image upload support, I noticed that it 
        was making the form component code difficult to follow, and modifying image upload code in multiple
        places was an unnecessary use of time.</p>
        
      <p>I decided to make a web component for uploading images, and I was able to use it on the 4 forms mentioned
      in the previous paragraph. I was also able to use the image upload component later as part of the edit profile page 
       to enable users to upload a profile picture.</p>
       
       <b>UI for edit profile page with image upload component. (Email blurred for privacy reasons)</b>
       <img class="website-screenshot" src="/assets/blog/EditProfile-10-29-2025.png">
       
       </br>
       <b>HTML for adding image upload component with id and initial state</b>
       <pre>
         ${this.htmlEntities(`          
           <image-upload-component
              id="image-upload-ui"
              image-path="\${data.imageFilePath}"
            ></image-upload-component>`)} 
       </pre>    
       
       <b>Image upload component code</b>
       <pre>${this.htmlEntities(ImageUploadComponent.toString())} 
       </pre>
       
       <h2>Demo component here:</h2>
       <image-upload-component></image-upload-component>
       <br>
       
       <pre>
       
</pre>
        
    `;
  }
}
