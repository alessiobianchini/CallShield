## CallShield (React Native)

Base screens for spam blocking/identification and reporting, ready to hook to a backend (Azure Functions/App Service) and CallKit on iOS.

### Quick start
- Install JS deps: `npm install`
- Start Metro: `npm start`
- iOS: `bundle install && bundle exec pod install` in `ios`, then `npm run ios`
- Android: `npm run android`

### What the app does now
- Home with blocking/identification toggles, last update, report counter.
- Mock recent calls list with “Report” action.
- iOS checklist to activate the Call Directory extension (to be created in Xcode).

### To wire up
- Backend: see `docs/backend.md` for delta/report APIs using Azure Functions with Firestore or Cosmos DB.
- A sample Azure Functions project (Node 18 + Firestore) is in `backend/azure-functions/` (includes `list`, `report`, `feedback`).
- iOS Call Directory Extension: add a “CallDirectoryExtension” target in Xcode and call `CXCallDirectoryManager.reloadExtension()` from the app to apply the updated list.

### Quick notes
- Keep delta batches small to avoid Call Directory timeouts on iOS.
- Store `version` locally and send `since` to fetch only differences from your endpoints.
