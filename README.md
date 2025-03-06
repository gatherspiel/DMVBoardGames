
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
