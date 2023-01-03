
## Dev Setup

- .eslintrc.js: prettier
- package.json: prettier, eslintIgnore
- .gitignore: tailwind
- pnpm exec tailwindcss init
- tailwind.config.js
- styles/tailwind.css
- root.tsx: import tailwindStylesheetUrl from "./styles/tailwind.css";
- tailwind.config.js plugins: require('@tailwindcss/forms')
- tailwind.config.js plugins: require('@tailwindcss/typography')
- pnpm dlx create-playwright
- ignoring playwright configuration error: HTML reporter output folder clashes with the tests output folder
- hack: ci uses .env.example?


## Vitest

- [Example with RTL and MSW](https://github.com/vitest-dev/vitest/tree/main/examples/react-testing-lib-msw)
- [Vite ts config paths](https://www.npmjs.com/package/vite-tsconfig-paths) included in blues
- [Weiruch Post](https://www.robinwieruch.de/vitest-react-testing-library/)
- [RTL Mistakes](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)

## Playwright

- pnpm dlx create-playwright
- sudo -E env PATH="$PATH" pnpm playwright install-deps
- [remix playwright vitest example](https://github.com/jacob-ebey/remix-vitest)
- pnpm playwright test
- pnpm playwright test --grep user customer
- pnpm playwright show-report e2e-results/playwright-report

# Welcome to Remix!

- [Remix Docs](https://remix.run/docs)

## Deployment

After having run the `create-remix` command and selected "Vercel" as a deployment target, you only need to [import your Git repository](https://vercel.com/new) into Vercel, and it will be deployed.

If you'd like to avoid using a Git repository, you can also deploy the directory by running [Vercel CLI](https://vercel.com/cli):

```sh
npm i -g vercel
vercel
```

It is generally recommended to use a Git repository, because future commits will then automatically be deployed by Vercel, through its [Git Integration](https://vercel.com/docs/concepts/git).

## Development

To run your Remix app locally, make sure your project's local dependencies are installed:

```sh
npm install
```

Afterwards, start the Remix development server like so:

```sh
npm run dev
```

Open up [http://localhost:3000](http://localhost:3000) and you should be ready to go!

If you're used to using the `vercel dev` command provided by [Vercel CLI](https://vercel.com/cli) instead, you can also use that, but it's not needed.
