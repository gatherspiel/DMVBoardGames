import {
  BaseDynamicComponent,
} from "@bponnaluri/places-js";
export class SiteRulesComponent extends BaseDynamicComponent {
  constructor() {
    super()
  }

  connectedCallback(){
    this.updateData({})
  }
  override getTemplateStyle(): string {
    return `
      <link rel="stylesheet" type="text/css" href="/styles/sharedHtmlAndComponentStyles.css"/>

      <style>any
      </style>
    `;
  }
  override render() {
    return `
      <h2>Rules for groups and group event information posted on dmvboardgames.com</h2>

    <h3>General guidelines</h3>
    <ul>
      <li>All events must be in person at a location within the DMV area and must be related to board games.</li>
      <li>Any links must be content relevant to an event. Content must also be visible without logging in or entering personal information.</li>
      <li>All information must be manually entered by a human without the use of bots or generative AI.</li>
    </ul>
    
    <h3>Prohibited content</h3>
      <h4>External links</h4>
      <ul>
          <li>Websites that involve spending money such as an online store. If an organizer needs to collect fees for running an event,
          , they should share payment details or collect money in person at the event.</li>
          <li>Business websites where an event will take place including game stores and restaurants.</li>
          <li>Online chat groups or forums</li>
      </ul>
      <h4>Other prohibited content</h4>
      <ul>
        <li>Content created with the use of generative AI tools such as ChatGPT.</li>
        <li>Contact information including email addresses, group chat information, or phone numbers.</li>
        <li>Information related to exchanging money or products not related to necessary costs for the event.</li>
        <li>Groups or events that are focused on people of specific demographics not directly related to board games.</li>
        <li>Excluding people based on demographics not directly related to board games.</li>
        <li>Information related to playtesting games. If you are looking to playtest a game, it is recommended to reach
        out to <a href="https://www.breakmygame.com/">Break My Game</a> or try to organize a playtest in person at an event.</li>
      </ul>
    </ul>  
    `
  }
}

