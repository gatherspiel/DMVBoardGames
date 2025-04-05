<p align="center">
  <img src="public/DMV_board_games_site_pic_600.png" alt="DMV Board Games Logo" width="200"/>
</p>

<h1 align="center">DMV Board Games</h1>

<p align="center">
  A website to find public board game events in the DMV (DC, Maryland, Virginia) area.
</p>

<p align="center">
  <a href="https://github.com/Create-Third-Places/DMVBoardGames/blob/main/LICENSE">
    <img src="https://img.shields.io/badge/License-GPLv3-blue.svg" alt="License: GPL v3"/>
  </a>
  <a href="https://github.com/Create-Third-Places/DMVBoardGames/issues">
    <img src="https://img.shields.io/github/issues/Create-Third-Places/DMVBoardGames" alt="Issues"/>
  </a>
  <a href="https://github.com/Create-Third-Places/DMVBoardGames/pulls">
    <img src="https://img.shields.io/github/issues-pr/Create-Third-Places/DMVBoardGames" alt="Pull Requests"/>
  </a>
  <a href="https://github.com/Create-Third-Places/DMVBoardGames/stargazers">
    <img src="https://img.shields.io/github/stars/Create-Third-Places/DMVBoardGames?style=social" alt="GitHub Stars"/>
  </a>
</p>

---

#### This repo contains the source code for [DMV Board Games](https://dmvboardgames.com/), a website to find public board game events in the DMV area.

## 🚀 Features

- Discover public board game events in the DMV region.
- Filter and search events by location and day
- View by category: conventions, game stores, restaurants, and group meetups.
- Admin panel for managing listings.
- Clean and responsive interface with modular components.

---

## 🛠 Tech Stack

- **Frontend**: [Vite](https://vitejs.dev/) for fast development and build.
- **Backend Services**: [Supabase](https://supabase.com/) for authentication, database, and storage.
- **Tooling**:
  - [ESLint](https://eslint.org/) for linting JavaScript.
  - [Prettier](https://prettier.io/) for consistent code formatting.

---

## 📁 Folder Structure

```
.
├── CNAME
├── eslint.config.js
├── index.html
├── LICENSE
├── package.json
├── package-lock.json
├── public/
│   ├── admin/
│   ├── designers.html
│   ├── plans.html
│   └── styles/
├── README.md
├── src/
│   ├── admin/
│   ├── events/
│   │   └── scripts/
│   │       ├── components/
│   │       │   └── shared/
│   │       ├── data/
│   │           ├── json/
│   │           ├── search/
│   │           │   └── model/
│   │           └── state/
│   ├── framework/
├── test/
│   ├── events/
│   │   └── scripts/
│   │       └── data/
│   │           └── search/
└── vite.config.ts
```

---

## ⚙️ Installation & Local Development

### Clone the repository
```bash
git clone https://github.com/Create-Third-Places/DMVBoardGames.git
cd DMVBoardGames
```

### Setup
```bash
npm install
npm install --save-dev --save-exact prettier
```

### Running in Development Mode
```bash
npm run dev
```
- Open ```http://localhost:5173/```

### Creating a Preview
```bash
npm run build
npm run preview
```

- Open ```http://localhost:4173/```

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

---

## 👨‍💻 Contributing

Follow these steps to contribute to the project:

1. **Fork** the repository.
2. **Clone** your fork:
   ```bash
   git clone https://github.com/your-username/DMVBoardGames.git
   cd DMVBoardGames
   ```
3. **Create a new branch** for your changes:
   ```bash
   git checkout -b feature/your-feature-name
   ```
4. **Make your changes** and commit:
   ```bash
   git add .
   git commit -m "Add your message here"
   ```
5. **Push** the changes:
   ```bash
   git push origin feature/your-feature-name
   ```
6. **Submit a Pull Request** from your branch to the `main` branch.

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

---

## 📜 License

This project is licensed under the [GNU GPL v3.0 License](./LICENSE).

---

> Made with ❤️ for the DMV board gaming community!
