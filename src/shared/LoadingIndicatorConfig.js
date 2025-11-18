import {LoadingIndicatorComponent} from "./components/LoadingIndicatorComponent.js";

export const LOADING_INDICATOR_CONFIG = {
  generateLoadingIndicatorHtml: ()=>{
    return `
      <loading-indicator-component
        image-path="/assets/images/meeple_small.png"
      >
      </loading-indicator-component>
  `
  },
  minTimeMs: 500,
}
