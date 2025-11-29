export class TableOfContentsComponent extends HTMLElement{

  connectedCallback(){

    let tableOfContents = `<h2>Table of contents</h2>`;

    let count = 0;
    this.querySelectorAll(".section-1").forEach(element=>{
      element.id = "header-"+count;

      const title = element.querySelector("h2").textContent;

      let sectionHtml = ``;
       let sectionCount = 0;
      element.querySelectorAll("h3").forEach(sectionElement=>{

        sectionElement.id = "section-header-" + sectionCount +"-"+count;

        sectionHtml+=`
          <li>
            <a class="summary-header" href="#${sectionElement.id}">${sectionElement.textContent}</a></br>
          </li>
        `
        sectionCount ++;
      })


      if(sectionHtml.length !==0){
        tableOfContents += `
          <details>
          <summary><a  href="#${element.id}">${title}</a><br></summary>
            <ul>
              ${sectionHtml}
            </ul>
          </details>
        `
      } else {
        tableOfContents += `<a class="summary-header" href="#${element.id}">${title}</a><br>`
      }

      count++;
    })
    this.innerHTML = tableOfContents + this.innerHTML;
  }
}