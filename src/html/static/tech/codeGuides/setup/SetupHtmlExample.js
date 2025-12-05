import {HtmlCodeDisplayComponent} from "../../../../../shared/components/HtmlCodeDisplayComponent.js";

export class SetupHtmlExample extends HtmlCodeDisplayComponent {
  getCode(){
    return `

<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Example</title>
    <script  type="module">
      import { FeedbackComponent } from "FeedbackComponent.js";
      customElements.define("feedback-component", FeedbackComponent);
    </script>
  </head>
  <body>
   <feedback-component"> </feedback-component>
  </body>
</html>

    `
  }
}