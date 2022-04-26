import { doc, getDoc, updateDoc } from "firebase/firestore";
import { FIREBASE_DB } from "./clientApp";

export async function updateUserInfo(values: any, email: string) {
  const bookDoc = doc(FIREBASE_DB, "Users", email);
  const bookRef = await updateDoc(bookDoc, { ...values });
}
