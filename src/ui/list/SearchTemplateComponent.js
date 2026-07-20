import { BaseDynamicComponent } from "/lib/places-js-latest.js";

export class SearchTemplateComponent extens BaseTemplateComponent {

  getTemplateStyle() {
    return `
      <link rel="stylesheet" type="text/css" href="/styles/sharedHtmlAndComponentStyles.css"/>
      <link rel="stylesheet" type="text/css" href="/styles/kelp.css"/> 
  
    `;
  }
	
	render(){
		return `<search-component></search-component>
	}


}
