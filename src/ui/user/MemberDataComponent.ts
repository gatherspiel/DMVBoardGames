import {BaseDynamicComponent} from "@bponnaluri/places-js";
import {USER_MEMBER_STORE} from "../../data/user/UserMemberStore.ts";


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

    let html = `<h2>Moderating groups: </h2>`
    for(let i=0;i<moderatingGroups.length;i++){
      const groupName = moderatingGroups[i].name;
      html+=`<a href="/html/groups/groups.html?name=${encodeURIComponent(groupName)}">${groupName}</a>`
    }
    return html;
  }

  getModeratingEventsHtml(moderatingEvents:any){

    if(moderatingEvents.length === 0){
      return ``;
    }

    let html = `<h2>Moderating events: </h2>`
    for(let i=0;i<moderatingEvents.length;i++){
      const eventName = moderatingEvents[i].name;
      html+=`<a href="/html/groups/groups.html?name=${eventName}">${eventName}</a>`
    }
    return html;
  }

  getJoinedGroupsHtml(joinedGroups:any){
    if(joinedGroups.length === 0){
      return ``;
    }

    let html = `<h2>Joined groups: </h2>`

    for(let i=0;i<joinedGroups.length;i++){
      const groupName = joinedGroups[i].name;
      html+=`<a href="/html/groups/groups.html?name=${groupName}">${groupName}</a>`
    }
    return html;
  }


  getAttendingEventsHtml(attendingEvents:any){

    if(attendingEvents.length === 0){
      return ``;
    }

    let html = `<h2>Attending events</h2>`

    for(let i=0;i<attendingEvents.length;i++){
      const eventName = attendingEvents[i].name;
      html+=`<a href="/html/groups/groups.html?name=${eventName}">${eventName}</a>`
    }
    return html;
  }
}