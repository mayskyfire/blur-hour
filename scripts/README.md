# Scripts

## Seeding Icebreakers to Firebase

To populate the `icebreakers` collection in Firebase:

1. **Download service account key** from Firebase Console:
   - Go to Project Settings > Service Accounts
   - Click "Generate new private key"
   - Save as `serviceAccountKey.json` in project root

2. **Run the seeder**:
   ```bash
   npm run seed:icebreakers
   ```

This will create 10 icebreaker questions in the `icebreakers` collection with Thai language content.
