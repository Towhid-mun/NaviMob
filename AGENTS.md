# Repository Guidelines

## Project Structure & Module Organization
- `mobile/` hosts the React Native app: screens under `mobile/src/screens/`, shared UI in `mobile/src/components/`, and assets (fonts/images/icons) in `mobile/assets/`. App tests belong in `mobile/src/__tests__/`.
- `server/` contains the Express API with routes in `server/src/routes/`, logic in `server/src/controllers/`, and helpers under `server/src/services/` or `server/src/db/`. Backend tests live in `server/src/__tests__/`.
- Keep shared docs in `docs/` and extract helpers over ~40 lines into package-specific `utils/` modules.

## Build, Test, and Development Commands
- `cd mobile && npm install` or `cd server && npm install` installs dependencies for each package.
- `cd mobile && npm run android` launches Metro plus the Android build for rapid iteration.
- `cd server && npm run dev` starts the API with nodemon auto-reload.
- `npm run lint` inside either package applies ESLint + Prettier fixes.
- `npm test` or `npm test -- --coverage` executes Jest suites and reports coverage.

## Coding Style & Naming Conventions
- Follow the repo ESLint config: 2-space indents, semicolons, and double quotes within JSON. Run lint before committing.
- Name React components with PascalCase (e.g., `RoutePreviewCard.tsx`), hooks with a `use` prefix, and route files after their resource (`routes/distance.ts`).
- Keep domain logic in services/controllers and keep screens/components lean by delegating to helpers.

## Testing Guidelines
- Jest drives both clients; colocate specs in `__tests__` with `.test.tsx` or `.test.ts` suffixes.
- Maintain >=80% statement coverage; verify locally with `npm test -- --coverage` before pushing.
- Mock network/location APIs via fixtures in `test/mocks/` to keep tests deterministic.

## Commit & Pull Request Guidelines
- Use Conventional Commits (`feat: add ETA reducer`) and keep scopes tight. Document cross-package impacts in the body.
- PRs must outline motivation, enumerate key changes, link Jira/GitHub issues, and attach emulator screenshots for UI tweaks.
- Explicitly call out migrations, new env vars, or scripts reviewers must run prior to deploy.

## Security & Configuration Tips
- Never commit `.env*`; define placeholders in `.env.example` instead.
- The server expects `DATABASE_URL` and `MAPS_API_KEY`; the mobile app reads API keys from the Expo config.
- Run `scripts/check-env.sh` before releases and rotate credentials monthly.

