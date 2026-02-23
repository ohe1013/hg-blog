import "server-only";
import { cert, getApps, initializeApp } from "firebase-admin/app";
import { Firestore, getFirestore, initializeFirestore } from "firebase-admin/firestore";
import { ConfigurationError } from "./feedback/errors";

function required(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new ConfigurationError(`Missing required environment variable: ${name}`);
  }
  return value;
}

function createFirebaseApp() {
  const projectId = required("FIREBASE_PROJECT_ID");
  const clientEmail = required("FIREBASE_CLIENT_EMAIL");
  const privateKey = required("FIREBASE_PRIVATE_KEY").replace(/\\n/g, "\n");

  return initializeApp({
    credential: cert({
      projectId,
      clientEmail,
      privateKey,
    }),
  });
}

export function getFirebaseFirestore(): Firestore {
  const app = getApps()[0] ?? createFirebaseApp();

  try {
    // REST transport avoids loading grpc stack in local dev and reduces noisy warnings.
    return initializeFirestore(app, { preferRest: true });
  } catch {
    // Firestore instance may already be initialized.
    return getFirestore(app);
  }
}
