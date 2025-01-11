import { GROUP_DATA } from "./GroupData.js";

const stateData = {};

function buttonClickHandler(evt) {
  console.log("Testing");
  console.log(evt);
}

function displayListing(groupData) {
  console.log(groupData);
  let html = "";
  Object.values(groupData).forEach((group) => {
    let groupHtml = "";
    groupHtml = `
      <div id=${group.id}>
        <h2>
          <a href=${group.link}>${group.title}</a>
          <span>:&nbsp;${group.locations.replaceAll(",", ", ")}</span>
        </h2>  
        
        <button onClick="${buttonClickHandler}">
          Click
        </button>

      </div>
    `;
    html += groupHtml;
  });

  document.querySelector("#listing").innerHTML = html;
}
console.log("Setting up event listing");
displayListing(GROUP_DATA);
