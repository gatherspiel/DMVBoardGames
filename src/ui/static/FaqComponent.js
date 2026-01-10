import { BaseTemplateComponent } from "@bponnaluri/places-js";
export class FaqComponent extends BaseTemplateComponent {
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
   <h1>FAQ</h1>
      
    
    
       <h3>General site information </h3>
       
         <h4>What is the business model of this website?</h4>
      
      <p>Dmvboardgames.com is a non-commercial website that is not designed to make a profit.</p>
      
      <h4>How will dmvboardgames.com make money?</h4>
      <p>dmvboardgames.com has enough money to cover costs through the end of 2028. If additional money is necessary to support new features, it will come through donations.
        The long term goal is to have dmvboardgames.com run by a non-profit. </p>
  
      <h4>Where did the money to run the site come from?</h4>
      <p>I, Gulu plan to cover the costs through money I have set aside for donations to the site.</p>      
      
       <h4>What is the long term goal of this website?</h4>
       <p>The goal of dmvboardgames.com is to promote human connection through board games as a way of 
       increasing interest in public spaces.
       
       The site will be designed to be  non-profit alternative to Meetup.com where people can find and create public events. 
       In the long term, I want people to find board game events through offline  means such as looking at event fliers 
       at a local board game store or asking others.   </p>
  
       <p>A key part of this goal involves making sure people don't see a reason to frequently visit this site. If
       people are frequently visiting the site, it suggests that they are having difficultly finding events through offline
       means or that this site is not effectively helping people play board games in person. </p>
        <p>Also, I want people to create their own local websites for different types of activities.
        dmvboardgames.com is build on top of open source software that people can adapt for their own use.</p>
  
       <p>I am also working on a website <a href="gatherspiel.com">Gatherspiel</a> as a way of promoting in person board games
       across the US. I plan to use Gatherspiel as a place to list local sites such as dmvboardgames.com.</p>
       <h4>Who created this website?</h4>
        
      <p>I, Gulu created this website. I am a software engineer who lives in Washington, DC.  I regularly host public board game events. </p>
        
      <h4>What motivated you to make this website?</h4>
      
      <p>I reguarly host public board game events in the DC area. Through conversations with people, I noticed that people were having a hard time finding board game events.
       Also, the site I used to host events, Meetup.com has been declining in quality, while pushing monetization that is negatively affecting the user experience. I did some 
       research, and was not able to find a better alternative.</p>
       
      <p>Also, finding places to host events become increasingly difficult, and dealing with challenges with existing locations distracted me from running events. On August 30th,
      2024, the Landing in Crystal City removed all the tables and chairs. The Landing was a cornerstone of the DMV board game community, and I used to host events there. This made
      me realize that the decline in public spaces had become a very serious issue, and I wanted to increase interest in public spaces as a way of reversing this decline.</p>
      
      <p>For more information about my experiences with the Landing in Crystal City, see this <a href="/landing.html">page</a></p>
      
      <h3>Site costs and running the site</h3>
       
      <h3>Questions about events </h3>
      
      <h4>How can I collect club dues or fees necessary to run an event?</h4>
      <p>A host should share payment details or collect money in person.</p>
      
      <h4>How can I buy, sell, or trade games?</h4> 
      <p>Use <a href="https://boardgamegeek.com/">Board Game Geek</a>, another website, share contact information or organize trades in person. dmvboardgames.com cannot be used to 
         coordinate buying, selling, or trading games.</p>
         
      <h4>How can I playtest my game?</h4>
      <p> Reach out to <a href="https://www.breakmygame.com/">Break My Game</a> or try to organize a playtest in person at an event. dmvboardgames.com cannot be used
      to organize playtests.</p>
      
      <h3>Source code</h3>
    
      <h4>I want to make my own website. Can I use code from dmvboardgames.com?</h4>
      
      <p>Absolutely! All code for dmvboardgames.com is publicly available under the GPL-3.0 license <a href="https://codeberg.org/createthirdplaces">here</a>. The site is
       also being programmed in a way that will enable other developers to use it as a template to build their own website. </p>
      
      <p> The site is built using a zero-dependency Web Components framework created by Gulu with asynchronous data fetching, and state management.
         See the front-end code <a href="https://codeberg.org/createthirdplaces/DMVBoardGames">here</a> for an example of how
         to install and use the framework. Email gulu@createthirdplaces.org for more information or help with using the framework.</p>    
         
       <h4>How does dmvboardgames.com use AI?</h4>
       
       <p>Dmvboardgames.com does not use AI. This includes not using AI for development, and the site does not interact with any AI tools. Also, 
        adding AI generated content to this site or accessing it using automated tools is strictly prohibited.</p>
        
      <h4>Are there plans to use Angular, React, Vue or another JavaScript tool as part of the UI?</h4>
        
      <p>No. There are no plans to add external JavaScript dependencies to the deployed source code that runs in a browser.</p>
        
      <h3>Other questions</h3>
      <h4>How can I help contribute to dmvboardgames.com?</h4>
      <p>Email gulu@createthirdplaces.org. dmvboardgames.com is looking for help with development, testing, and web design. More details are 
      <a href="/join.html">here</a></p>
         
      <h4>How can I share search results or group information on my own site?</h4>
      <p>dmvboardgames.com includes an API that can be used to access information.  Email gulu@createthirdplaces.org for more details.</p>
    `;
  }
}
