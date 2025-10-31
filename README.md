
This repo contains the source code for https://dmvboardgames.com/, a website to find in person public board game events in the DMV area. This repo will also be used a template for other developers who want to make their own local event hosting sites.


To see more technical details about the project, go [here](dmvboardgames.com/html/static/code.html)

## Contribution guidelines

If you find a bug or have a recommendation for an area of improvement, create a GitHub issue or email gulu@createthirdplaces.com.
Go to the following page to view general development guidelines for the project: [here](https://github.com/gatherspiel)

Also, follow the guidelines below:
- Keep PRs as small as possible. Large features should be broken down into multiple PRs when possible.
- If a PR has UI changes, include a screenshot of the change in the PR.
- UI elements that are dynamic or will be used multiple times should be implemented as [Web Components](https://developer.mozilla.org/en-US/docs/Web/API/Web_components).
- For new files, TypeScript should be used.

## Development

### Setup
- npm install
- npm install --save-dev --save-exact prettier
  
### Running in dev mode
- npm run dev
-If you want to test local changes to the places-js package used as a framework for this project, publish the package locally using yalc. Then
run yalc add @bponnaluri/places-js 

### Creating a preview of a production build
- npm run build
- npm run preview

### How to run locally with API and database
- Follow the same setup steps as the previous section.
- See the following instructions for running the API and database: [Backend setup](https://github.com/gatherspiel/backend)
