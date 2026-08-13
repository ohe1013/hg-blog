import assert from "node:assert/strict";
import test from "node:test";

import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getFirestore, initializeFirestore } from "firebase-admin/firestore";

test("Firebase Admin exports used by the server repository resolve", () => {
  assert.equal(typeof cert, "function");
  assert.equal(typeof getApps, "function");
  assert.equal(typeof initializeApp, "function");
  assert.equal(typeof getFirestore, "function");
  assert.equal(typeof initializeFirestore, "function");
});
