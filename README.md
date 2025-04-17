
This repo contains the source code for https://dmvboardgames.com/, a website to find public board game events in the DMV area.

## How to run locally with mocks
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

## How to run locally with API and database.
- Follow the same setup steps as the previous seciton
- See the following instructions for runing the API and database: https://github.com/Create-Third-Places/development
### Running unit tests

- node --test

### Running unit tests that have a specific word in their test file name
- node --test "**/*Event*"

### Running unit tests with a specific test name pattern
- node --test --test-name-pattern="empty result"



## Development process

1. Create a branch with the latest changes from the main branch.
2. Submit a PR with your changes.
3. After the PR is merged, the changes should be verified by running locally or using the test branch. A deployment will then automatically be attempted, and changes will be visible at https://test.dmvboardgames.com/ if the deployment is successful.
4. Once the changes are verified, a PR should be submitted from the main branch to the prod branch. Once the PR is merged, the changes will be automatically deployed to dmvboardgames.com


## Testing

- To test with the production API, set the DEPLOY_ENV variable to prod

## Other guidelines
- Keep PRs as small as possible. Large features should be broken down into multiple PRs when possible.
- If a PR has UI changes, it is helpful to include a screenshot of the change in the PR.






