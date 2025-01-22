const CONTAINER_ROOT_KEY = "data-container";

export function getNode(name) {
  return document.querySelector(`[${CONTAINER_ROOT_KEY}=${name}]`);
}

//TODO: Make sure the components are initialized with data
export function addChildComponent(parentNodeName, data) {
  const id = data.nodeName;
  const classNames = data.classNames;

  const parentNode = getNode(parentNodeName);
  parentNode.innerHTML += `
    <div id=${id} className=${classNames.join(" ")}   
    </div>
  
  `;
}
