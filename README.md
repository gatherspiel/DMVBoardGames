# DMV Board Games

A website to find public board game events in the DMV area.

#### This repo contains the source code for [DMV Board Games](https://dmvboardgames.com/), a website to find public board game events in the DMV area.


## Features

- Discover public board game events in the DMV region
- Filter and search events by location and day
- Click "Show Info" to view more details about the event
- View by category: conventions, game stores, Bars and Cafés
- Clean and responsive interface


## Tech Stack

Please refer to `Tech Stack` section available [here](https://github.com/Create-Third-Places/.github/blob/main/profile/README.md).


## Installation & Local Development

### Setup
```bash
npm install
npm install --save-dev --save-exact prettier
```

### Running in Development Mode
```bash
npm run dev
```

### Creating a Preview
```bash
npm run build
npm run preview
```

### Running Unit Tests
```bash
node --test
```

#### Run tests with specific file name pattern
```bash
node --test "**/*Event*"
```

#### Run tests with specific test name
```bash
node --test --test-name-pattern="empty result"
```


## Contributing

Follow `Development guidelines` from [here](https://github.com/Create-Third-Places/.github/blob/main/profile/README.md) to contribute to the project.

### Development Process

1. Create a branch from the latest `main`.
2. Submit a PR with your changes.
3. After the PR is merged, the changes should be verified by running locally or using the test branch. A deployment will then automatically be attempted, and changes will be visible at `https://test.dmvboardgames.com/` if the deployment is successful.
4. Once the changes are verified, a PR should be submitted from the `main` branch to the `prod` branch. Once the PR is merged, the changes will be automatically deployed to `https://dmvboardgames.com/`.

### Other guidelines

- Keep PRs as small as possible. Large features should be broken down into multiple PRs when possible.
- If a PR has UI changes, it is helpful to include a screenshot of the chagne in the PR.
