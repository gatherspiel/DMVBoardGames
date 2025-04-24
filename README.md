
This repo contains the source code for https://dmvboardgames.com/, a website to find public board game events in the DMV area.

## Contribution guidelines

Go to the following page to view general development guidelines for the project: https://github.com/Create-Third-Places

Also, follow the guidelines below:
- Keep PRs as small as possible. Large features should be broken down into multiple PRs when possible.
- If a PR has UI changes, it is helpful to include a screenshot of the change in the PR.
- JavaScript logic that is associated with a specific part of the UI should be in the src/events/scripts folder.
- If JavaScript logic is not associated with a specific component, it should be placed in the src/framework folder.
- If JavaScript is used to update a part of the UI, it should be implemented as a [Web Component](https://developer.mozilla.org/en-US/docs/Web/API/Web_components).


## Development

### How to run locally with mocks
Note: This enables the UI to run locally without the API by using mocks. The mocks consist of hardcoded data that will simulate API responses which may not be reflect the actual UI state.
They should only be used when attempting to test UI changes that do not depend on API results.

### Setup
- npm install
- npm install --save-dev --save-exact prettier
  
### Running in dev mode
- npm run dev
  
### Creating a preview
- npm run build
- npm run preview

### How to run locally with API and database.
- Follow the same setup steps as the previous seciton
- See the following instructions for runing the API and database: https://github.com/Create-Third-Places/development



## Testing

- To test with the production API, set the DEPLOY_ENV variable to prod






