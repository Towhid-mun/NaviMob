# NaviMob

Navigation experience built with a React Native client and an Express/PostgreSQL backend. The repo hosts both codebases and keeps them in sync.

## Server (Express + PostgreSQL)

### Environment Setup
- Install Node.js 20+ and PostgreSQL 14+.
- Copy `server/.env.example` to `server/.env` and set:
  - `PORT=4000`
  - `DATABASE_URL=postgres://user:password@localhost:5432/navimob`
  - `MAPS_API_KEY=<your Mapbox token starting with pk.>`
- From `server/`, install dependencies:
  ```bash
  cd server
  npm install
  npm run migrate
  ```

### Development & Running
- Start the API with hot reload: `npm run dev`.
- Production build: `npm start`.
- The API listens on `http://localhost:4000` with endpoints under `/api/navigation` (route, geocode, history).

### Testing & Tooling
- Lint/format: `npm run lint` (if configured).
- Tests (Jest/Supertest when added): `npm test`.
- Database helpers auto-create required tables (trip logs + address history) if they do not exist.

## Mobile Client (React Native / Expo)

### Environment Setup
- Install Node.js 20+ and Expo CLI (`npm install -g expo-cli`).
- Set `EXPO_PUBLIC_API_URL` (or `expo.extra.apiUrl`) to the server URL, e.g. `http://10.0.2.2:4000` for Android emulators.
- Install dependencies:
  ```bash
  cd mobile
  npm install
  ```

### Development & Running
- Android emulator: `npm run android` (launches Metro + installs the app).
- iOS simulator: `npm run ios` (requires macOS + Xcode) or use Expo Go on-device.
- Web preview: `npx expo start --web`.

### Features
- Home screen shows current location map and destination search with type-ahead history suggestions.
- Navigate screen renders a live route map, ETA/distance metrics, and persists destinations.
- React Query caches API calls; history suggestions update when returning to the Home screen.

### Debugging Tips
- Metro logs (headers with `[history] ...`) reveal the latest history payloads.
- Enable remote JS debugging in Expo Go if you need console output in a browser console.

---

## Repository Scripts
- `git clone https://github.com/Towhid-mun/NaviMob.git`
- Install dependencies separately in `server/` and `mobile/` as described above.
- Commit using Conventional Commits (`feat:`, `fix:`, `chore:`) when contributing.

Happy building!
