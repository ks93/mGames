# mGames

A modern collection of browser-based games built with Next.js and TypeScript.

## Getting Started

First, install the dependencies:

```bash
npm install
```

Then, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Development

- `src/app/page.tsx` - The home page
- `src/app/games/page.tsx` - The games listing page
- `src/app/layout.tsx` - The main layout component

## Deployment to GitHub Pages

1. Push your changes to the main branch
2. Build the project:
   ```bash
   npm run build
   ```
3. The static files will be generated in the `out` directory
4. Enable GitHub Pages in your repository settings and set it to deploy from the `gh-pages` branch
5. Create and push to the gh-pages branch:
   ```bash
   git checkout -b gh-pages
   git add out/
   git commit -m "Deploy to GitHub Pages"
   git push origin gh-pages
   ```

## Technologies Used

- Next.js 14
- TypeScript
- Tailwind CSS
- ESLint

## License

This project is licensed under the MIT License.
