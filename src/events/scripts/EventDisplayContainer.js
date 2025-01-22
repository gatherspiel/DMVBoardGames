import { createEventDisplay } from "./EventDisplay.js";
import { Component } from "../../framework/Component.js";
import { EventListComponent } from "./components/EventListComponent.js";
import { GameRestaurantComponent } from "./components/GameRestaurantComponent.js";
import { GameStoreComponent } from "./components/GameStoreComponent.js";
import { ConventionListComponent } from "./components/ConventionListComponent.js";

function init() {
  const eventListComponent = EventListComponent.createComponent("root", {
    nodeName: "event-list",
    classNames: ["page-section"],
  });

  const conventionListComponent = ConventionListComponent.createComponent(
    "root",
    {
      nodeName: ["convention-list"],
      classNames: ["page-section"],
    },
  );

  const gameStoreComponent = GameStoreComponent.createComponent("root", {
    nodeName: ["game-store"],
    classNames: ["page-section"],
  });

  const gameRestaurantListComponent = GameRestaurantComponent.createComponent(
    "root",
    {
      nodeName: ["game-restaurant-list"],
      classNames: ["page-section"],
    },
  );
  createEventDisplay(
    eventListComponent,
    conventionListComponent,
    gameStoreComponent,
    gameRestaurantListComponent,
  );
}

init();
