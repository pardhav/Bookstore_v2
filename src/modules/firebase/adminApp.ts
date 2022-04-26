import admin from "firebase-admin";

// to avoid re-initialization during re-renders
if (admin.apps.length === 0) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.NEXT_PROJECT_ID,
      privateKey: process.env.NEXT_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      clientEmail: process.env.NEXT_CLIENT_EMAIL,
    }),
    databaseURL: process.env.NEXT_DB_URL,
  });
}

export { admin as FIREBASE_ADMIN };
