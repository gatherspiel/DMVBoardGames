import { BaseTemplateComponent } from "@bponnaluri/places-js";
export class JoinComponent extends BaseTemplateComponent {
  constructor() {
    super();
  }

  getTemplateStyle() {
    return `
      <link rel="stylesheet" type="text/css" href="/styles/sharedHtmlAndComponentStyles.css"/>

      <style>
        h1 {
          margin-top:1rem;
        }
      </style>
    `;
  }
  render() {
    return `
   <h1>Join</h1>
      
    
    
    <p>Dmvboardgames.com is looking for volunteer help in the following areas. To join, email gulu@createhirdplaces.com</p>
    
    
    <ul>
      <li><b>Programming</b></li>
        <ul>
          <li>Frontend: CSS, HTML, Javascript</li>
          <li>Backend: Java</li>
          <li>Database: PostgreSQL</li>
</ul>
        See more technical details about the project <a href="/html/static/code.html">here.</a>
        Source code for the project is <a href="https://github.com/gatherspiel">here.</a>
      <li><b>Testing</b></li>
        <ul>
          <li>Testing new features and enhancements to make sure there are no bugs.</li>
          <li>Verifying that the site works as expected after updates.</li>
</ul>
      <li><b>Graphic design and user experience</b></li>
        <ul>
          <li>Design graphics for the website and fliers</li>
          <li>Design UI components to make sure the site is aesthetically pleasing and easy to use.</li>
        </ul>
      

      <li><b>Gathering user feedback</b></li>
        Meet users in person, have them test the site and share feedback.
        that should be made. 
      <li><b>Nonprofit legal help</b></li>
        dmvboardgames.com is looking to be run as a legally recognized nonprofit under the name Create Third Places. Legal advice 
        is being sought to help with the process of incorporating the nonprofit. 
      <li><b>Fundraising</b></li>
        While dmvboardgames.com has enough to cover current hosting costs, the site is looking to raise money for the following items.
        <ul>
          <li>Renting a physical office space in the DMV area.</li>
          <li>Hiring employees or consulants to help with the website and promoting in person events</li>
          
        </ul>
    </ul>
 
    `;
  }
}
