
export function getFaqRulesHtml(){
  return `
  
    <h1>FAQ</h1>
    
    <h2>How can I help contribute to dmvboardgames.com?</h2>
    <p>Email gulu@createthirdplaces.com. dmvboardgames.com is looking for help with development, testing, and web design. All source code can be viewed 
        <a href="https://github.com/orgs/gatherspiel/repositories">here</a></p>
        
    <h2>How can collect club dues or fees necessary to run an event?</h2>
    <p>A host should share payment details or collect money in person.</p>
    
    <h2>How will dmvboardgames.com make money?</h2>
    <p>dmvboardgames.com has enough money to cover costs through the end of 2028. If additional money is necessary to supprot new features, it will come through donations.
    This site is an open source non-commercial project, and it only needs to raise money associated with the costs of running the site. </p>
    
    <h2>How can I buy, sell, or trade games?</h2> 
    <p>Use <a href="https://boardgamegeek.com/">Board Game Geek</a>, another website, share contact information or organize trades in person. dmvboardgames.com cannot be used to 
       coordinate buying, selling, or trading games.</p>
       
    <h2>How can I playtest my game?</h2>
    <p> Reach out to <a href="https://www.breakmygame.com/">Break My Game</a> or try to organize a playtest in person at an event. dmvboardgames.com cannot be used
    to organize playtests.</p>
    
    <h2>How can I share search results or group information on my own site?</h2>
    <p>dmvboardgames.com includes an API that can be used to access information.  Email gulu@createthirdplaces.com for more details.</p>
  
    <h2>I want to make my own website. Can I use code from dmvboardgames.com?</h2>
    
    <p>All code for dmvboardgames.com is publicly available under the GNU General Public License v3.0 <a href="https://github.com/gatherspiel">here</a> and can be freely modified. The site is built using
       a zero-dependency Web Components framework with asynchronous data fetching, and state management. See the front-end code <a href="https://github.com/gatherspiel/DMVBoardGames/tree/main">here</a> for an example of how
       to install and use the framework. </p>  
  `
}

export function getMainSiteRulesHtml(){
  return `    
    <h1>Rules for groups and group events</h1>
    <b>Note: These rules only apply to content posted on dmvboardgames.com</b>

    <h2>General guidelines</h2>
    <ul>
      <li>All events must be in person at a location within the DMV area and must be related to board games. </li>
      <li>Any links must be content relevant to an event such as a group. Content must also be visible without logging in or entering personal information.</li>
      <li></li>
    </ul>
    
    <h2>Prohibited content</h2>
      <h3>External links</h3>
      <ul>
          <li>Websites that involve spending money such as an online store.  If organizers need to collect money for expenses related to hosting an event, they should share payment details or collect
          money in person at the event</li>
          <li>Business websites where an event will take place including game stores and restaurants.</li>
          <li>Online chat groups or forums</li>
      </ul>
      <h3>Other prohibited content</h3>
      <ul>
        <li>Contact information including email addresses, group chat information, or phone numbers.</li>
        <li>Information related to exchanging money or products not related to necessary costs for the event. This also includes posting about buying or selling games,
        or sharing payment service information.</li>
        <li>Groups or events that are focused on people of specific demographics not directly related to board games.</li>
        <li>Excluding people based on demographics not directly related to board games.</li>
        <li>Information related to playtesting games. If you are looking to playtest a game, it is recommended to reach
        out to <a href="https://www.breakmygame.com/">Break My Game</a> or try to organize a playtest in person at an event.</li>
      </ul>
    </ul>

    `
}