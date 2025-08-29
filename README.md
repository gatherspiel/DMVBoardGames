
This repo contains the source code for https://dmvboardgames.com/, a website to find public board game events in the DMV area.

## Contribution guidelines

Go to the following page to view general development guidelines for the project: h[ttps://github.com/Create-Third-Places](https://github.com/gatherspiel)

Also, follow the guidelines below:
- Keep PRs as small as possible. Large features should be broken down into multiple PRs when possible.
- If a PR has UI changes, it is helpful to include a screenshot of the change in the PR.
- Code that is associated with a specific part of the UI should be in the src/events/scripts folder.
- JavaScript logic is not associated with a specific part of the UI should be placed in the src/framework folder.
- UI elements that are dynamic or will be used multiple times should be implemented as [Web Components](https://developer.mozilla.org/en-US/docs/Web/API/Web_components).
- For new files, TypeScript should be used.


## Development


### Setup
- npm install
- npm install --save-dev --save-exact prettier
  
### Running in dev mode
- npm run dev

-If you want to test local changes to the places-js package. publish the package locally using yalc. Then
run yalc add @bponnaluri/places-js 
### Creating a preview
- npm run build
- npm run preview

### How to run locally with API and database.
- Follow the same setup steps as the previous seciton
- See the following instructions for running the API and database: https://github.com/Create-Third-Places/development



## Testing

- To test with the production API, set the DEPLOY_ENV variable to prod






