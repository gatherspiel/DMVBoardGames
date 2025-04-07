# DMV Board Games

A website to find public board game events in the DMV (DC, Maryland, Virginia) area.

#### This repo contains the source code for [DMV Board Games](https://dmvboardgames.com/), a website to find public board game events in the DMV area.


## Features

- Discover public board game events in the DMV region.
- Filter and search events by location and day
- View by category: conventions, game stores, restaurants, and group meetups.
- Admin panel for managing listings.
- Clean and responsive interface with modular components.


## Tech Stack

### **Frontend**: 
- Vanilla JavaScript on the UI
- Vanilla CSS
- Vite for fast development and build.

### **Backend Services**:
- Java
- PostgreSQL
- Supabase


## Folder Structure

```
.
├── public/
│   ├── admin/
│   └── styles/
├── README.md
├── src/
│   ├── admin/
│   ├── events/
│   ├── framework/
├── test/
│   ├── events/
├── CNAME
├── eslint.config.js
├── index.html
├── LICENSE
├── package.json
├── package-lock.json
└── vite.config.ts
```


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

Follow `Development guidelines` from [HERE](https://github.com/Create-Third-Places/.github/blob/main/profile/README.md) to contribute to the project.

### Development Process

1. Create a branch from the latest `main`.
2. Submit a PR with your changes.
3. After merging, changes can be verified locally or at the test deployment:  
   `https://test.dmvboardgames.com/`
4. Once verified, submit a PR from `main` to `prod` to deploy at:  
   `https://dmvboardgames.com/`

### Other guidelines

- Keep PRs as small as possible. Large features should be broken down into multiple PRs when possible.
- If a PR has UI changes, it is helpful to include a screenshot of the chagne in the PR.


## License

This project is licensed under the [GNU GPL v3.0 License](./LICENSE).


> Made with ❤️ for the DMV board gaming community!
