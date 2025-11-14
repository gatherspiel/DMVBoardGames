import {BaseDynamicComponent} from "@bponnaluri/places-js";
import {USER_MEMBER_STORE} from "../../data/user/UserMemberStore.ts";
import {convertDateAndDayToDisplayString} from "../../shared/EventDataUtils.ts";


export class MemberDataComponent extends BaseDynamicComponent {

  constructor() {
    super([{
      dataStore: USER_MEMBER_STORE
    }]);
  }

  override getTemplateStyle():string {
    return `
      <link rel="stylesheet" type="text/css"  href="/styles/sharedHtmlAndComponentStyles.css"/>
      <style>
        a {
          margin-right: 0.5rem;
        }
        h1 {
          margin-top:1.5rem;
        }
        h2 {
          margin-top:0.5rem;
        }
      </style>
    `
  }

  connectedCallback(){
    this.updateData({
      moderatingGroups:[],
      joinedGroups:[],
      attendingEvents:[],
      moderatingEvents:[]

    })
  }

  render(data:any){
    const html = `
      <h1>MemberData</h1>
      ${this.getModeratingGroupsHtml(data.moderatingGroups)}
      ${this.getModeratingEventsHtml(data.moderatingEvents)}
      ${this.getJoinedGroupsHtml(data.joinedGroups)}
      ${this.getAttendingEventsHtml(data.attendingEvents)}
    `
    return html;
  }

  getModeratingGroupsHtml(moderatingGroups:any){

    if(moderatingGroups.length === 0){
      return ``;
    }

    let html = ``
    for(let i=0;i<moderatingGroups.length;i++){
      const groupName = moderatingGroups[i].name;
      if(groupName){
        html+=`<li><a href="/html/groups/groups.html?name=${encodeURIComponent(groupName)}">${groupName}</a></li>`

      }
    }
    return `
      <h2>Moderating groups: </h2>
      <ul>${html}</ul>`;
  }

  getModeratingEventsHtml(moderatingEvents:any){

    if(moderatingEvents.length === 0){
      return ``;
    }

    let html = ``
    for(let i=0;i<moderatingEvents.length;i++){
      const eventId = moderatingEvents[i].id;
      const eventName = moderatingEvents[i].name;
      const groupId = moderatingEvents[i].groupId;
      html+=`<li>
        ${convertDateAndDayToDisplayString(moderatingEvents[i].startDate, moderatingEvents[i].day)}
        &#8729; ${(moderatingEvents[i].startTime)}
        <a href="/html/groups/event.html?id=${eventId}&groupId=${groupId}">${eventName}</a>
      </li>`
    }
    return `
      <h2>Moderating events: </h2>
      <ul>${html}</ul>`;
  }

  getJoinedGroupsHtml(joinedGroups:any){
    if(joinedGroups.length === 0){
      return ``;
    }

    let html = ``;

    for(let i=0;i<joinedGroups.length;i++){
      const groupName = joinedGroups[i].name;
      html+=`<li><a href="/html/groups/groups.html?name=${encodeURIComponent(groupName)}">${groupName}</a></li>`
    }
    return `
      <h2>Joined groups: </h2>
      <ul>${html}</ul>`;
  }

  getAttendingEventsHtml(attendingEvents:any){

    if(attendingEvents.length === 0){
      return ``;
    }

    let html = ``

    for(let i=0;i<attendingEvents.length;i++){
      const eventId = attendingEvents[i].id;
      const eventName = attendingEvents[i].name;
      const groupId = attendingEvents[i].groupId;

      html+=`
        <li>
          ${convertDateAndDayToDisplayString(attendingEvents[i].startDate, attendingEvents[i].day)}
          &#8729; ${(attendingEvents[i].startTime)}
          <a href="/html/groups/event.html?id=${eventId}&groupId=${groupId}">${eventName}</a>
        </li>
        `
    }
    return `
      <h2>Attending events:</h2>
      <ul>${html}</ul>`;
  }
}