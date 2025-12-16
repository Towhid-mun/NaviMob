# instruction

## Delivery Plan
1. **Phase 1 – Core mobile shell**: Implement permission handling, reusable UI shell, and baseline map rendering fed by the device’s GPS feed (expo-location). Stub destination input wired to local state.
2. **Phase 2 – Backend services**: Build Express REST API backed by PostgreSQL for logging trips. Integrate Mapbox geocoding + directions to return distance, ETA, and polyline data. Harden validation with Zod and error handling middleware.
3. **Phase 3 – Realtime loop**: Connect the React Native client to `/api/navigation/route`, throttle updates every 15s as the origin changes, and surface metrics (distance, ETA) plus polylines on `react-native-maps`.
4. **Phase 4 – Enhancements**: Add offline caching, destination autocomplete, and background location tasks before submitting to the Play Store. Expand testing (Jest/unit on shared hooks + supertest for API).

## Frontend (React Native / Expo)
1. **Install dependencies**: `cd mobile && npm install` (already ran when scaffolding). Ensure Node 20+ and the Expo CLI are available.
2. **Environment variables**: copy `.env.example` to `.env` and set `EXPO_PUBLIC_API_URL` to the backend URL (e.g., `http://10.0.2.2:4000` for Android emulators).
3. **Android tooling**: install Android Studio + SDK 34, create an emulator, and enable USB debugging for on-device testing.
4. **Run the app**: `npm run android` from `mobile/` to launch Metro and deploy to the emulator. Live reload keeps the map + metrics in sync with backend responses.
5. **Key libraries**: Expo SDK 54, `react-native-maps` for the route layer, `expo-location` for permission + tracking, and React Query for network cache + retries.

## Backend (Express + PostgreSQL)
1. **Install dependencies**: `cd server && npm install`.
2. **Configure `.env`** based on `.env.example` – set `PORT`, `DATABASE_URL`, and `MAPS_API_KEY` (Mapbox access token required for geocoding + directions).
3. **Database prep**: ensure PostgreSQL is running and execute `npm run migrate` to create the `trip_logs` table + `pgcrypto` extension.
4. **Start API**: `npm run dev` for hot reload via nodemon or `npm start` for production mode. Health check at `GET /health`; main endpoint `POST /api/navigation/route` accepts `{ origin: { latitude, longitude }, destinationAddress }`.
5. **Integration**: Expo client reads the backend base URL from `expo.extra.apiUrl` / `EXPO_PUBLIC_API_URL`. Successful responses include distance (m), duration (s), ISO ETA, destination metadata, and polyline arrays the mobile map consumes.

## Testing & Next Steps
- Add Jest tests for `useLocationTracking` (mocking `expo-location`) and service/controller layers via supertest.
- Configure CI (GitHub Actions) to run `npm run android -- --no-interactive` for lint/unit tests and `npm run test` in `server/`.
- Monitor rate limits and set Mapbox usage alerts before releasing a public beta.
