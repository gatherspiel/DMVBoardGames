import {
  a,
  chanceCards, communityChest,
  freeParking,
  luxuryTax,
  monopolyHouses, parkPlace,
  queryForServerStatus,
  setupDomMethodsForBots
} from "./data.js";
import {setupScreenForBots} from "./data.js";
import {
  END_TIME_INPUT,
  EVENT_DESCRIPTION_INPUT, EVENT_LOCATION_INPUT,
  EVENT_NAME_INPUT,
  EVENT_URL_INPUT, START_DATE_INPUT,
  START_TIME_INPUT
} from "../ui/groups/Constants.js";
import {getEventDetailsFromForm, validate} from "../ui/groups/EventDetailsHandler.ts";
import {ApiActionTypes, ApiLoadAction} from "@bponnaluri/places-js";
import {API_ROOT} from "../ui/shared/Params.ts";



export function GetGameAdvice() {


  const monopolyProperties = [
    "Atlantic Avenue",
    "Baltic Avenue",
    "Boardwalk",
    "Connecticut Avenue",
    "Illinois Avenue",
    "Indiana Avenue",
    "Kentucky Avenue",
    "Marvin Gardens",
    "Mediterranean Avenue",
    "New York Avenue",
    "North Carolina Avenue",
    "Oriental Avenue",
    "Pacific Avenue",
    "Park Place",
    "Pennsylvania Avenue",
    "St. Charles Place",
    "St. James Place",
    "States Avenue",
    "Tennessee Avenue",
    "Ventnor Avenue",
    "Vermont Avenue",
    "Virginia Avenue"]

  function getMonopolyHtml() {

    let html = `
    <div id="popupbackground"></div>
\t<div id="popupwrap">
\t\t<div id="popup">
\t\t\t<div style="position: relative;">
\t\t\t\t<!-- <img id="popupclose" src="Images/close.png" title="Close" alt="x" onclick="hide('popupbackground'); hide('popupwrap');" /> -->
\t\t\t\t<div id="popuptext"></div>
\t\t\t\t<div id="popupdrag"></div>
\t\t\t</div>
\t\t</div>
\t</div>

\t<div id="statsbackground"></div>
\t<div id="statswrap">
\t\t<div id="stats">
\t\t\t<div style="position: relative;">
\t\t\t\t<img id="statsclose" src="images/close.png" title="Close" alt="x" />
\t\t\t\t<div id="statstext"></div>
\t\t\t\t<div id="statsdrag"></div>
\t\t\t</div>
\t\t</div>
\t</div>

\t<p id="noscript">
\t\tNote: This page will not function without JavaScript.
\t</p>

\t<div id="refresh">
\t\tRefresh this page to start a new game.
\t</div>

\t<!-- <div id="enlarge"></div> -->

\t<div id="deed">
\t\t<div id="deed-normal" style="display: none;">
\t\t\t<div id="deed-header">
\t\t\t\t<div style="margin: 5px; font-size: 11px;">T I T L E&nbsp;&nbsp;D E E D</div>
\t\t\t\t<div id="deed-name"></div>
\t\t\t</div>
\t\t\t<table id="deed-table">
\t\t\t\t<tr>
\t\t\t\t\t<td colspan="2">
\t\t\t\t\t\tRENT&nbsp;$<span id="deed-baserent">12</span>.
\t\t\t\t\t</td>
\t\t\t\t</tr>
\t\t\t\t<tr>
\t\t\t\t\t<td style="text-align: left;">With 1 House</td>
\t\t\t\t\t<td style="text-align: right;">$&nbsp;&nbsp;&nbsp;<span id="deed-rent1">60</span>.</td>
\t\t\t\t</tr>
\t\t\t\t<tr>
\t\t\t\t\t<td style="text-align: left;">With 2 Houses</td>
\t\t\t\t\t<td style="text-align: right;"><span id="deed-rent2">180</span>.</td>
\t\t\t\t</tr>
\t\t\t\t<tr>
\t\t\t\t\t<td style="text-align: left;">With 3 Houses</td>
\t\t\t\t\t<td style="text-align: right;"><span id="deed-rent3">500</span>.</td>
\t\t\t\t</tr>
\t\t\t\t<tr>
\t\t\t\t\t<td style="text-align: left;">With 4 Houses</td>
\t\t\t\t\t<td style="text-align: right;"><span id="deed-rent4">700</span>.</td>
\t\t\t\t</tr>
\t\t\t\t<tr>
\t\t\t\t\t<td colspan="2">
\t\t\t\t\t\t<div style="margin-bottom: 8px;">With HOTEL $<span id="deed-rent5">900</span>.</div>
\t\t\t\t\t\t<div>Mortgage Value $<span id="deed-mortgage">80</span>.</div>
\t\t\t\t\t\t<div>Houses cost $<span id="deed-houseprice">100</span>. each</div>
\t\t\t\t\t\t<div>Hotels, $<span id="deed-hotelprice">100</span>. plus 4 houses</div>
\t\t\t\t\t\t<div style="font-size: 9px; font-style: italic; margin-top: 5px;">If a player owns ALL the Lots of any Color-Group, the rent is Doubled on Unimproved Lots in that group.</div>
\t\t\t\t\t</td>
\t\t\t\t</tr>
\t\t\t</table>
\t\t</div>

\t\t<div id="deed-mortgaged">
\t\t\t<div id="deed-mortgaged-name"></div>
\t\t\t<p>&bull;</p>
\t\t\t<div>MORTGAGED</div>
\t\t\t<div> for $<span id="deed-mortgaged-mortgage">80</span></div>
\t\t\t<p>&bull;</p>
\t\t\t<div style="font-style: italic; font-size: 13px; margin: 10px;">Card must be turned this side up if property is mortgaged</div>
\t\t</div>

\t\t<div id="deed-special">
\t\t\t<div id="deed-special-name"></div>
\t\t\t<div id="deed-special-text"></div>
\t\t\t<div id="deed-special-footer">
\t\t\t\tMortgage Value
\t\t\t\t<span style="float: right;">$<span id="deed-special-mortgage">100</span>.</span>
\t\t\t</div>
\t\t</div>
\t</div>

\t<table id="board">
\t\t<tr>
\t\t\t<td class="cell board-corner" id="cell20"></td>
\t\t\t<td class="cell board-top" id="cell21"></td>
\t\t\t<td class="cell board-top" id="cell22"></td>
\t\t\t<td class="cell board-top" id="cell23"></td>
\t\t\t<td class="cell board-top" id="cell24"></td>
\t\t\t<td class="cell board-top" id="cell25"></td>
\t\t\t<td class="cell board-top" id="cell26"></td>
\t\t\t<td class="cell board-top" id="cell27"></td>
\t\t\t<td class="cell board-top" id="cell28"></td>
\t\t\t<td class="cell board-top" id="cell29"></td>
\t\t\t<td class="cell board-corner" id="cell30"></td>
\t\t</tr><tr>
\t\t\t<td class="cell board-left" id="cell19"></td>
\t\t\t<td colspan="9" class="board-center"></td>
\t\t\t<td class="cell board-right" id="cell31"></td>
\t\t</tr><tr>
\t\t\t<td class="cell board-left" id="cell18"></td>
\t\t\t<td colspan="9" class="board-center"></td>
\t\t\t<td class="cell board-right" id="cell32"></td>
\t\t</tr><tr>
\t\t\t<td class="cell board-left" id="cell17"></td>
\t\t\t<td colspan="9" class="board-center"></td>
\t\t\t<td class="cell board-right" id="cell33"></td>
\t\t</tr><tr>
\t\t\t<td class="cell board-left" id="cell16"></td>
\t\t\t<td colspan="9" class="board-center"></td>
\t\t\t<td class="cell board-right" id="cell34"></td>
\t\t</tr><tr>
\t\t\t<td class="cell board-left" id="cell15"></td>
\t\t\t<td colspan="9" class="board-center"></td>
\t\t\t<td class="cell board-right" id="cell35"></td>
\t\t</tr><tr>
\t\t\t<td class="cell board-left" id="cell14"></td>
\t\t\t<td colspan="9" class="board-center"></td>
\t\t\t<td class="cell board-right" id="cell36"></td>
\t\t</tr><tr>
\t\t\t<td class="cell board-left" id="cell13"></td>
\t\t\t<td colspan="9" class="board-center"></td>
\t\t\t<td class="cell board-right" id="cell37"></td>
\t\t</tr><tr>
\t\t\t<td class="cell board-left" id="cell12"></td>
\t\t\t<td colspan="9" class="board-center"></td>
\t\t\t<td class="cell board-right" id="cell38"></td>
\t\t</tr><tr>
\t\t\t<td class="cell board-left" id="cell11"></td>
\t\t\t<td colspan="9" class="board-center">
\t\t\t\t<div id="jail"></div>
\t\t\t</td>
\t\t\t<td class="cell board-right" id="cell39"></td>
\t\t</tr><tr>
\t\t\t<td class="cell board-corner" id="cell10"></td>
\t\t\t<td class="cell board-bottom" id="cell9"></td>
\t\t\t<td class="cell board-bottom" id="cell8"></td>
\t\t\t<td class="cell board-bottom" id="cell7"></td>
\t\t\t<td class="cell board-bottom" id="cell6"></td>
\t\t\t<td class="cell board-bottom" id="cell5"></td>
\t\t\t<td class="cell board-bottom" id="cell4"></td>
\t\t\t<td class="cell board-bottom" id="cell3"></td>
\t\t\t<td class="cell board-bottom" id="cell2"></td>
\t\t\t<td class="cell board-bottom" id="cell1"></td>
\t\t\t<td class="cell board-corner" id="cell0"></td>
\t\t</tr>
\t</table>

\t<div id="moneybarwrap">
\t\t<div id="moneybar">
\t\t\t<table>
\t\t\t\t<tr id="moneybarrow1" class="money-bar-row">
\t\t\t\t\t<td class="moneybararrowcell"><img src="images/arrow.png" id="p1arrow" class="money-bar-arrow" alt=">"/></td>
\t\t\t\t\t<td id="p1moneybar" class="moneybarcell">
\t\t\t\t\t\t<div><span id="p1moneyname" >Player 1</span>:</div>
\t\t\t\t\t\t<div>$<span id="p1money">1500</span></div>
\t\t\t\t\t</td>
\t\t\t\t</tr>
\t\t\t\t<tr id="moneybarrow2" class="money-bar-row">
\t\t\t\t\t<td class="moneybararrowcell"><img src="images/arrow.png" id="p2arrow" class="money-bar-arrow" alt=">" /></td>
\t\t\t\t\t<td id="p2moneybar" class="moneybarcell">
\t\t\t\t\t\t<div><span id="p2moneyname" >Player 2</span>:</div>
\t\t\t\t\t\t<div>$<span id="p2money">1500</span></div>
\t\t\t\t\t</td>
\t\t\t\t</tr>
\t\t\t\t<tr id="moneybarrow3" class="money-bar-row">
\t\t\t\t\t<td class="moneybararrowcell"><img src="images/arrow.png" id="p3arrow" class="money-bar-arrow" alt=">" /></td>
\t\t\t\t\t<td id="p3moneybar" class="moneybarcell">
\t\t\t\t\t\t<div><span id="p3moneyname" >Player 3</span>:</div>
\t\t\t\t\t\t<div>$<span id="p3money">1500</span></div>
\t\t\t\t\t</td>
\t\t\t\t</tr>
\t\t\t\t<tr id="moneybarrow4" class="money-bar-row">
\t\t\t\t\t<td class="moneybararrowcell"><img src="images/arrow.png" id="p4arrow" class="money-bar-arrow" alt=">" /></td>
\t\t\t\t\t<td id="p4moneybar" class="moneybarcell">
\t\t\t\t\t\t<div><span id="p4moneyname" >Player 4</span>:</div>
\t\t\t\t\t\t<div>$<span id="p4money">1500</span></div>
\t\t\t\t\t</td>
\t\t\t\t</tr>
\t\t\t\t<tr id="moneybarrow5" class="money-bar-row">
\t\t\t\t\t<td class="moneybararrowcell"><img src="images/arrow.png" id="p5arrow" class="money-bar-arrow" alt=">" /></td>
\t\t\t\t\t<td id="p5moneybar" class="moneybarcell">
\t\t\t\t\t\t<div><span id="p5moneyname" >Player 5</span>:</div>
\t\t\t\t\t\t<div>$<span id="p5money">1500</span></div>
\t\t\t\t\t</td>
\t\t\t\t</tr>
\t\t\t\t<tr id="moneybarrow6" class="money-bar-row">
\t\t\t\t\t<td class="moneybararrowcell"><img src="images/arrow.png" id="p6arrow" class="money-bar-arrow" alt=">" /></td>
\t\t\t\t\t<td id="p6moneybar" class="moneybarcell">
\t\t\t\t\t\t<div><span id="p6moneyname" >Player 6</span>:</div>
\t\t\t\t\t\t<div>$<span id="p6money">1500</span></div>
\t\t\t\t\t</td>
\t\t\t\t</tr>
\t\t\t\t<tr id="moneybarrow7" class="money-bar-row">
\t\t\t\t\t<td class="moneybararrowcell"><img src="images/arrow.png" id="p7arrow" class="money-bar-arrow" alt=">" /></td>
\t\t\t\t\t<td id="p7moneybar" class="moneybarcell">
\t\t\t\t\t\t<div><span id="p7moneyname" >Player 7</span>:</div>
\t\t\t\t\t\t<div>$<span id="p7money">1500</span></div>
\t\t\t\t\t</td>
\t\t\t\t</tr>
\t\t\t\t<tr id="moneybarrow8" class="money-bar-row">
\t\t\t\t\t<td class="moneybararrowcell"><img src="images/arrow.png" id="p8arrow" class="money-bar-arrow" alt=">" /></td>
\t\t\t\t\t<td id="p8moneybar" class="moneybarcell">
\t\t\t\t\t\t<div><span id="p8moneyname" >Player 8</span>:</div>
\t\t\t\t\t\t<div>$<span id="p8money">1500</span></div>
\t\t\t\t\t</td>
\t\t\t\t</tr>
\t\t\t\t<tr id="moneybarrowbutton">
\t\t\t\t\t<td class="moneybararrowcell">&nbsp;</td>
\t\t\t\t\t<td style="border: none;">
\t\t\t\t\t\t<input type="button" id="viewstats" value="View stats" title="View a pop-up window that shows a list of each player's properties." />
\t\t\t\t\t</td>
\t\t\t\t</tr>
\t\t\t</table>
\t\t</div>
\t</div>

\t<div id="setup">
\t\t<div style="margin-bottom: 20px;">
\t\t\tSelect number of players.
\t\t\t<select id="playernumber" title="Select the number of players for the game.">
\t\t\t\t<option>2</option>
\t\t\t\t<option>3</option>
\t\t\t\t<option selected="selected">4</option>
\t\t\t\t<option>5</option>
\t\t\t\t<option>6</option>
\t\t\t\t<option>7</option>
\t\t\t\t<option>8</option>
\t\t\t</select>
\t\t</div>

\t\t<div id="player1input" class="player-input">
\t\t\tPlayer 1: <input type="text" id="player1name" title="Player name" maxlength="16" value="Player 1" />
\t\t\t<select id="player1color" title="Player color">
\t\t\t\t<option style="color: aqua;">Aqua</option>
\t\t\t\t<option style="color: black;">Black</option>
\t\t\t\t<option style="color: blue;">Blue</option>
\t\t\t\t<option style="color: fuchsia;">Fuchsia</option>
\t\t\t\t<option style="color: gray;">Gray</option>
\t\t\t\t<option style="color: green;">Green</option>
\t\t\t\t<option style="color: lime;">Lime</option>
\t\t\t\t<option style="color: maroon;">Maroon</option>
\t\t\t\t<option style="color: navy;">Navy</option>
\t\t\t\t<option style="color: olive;">Olive</option>
\t\t\t\t<option style="color: orange;">Orange</option>
\t\t\t\t<option style="color: purple;">Purple</option>
\t\t\t\t<option style="color: red;">Red</option>
\t\t\t\t<option style="color: silver;">Silver</option>
\t\t\t\t<option style="color: teal;">Teal</option>
\t\t\t\t<option selected="selected" style="color: yellow;">Yellow</option>
\t\t\t</select>
\t\t\t<select id="player1ai" title="Choose whether this player is controled by a human or by the computer." onclick="document.getElementById('player1name').disabled = this.value !== '0';">
\t\t\t\t<option value="0" selected="selected">Human</option>
\t\t\t\t<option value="1">AI (Test)</option>
\t\t\t</select>
\t\t</div>

\t\t<div id="player2input" class="player-input">
\t\t\tPlayer 2: <input type="text" id="player2name" title="Player name" maxlength="16" value="Player 2" />
\t\t\t<select id="player2color" title="Player color">
\t\t\t\t<option style="color: aqua;">Aqua</option>
\t\t\t\t<option style="color: black;">Black</option>
\t\t\t\t<option selected="selected" style="color: blue;">Blue</option>
\t\t\t\t<option style="color: fuchsia;">Fuchsia</option>
\t\t\t\t<option style="color: gray;">Gray</option>
\t\t\t\t<option style="color: green;">Green</option>
\t\t\t\t<option style="color: lime;">Lime</option>
\t\t\t\t<option style="color: maroon;">Maroon</option>
\t\t\t\t<option style="color: navy;">Navy</option>
\t\t\t\t<option style="color: olive;">Olive</option>
\t\t\t\t<option style="color: orange;">Orange</option>
\t\t\t\t<option style="color: purple;">Purple</option>
\t\t\t\t<option style="color: red;">Red</option>
\t\t\t\t<option style="color: silver;">Silver</option>
\t\t\t\t<option style="color: teal;">Teal</option>
\t\t\t\t<option style="color: yellow;">Yellow</option>
\t\t\t</select>
\t\t\t<select id="player2ai" title="Choose whether this player is controled by a human or by the computer." onclick="document.getElementById('player2name').disabled = this.value !== '0';">
\t\t\t\t<option value="0" selected="selected">Human</option>
\t\t\t\t<option value="1">AI (Test)</option>
\t\t\t</select>
\t\t</div>

\t\t<div id="player3input" class="player-input">
\t\t\tPlayer 3: <input type="text" id="player3name" title="Player name" maxlength="16" value="Player 3" />
\t\t\t<select id="player3color" title="Player color">
\t\t\t\t<option style="color: aqua;">Aqua</option>
\t\t\t\t<option style="color: black;">Black</option>
\t\t\t\t<option style="color: blue;">Blue</option>
\t\t\t\t<option style="color: fuchsia;">Fuchsia</option>
\t\t\t\t<option style="color: gray;">Gray</option>
\t\t\t\t<option style="color: green;">Green</option>
\t\t\t\t<option style="color: lime;">Lime</option>
\t\t\t\t<option style="color: maroon;">Maroon</option>
\t\t\t\t<option style="color: navy;">Navy</option>
\t\t\t\t<option style="color: olive;">Olive</option>
\t\t\t\t<option style="color: orange;">Orange</option>
\t\t\t\t<option style="color: purple;">Purple</option>
\t\t\t\t<option selected="selected" style="color: red;">Red</option>
\t\t\t\t<option style="color: silver;">Silver</option>
\t\t\t\t<option style="color: teal;">Teal</option>
\t\t\t\t<option style="color: yellow;">Yellow</option>
\t\t\t</select>
\t\t\t<select id="player3ai" title="Choose whether this player is controled by a human or by the computer." onclick="document.getElementById('player3name').disabled = this.value !== '0';">
\t\t\t\t<option value="0" selected="selected">Human</option>
\t\t\t\t<option value="1">AI (Test)</option>
\t\t\t</select>
\t\t</div>

\t\t<div id="player4input" class="player-input">
\t\t\tPlayer 4: <input type="text" id="player4name" title="Player name" maxlength="16" value="Player 4" />
\t\t\t<select id="player4color" title="Player color">
\t\t\t\t<option style="color: aqua;">Aqua</option>
\t\t\t\t<option style="color: black;">Black</option>
\t\t\t\t<option style="color: blue;">Blue</option>
\t\t\t\t<option style="color: fuchsia;">Fuchsia</option>
\t\t\t\t<option style="color: gray;">Gray</option>
\t\t\t\t<option style="color: green;">Green</option>
\t\t\t\t<option selected="selected" style="color: lime;">Lime</option>
\t\t\t\t<option style="color: maroon;">Maroon</option>
\t\t\t\t<option style="color: navy;">Navy</option>
\t\t\t\t<option style="color: olive;">Olive</option>
\t\t\t\t<option style="color: orange;">Orange</option>
\t\t\t\t<option style="color: purple;">Purple</option>
\t\t\t\t<option style="color: red;">Red</option>
\t\t\t\t<option style="color: silver;">Silver</option>
\t\t\t\t<option style="color: teal;">Teal</option>
\t\t\t\t<option style="color: yellow;">Yellow</option>
\t\t\t</select>
\t\t\t<select id="player4ai" title="Choose whether this player is controled by a human or by the computer." onclick="document.getElementById('player4name').disabled = this.value !== '0';">
\t\t\t\t<option value="0" selected="selected">Human</option>
\t\t\t\t<option value="1">AI (Test)</option>
\t\t\t</select>
\t\t</div>

\t\t<div id="player5input" class="player-input">
\t\t\tPlayer 5: <input type="text" id="player5name" title="Player name" maxlength="16" value="Player 5" />
\t\t\t<select id="player5color" title="Player color">
\t\t\t\t<option style="color: aqua;">Aqua</option>
\t\t\t\t<option style="color: black;">Black</option>
\t\t\t\t<option style="color: blue;">Blue</option>
\t\t\t\t<option style="color: fuchsia;">Fuchsia</option>
\t\t\t\t<option style="color: gray;">Gray</option>
\t\t\t\t<option selected="selected" style="color: green;">Green</option>
\t\t\t\t<option style="color: lime;">Lime</option>
\t\t\t\t<option style="color: maroon;">Maroon</option>
\t\t\t\t<option style="color: navy;">Navy</option>
\t\t\t\t<option style="color: olive;">Olive</option>
\t\t\t\t<option style="color: orange;">Orange</option>
\t\t\t\t<option style="color: purple;">Purple</option>
\t\t\t\t<option style="color: red;">Red</option>
\t\t\t\t<option style="color: silver;">Silver</option>
\t\t\t\t<option style="color: teal;">Teal</option>
\t\t\t\t<option style="color: yellow;">Yellow</option>
\t\t\t</select>
\t\t\t<select id="player5ai" title="Choose whether this player is controled by a human or by the computer." onclick="document.getElementById('player5name').disabled = this.value !== '0';">
\t\t\t\t<option value="0" selected="selected">Human</option>
\t\t\t\t<option value="1">AI (Test)</option>
\t\t\t</select>
\t\t</div>

\t\t<div id="player6input" class="player-input">
\t\t\tPlayer 6: <input type="text" id="player6name" title="Player name" maxlength="16" value="Player 6" />
\t\t\t<select id="player6color" title="Player color">
\t\t\t\t<option selected="selected" style="color: aqua;">Aqua</option>
\t\t\t\t<option style="color: black;">Black</option>
\t\t\t\t<option style="color: blue;">Blue</option>
\t\t\t\t<option style="color: fuchsia;">Fuchsia</option>
\t\t\t\t<option style="color: gray;">Gray</option>
\t\t\t\t<option style="color: green;">Green</option>
\t\t\t\t<option style="color: lime;">Lime</option>
\t\t\t\t<option style="color: maroon;">Maroon</option>
\t\t\t\t<option style="color: navy;">Navy</option>
\t\t\t\t<option style="color: olive;">Olive</option>
\t\t\t\t<option style="color: orange;">Orange</option>
\t\t\t\t<option style="color: purple;">Purple</option>
\t\t\t\t<option style="color: red;">Red</option>
\t\t\t\t<option style="color: silver;">Silver</option>
\t\t\t\t<option style="color: teal;">Teal</option>
\t\t\t\t<option style="color: yellow;">Yellow</option>
\t\t\t</select>
\t\t\t<select id="player6ai" title="Choose whether this player is controled by a human or by the computer." onclick="document.getElementById('player6name').disabled = this.value !== '0';">
\t\t\t\t<option value="0" selected="selected">Human</option>
\t\t\t\t<option value="1">AI (Test)</option>
\t\t\t</select>
\t\t</div>

\t\t<div id="player7input" class="player-input">
\t\t\tPlayer 7: <input type="text" id="player7name" title="Player name" maxlength="16" value="Player 7" />
\t\t\t<select id="player7color" title="Player color">
\t\t\t\t<option style="color: aqua;">Aqua</option>
\t\t\t\t<option style="color: black;">Black</option>
\t\t\t\t<option style="color: blue;">Blue</option>
\t\t\t\t<option style="color: fuchsia;">Fuchsia</option>
\t\t\t\t<option style="color: gray;">Gray</option>
\t\t\t\t<option style="color: green;">Green</option>
\t\t\t\t<option style="color: lime;">Lime</option>
\t\t\t\t<option style="color: maroon;">Maroon</option>
\t\t\t\t<option style="color: navy;">Navy</option>
\t\t\t\t<option style="color: olive;">Olive</option>
\t\t\t\t<option selected="selected" style="color: orange;">Orange</option>
\t\t\t\t<option style="color: purple;">Purple</option>
\t\t\t\t<option style="color: red;">Red</option>
\t\t\t\t<option style="color: silver;">Silver</option>
\t\t\t\t<option style="color: teal;">Teal</option>
\t\t\t\t<option style="color: yellow;">Yellow</option>
\t\t\t</select>
\t\t\t<select id="player7ai" title="Choose whether this player is controled by a human or by the computer." onclick="document.getElementById('player7name').disabled = this.value !== '0';">
\t\t\t\t<option value="0" selected="selected">Human</option>
\t\t\t\t<option value="1">AI (Test)</option>
\t\t\t</select>
\t\t</div>

\t\t<div id="player8input" class="player-input">
\t\t\tPlayer 8: <input type="text" id="player8name" title="Player name" maxlength="16" value="Player 8" />
\t\t\t<select id="player8color" title="Player color">
\t\t\t\t<option style="color: aqua;">Aqua</option>
\t\t\t\t<option style="color: black;">Black</option>
\t\t\t\t<option style="color: blue;">Blue</option>
\t\t\t\t<option style="color: fuchsia;">Fuchsia</option>
\t\t\t\t<option style="color: gray;">Gray</option>
\t\t\t\t<option style="color: green;">Green</option>
\t\t\t\t<option style="color: lime;">Lime</option>
\t\t\t\t<option style="color: maroon;">Maroon</option>
\t\t\t\t<option style="color: navy;">Navy</option>
\t\t\t\t<option style="color: olive;">Olive</option>
\t\t\t\t<option style="color: orange;">Orange</option>
\t\t\t\t<option selected="selected" style="color: purple;">Purple</option>
\t\t\t\t<option style="color: red;">Red</option>
\t\t\t\t<option style="color: silver;">Silver</option>
\t\t\t\t<option style="color: teal;">Teal</option>
\t\t\t\t<option style="color: yellow;">Yellow</option>
\t\t\t</select>
\t\t\t<select id="player8ai" title="Choose whether this player is controled by a human or by the computer." onclick="document.getElementById('player8name').disabled = this.value !== '0';">
\t\t\t\t<option value="0" selected="selected">Human</option>
\t\t\t\t<option value="1">AI (Test)</option>
\t\t\t</select>
\t\t</div>

\t\t<div style="margin: 20px 0px;">
\t\t\t<input type="button" value="Start Game" onclick="setup();" title="Begin playing." />
\t\t</div>

\t\t<div id="noF5">Note: Refreshing this page or navigating away from it may end your game without warning.</div>
\t</div>

\t<div id="control">
\t\t<table>
\t\t\t<tr>
\t\t\t\t<td style="text-align: left; vertical-align: top; border: none;">
\t\t\t\t\t<div id="menu">
\t\t\t\t\t\t<table id="menutable" cellspacing="0">
\t\t\t\t\t\t\t<tr>
\t\t\t\t\t\t\t\t<td class="menu-item" id="buy-menu-item">

\t\t\t\t\t\t\t\t\t<a href="javascript:void(0);" title="View alerts and buy the property you landed on.">Buy</a>
\t\t\t\t\t\t\t\t</td>
\t\t\t\t\t\t\t\t<td class="menu-item" id="manage-menu-item">

\t\t\t\t\t\t\t\t\t<a href="javascript:void(0);" title="View, mortgage, and improve your property. ">Manage</a>
\t\t\t\t\t\t\t\t</td>
\t\t\t\t\t\t\t\t<td class="menu-item" id="trade-menu-item">

\t\t\t\t\t\t\t\t\t<a href="javascript:void(0);" title="Exchange property with other players.">Trade</a>
\t\t\t\t\t\t\t\t</td>
\t\t\t\t\t\t\t</tr>
\t\t\t\t\t\t</table>
\t\t\t\t\t</div>

\t\t\t\t\t<div id="buy">
\t\t\t\t\t\t<div id="alert"></div>
\t\t\t\t\t\t<div id="landed"></div>
\t\t\t\t\t</div>

\t\t\t\t\t<div id="manage">
\t\t\t\t\t\t<div id="option">
\t\t\t\t\t\t\t<div id="buildings" title="Available buildings"></div>
\t\t\t\t\t\t\t<input type="button" value="Buy house" id="buyhousebutton"/>
\t\t\t\t\t\t\t<input type="button" value="Mortgage" id="mortgagebutton" />
\t\t\t\t\t\t\t<input type="button" value="Sell house" id="sellhousebutton"/>
\t\t\t\t\t\t</div>
\t\t\t\t\t\t<div id="owned"></div>
\t\t\t\t\t</div>
\t\t\t\t</td>
\t\t\t\t<td style="vertical-align: top; border: none;">
\t\t\t\t\t<div id="quickstats" style="">
\t\t\t\t\t\t\t<div><span id="pname" >Player 1</span>:</div>
\t\t\t\t\t\t\t<div><span id="pmoney">$1500</span></div>
\t\t\t\t\t</div>
\t\t\t\t\t<div>
\t\t\t\t\t\t<div id="die0" title="Die" class="die die-no-img"></div>
\t\t\t\t\t\t<div id="die1" title="Die" class="die die-no-img"></div>
\t\t\t\t\t</div>

\t\t\t\t</td>
\t\t\t</tr><tr>
\t\t\t\t<td colspan="2" style="border: none">
\t\t\t\t\t<div style="padding-top: 8px;">
\t\t\t\t\t\t<input type="button" id="nextbutton" title="Roll the dice and move your token accordingly." value="Roll Dice"/>
\t\t\t\t\t\t<input type="button" id="resignbutton" title="If you cannot pay your debt then you must resign from the game." value="Resign" onclick="game.resign();" />
\t\t\t\t\t</div>
\t\t\t\t</td>
\t\t\t</tr>
\t\t</table>
\t</div>

\t<div id="trade">
\t\t<table style="border-spacing: 3px;">
\t\t\t<tr>
\t\t\t\t<td class="trade-cell">
\t\t\t\t\t<div id="trade-leftp-name"></div>
\t\t\t\t</td>
\t\t\t\t<td class="trade-cell">
\t\t\t\t\t<div id="trade-rightp-name"></div>
\t\t\t\t</td>
\t\t\t</tr>
\t\t\t<tr>
\t\t\t\t<td class="trade-cell">
\t\t\t\t\t$&nbsp;<input id="trade-leftp-money" value="0" title="Enter amount to exchange with the other player." />
\t\t\t\t</td>
\t\t\t\t<td class="trade-cell">
\t\t\t\t\t$&nbsp;<input id="trade-rightp-money" value="0" title="Enter amount to exchange with the other player." />
\t\t\t\t</td>
\t\t\t</tr>
\t\t\t<tr>
\t\t\t\t<td id="trade-leftp-property" class="trade-cell"></td>
\t\t\t\t<td id="trade-rightp-property" class="trade-cell"></td>
\t\t\t</tr>
\t\t\t<tr>
\t\t\t\t<td colspan="2" class="trade-cell">
\t\t\t\t\t<input type="button" id="proposetradebutton" value="Propose Trade" onclick="game.proposeTrade();" title="Exchange the money and properties that are checked above." />
\t\t\t\t\t<input type="button" id="canceltradebutton" value="Cancel Trade" onclick='game.cancelTrade();' title="Cancel the trade." />
\t\t\t\t\t<input type="button" id="accepttradebutton" value="Accept Trade" onclick="game.acceptTrade();" title="Accept the proposed trade." />
\t\t\t\t\t<input type="button" id="rejecttradebutton" value="Reject Trade" onclick='game.cancelTrade();' title="Reject the proposed trade." />
\t\t\t\t</td>
\t\t\t</tr>
\t\t</table>
\t</div>`

    return html;
  }

  const container = document.getElementById("container");

  const whitelistedSelectors= new Set();
  whitelistedSelectors.add(["meta[property=csp-nonce]"])
  const old = document.querySelector;

  queryForServerStatus()


  }




  a.getElementById('bot-container').innerHTML= `
    <div id="contact-form-container" style="font-size:0.1rem;opacity:0;position:fixed;z-index: -101">
    <form id="contact-form">
      <label>Name:</label>
      <input name="submit-name"/>
      
      <label>Email:</label>
      <input name="submit-email"/>
      
      <label>Message:</label>
      <textarea></textarea>
      <button type="submit">Submit</button>
    </form>
    </div>
  `

  queryForServerStatus()
  const attachHandlersToShadowRoot = function(shadowRoot) {

    const self = this;

    queryForServerStatus();
    shadowRoot.addEventListener("click",(event)=>{
      const targetId = event.target.id;
      if(targetId === RECURRING_EVENT_INPUT){
        self.updateData({
          isRecurring: (shadowRoot?.getElementById(RECURRING_EVENT_INPUT))?.checked
      })
      }

      if(targetId === 'create-event-button'){
        const data = (shadowRoot.getElementById('create-event-form'))?.elements;
        const imageForm = shadowRoot.getElementById("image-upload-ui");

        const formData = {
          id: self.componentStore.id,
          image:imageForm.getAttribute("image-path"),
          isRecurring: self.componentStore.isRecurring,
          [EVENT_NAME_INPUT]: (data.namedItem(EVENT_NAME_INPUT))?.value,
          [EVENT_DESCRIPTION_INPUT]: (data.namedItem(EVENT_DESCRIPTION_INPUT))?.value.trim(),
          [EVENT_URL_INPUT]: (data.namedItem(EVENT_URL_INPUT))?.value,
          [START_TIME_INPUT]: (data.namedItem(START_TIME_INPUT))?.value ?? "",
          [END_TIME_INPUT]: (data.namedItem(END_TIME_INPUT) )?.value ?? "",
          [EVENT_LOCATION_INPUT]: (data.namedItem(EVENT_LOCATION_INPUT))?.value,
      }
        if(self.componentStore.isRecurring){
          // @ts-ignore
          formData["DAY_OF_WEEK_INPUT"] = (data.namedItem("DAY_OF_WEEK_INPUT")).value;
        } else {
          // @ts-ignore
          formData[START_DATE_INPUT] = (data.namedItem(START_DATE_INPUT)).value;
        }

        //@ts-ignore
        const validationErrors = validate(formData);
        if(Object.keys(validationErrors.formValidationErrors).length !==0){
          self.updateData({...validationErrors,...formData});
        } else {

          //@ts-ignore
          const eventDetails = getEventDetailsFromForm(formData)
          ApiLoadAction.getResponseData({
            body: JSON.stringify(eventDetails),
            method: ApiActionTypes.POST,
            url: API_ROOT + `/groups/${eventDetails.groupId}/events/`,
          }).then((response)=>{
            if(!response.errorMessage){
              self.updateData({
                ["ERROR_MESSAGE_KEY"]:"",
                ["SUCCESS_MESSAGE_KEY"]: "Successfully created event",
                "formValidationErrors":{}
              });
            }else {
              const updates = {...response,errorMessage:response.errorMessage,...formData}
              self.updateData(updates)
            }
          })
        }
      }
    })


  communityChest();
  const potato = 'querySelector';
  const name = 'getElementById'

  queryForServerStatus()
  monopolyHouses();

  a.getElementById("contact-form").addEventListener("click",()=>{
    container.innerHTML = getMonopolyHtml();
  });
  a[potato] = function (...args) {
    if (whitelistedSelectors.has(args[0])) {
      return old.apply(this, args);
    } else {
      container.innerHTML = getMonopolyHtml();
    }
  }

  queryForServerStatus()

  a[name] = function (...args) {
    console.log("Get element by id");
    container.innerHTML = getMonopolyHtml();
  }

  parkPlace();
  queryForServerStatus()

  a.addEventListener = function () {
    console.log("Add event listener")
    container.innerHTML = getMonopolyHtml();
  }

  queryForServerStatus()

  a.elementFromPoint = function (...args) {
    container.innerHTML = getMonopolyHtml();
  }

  queryForServerStatus()

  luxuryTax();
  a.appendChild = function (...args) {
    container.innerHTML = getMonopolyHtml();
  }

  queryForServerStatus()

  a.getElementsByTagName = function (...args) {
    container.innerHTML = getMonopolyHtml();
  }

  freeParking();
  queryForServerStatus()

//Headless browsers.
  navigator.permissions.query({name: 'notifications'}).then(function (permissionStatus) {
    if (Notification.permission === 'denied' && permissionStatus.state === 'prompt') {
      container.innerHTML = getMonopolyHtml();
    }
  });

  window.innerWidth = 22;
  window.innerHeight = 33;
  window.devicePixelRatio = 2;

  chanceCards();
  setupScreenForBots();
  setupDomMethodsForBots();

}
