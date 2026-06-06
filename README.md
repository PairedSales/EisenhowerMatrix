# Eisenhower Matrix Web App

A client-side Eisenhower Matrix web application built with React, Vite, TypeScript, Zustand, and Tailwind CSS.

## Features
- **Offline First**: All data is persisted to your browser's `localStorage`. It works fully offline.
- **Drag and Drop**: Smoothly reorder and move tasks between quadrants using dnd-kit.
- **Export / Import**: Backup your matrix to a JSON file or restore it anytime.
- **Dark Mode**: Fully supports light and dark themes.
- **Responsive**: Fully functional on desktop and mobile.

## Local Development

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the dev server:
   ```bash
   npm run dev
   ```

3. Build for production:
   ```bash
   npm run build
   ```

## GitHub Pages Deployment

To deploy to GitHub Pages:

1. The `vite.config.ts` is configured to use the `/EisenhowerMatrix/` base path if `VITE_GITHUB_PAGES` is set, or it can be hardcoded. Make sure the `base` matches your repository name if hosting at `username.github.io/repo-name`.
2. Run `npm run build`.
3. The `.nojekyll` file in the `public` directory ensures GitHub Pages doesn't ignore files starting with underscores (which Vite generates).
4. Commit the `dist` directory or use a GitHub Action to deploy the contents of `dist` to your `gh-pages` branch.
