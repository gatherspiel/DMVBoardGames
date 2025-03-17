
This repo contains the source code for https://dmvboardgames.com/, a website to find public board game events in the DMV area.

## How to run locally

### Setup
-npm install
-npm install --save-dev --save-exact prettier
### Running in dev mode
-npm run dev
### Creating a preview
-npm run build
-npm run preview

### Running unit tests

-node --test

### Running unit tests that have a specific word in their test file name
node --test "**/*Event*"

### Running unit tests with a specific test name pattern
node --test --test-name-pattern="empty result"



## Development proccess

-Create a branch with the latest changes from the main branch.
-Submit a PR with your changes.
-After the PR is merged, the changes should be verified by running locally or using the test branch
-Once the changes are verified, a PR should be submitted from the main branch to the prod branch. Once the PR is merged, the changes will be automatically deployed to dmvboardgames.com

## Other guidelines
- Keep PRs as small as possible. Large features should be broken down into multiple PRs when possible.
- If a PR has UI changes, it is helpful to include a screenshot of the chagne in the PR.






