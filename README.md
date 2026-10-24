# create-svelte

Everything you need to build a Svelte project, powered by [`create-svelte`](https://github.com/sveltejs/kit/tree/main/packages/create-svelte).

## Creating a project

If you're seeing this, you've probably already done this step. Congrats!

```bash
# create a new project in the current directory
npm create svelte@latest

# create a new project in shelf-beauty
npm create svelte@latest shelf-beauty
```

## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Homepage promotions

The `/vi` and `/en` homepages advertise these offers through December 31, 2026, inclusive:

- 30% off in-stock Nailbox sets and accessories.
- 10% off all services every Tuesday and Wednesday, 8:30 AM–12:00 PM.

Both translations live in `src/routes/[lang=lang]/+page.svelte`. The campaign copy is static; update or remove it after December 31, 2026.

## Building

To create a production version of your app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://kit.svelte.dev/docs/adapters) for your target environment.
