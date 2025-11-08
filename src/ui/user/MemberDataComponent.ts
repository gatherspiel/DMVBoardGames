import {BaseDynamicComponent} from "@bponnaluri/places-js";


export class MemberDataComponent extends BaseDynamicComponent {

  constructor() {
    super();
  }
  override getTemplateStyle():string {
    return `
      <link rel="stylesheet" type="text/css"  href="/styles/sharedHtmlAndComponentStyles.css"/>
      <style>
   
      </style>
    `
  }

  connectedCallback(){
    this.updateData({})
  }


  render(data:any){
    console.log(data)
    return `
      <h1>Data for user</h1>
    `
  }
}