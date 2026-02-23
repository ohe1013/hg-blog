# Firebase Feedback Setup

This project now supports `guestbook` and `contact` APIs backed by Firestore.

## 1) Environment Variables

Copy `.env.example` to `.env.local` and fill these:

- `FEEDBACK_REPOSITORY=firebase`
- `FEEDBACK_IP_HASH_SALT=...`
- `FEEDBACK_PASSWORD_SALT=...`
- `FIREBASE_PROJECT_ID=...`
- `FIREBASE_CLIENT_EMAIL=...`
- `FIREBASE_PRIVATE_KEY="...\\n...\\n"`
- Optional web config:
- `NEXT_PUBLIC_FIREBASE_API_KEY=...`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID=...`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...`
- `NEXT_PUBLIC_FIREBASE_APP_ID=...`
- `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=...`

`FIREBASE_PRIVATE_KEY` must keep `\\n` line breaks in a single-line env value.

Important:

- The values like `apiKey/authDomain/projectId` from your Firebase web config are not enough for the current backend implementation.
- Current API routes (`/api/guestbook`, `/api/contact`) use `firebase-admin`, so service-account fields are required:
- `FIREBASE_CLIENT_EMAIL`
- `FIREBASE_PRIVATE_KEY`

## 2) Firestore Collections

Create collections:

- `guestbook_entries`
- `contact_messages`

Before creating collections, make sure Firestore API is enabled for the project:

- https://console.developers.google.com/apis/api/firestore.googleapis.com/overview?project=YOUR_PROJECT_ID
- Firebase Console -> Build -> Firestore Database -> Create database

Document examples:

`guestbook_entries/{id}`

- `nickname` string
- `passwordHash` string
- `message` string
- `status` string (`published` | `hidden` | `spam`)
- `createdAt` timestamp
- `ipHash` string
- `userAgent` string | null

`contact_messages/{id}`

- `name` string
- `email` string
- `subject` string
- `message` string
- `status` string (`new` | `read` | `replied` | `spam` | `archived`)
- `createdAt` timestamp
- `ipHash` string
- `userAgent` string | null

## 3) Indexes

Create this index for guestbook list query:

- Collection: `guestbook_entries`
- Fields:
- `status` Asc
- `createdAt` Desc

Note:

- The server now has a fallback path that still returns list results without this index.
- For production traffic, creating this index is still recommended for stable pagination/performance.

## 4) API Endpoints

- `GET /api/guestbook?limit=20&cursor=...`
- `POST /api/guestbook`
- `PATCH /api/guestbook/{id}` (requires entry password in body, status: `hidden` or `published`)
- `DELETE /api/guestbook/{id}` (requires entry password in body)
- `POST /api/contact`

If you need local testing without Firebase, set:

- `FEEDBACK_REPOSITORY=memory`
