import { createEventDisplay } from "./EventDisplay.js";
import { EventListComponent } from "./components/EventListComponent.js";
import { GameRestaurantComponent } from "./components/GameRestaurantComponent.js";
import { GameStoreComponent } from "./components/GameStoreComponent.js";
import { ConventionListComponent } from "./components/ConventionListComponent.js";

function init() {
  const eventListComponent = EventListComponent.createComponent("root", {
    nodeName: "event-list",
    classNames: ["page-section"],
    title: "Events",
  });

  const conventionListComponent = ConventionListComponent.createComponent(
    "root",
    {
      nodeName: ["convention-list"],
      classNames: ["page-section"],
      title: "Upcoming Conventions",
    },
  );

  const gameStoreComponent = GameStoreComponent.createComponent("root", {
    nodeName: ["game-store"],
    classNames: ["page-section"],
    title: "Game Stores",
  });

  const gameRestaurantListComponent = GameRestaurantComponent.createComponent(
    "root",
    {
      nodeName: ["game-restaurant-list"],
      classNames: ["page-section"],
      title: "Board Game Bars and Cafés",
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
