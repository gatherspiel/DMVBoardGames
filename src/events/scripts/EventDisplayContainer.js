import { addChildComponent, getNode } from "../../framework/utils.js";
import { createEventDisplay } from "./EventDisplay.js";

function init() {
  const data = getNode("root");

  addChildComponent("root", {
    nodeName: "event-list",
    classNames: ["page-section"],
  });

  addChildComponent("root", {
    nodeName: ["convention-list"],
    classNames: ["page-section"],
  });

  addChildComponent("root", {
    nodeName: ["game-store-list"],
    classNames: ["page-section"],
  });
  addChildComponent("root", {
    nodeName: ["game-restaurant-list"],
    classNames: ["page-section"],
  });
  createEventDisplay();
}

init();
