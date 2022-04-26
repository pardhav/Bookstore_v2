import {
  browserLocalPersistence,
  createUserWithEmailAndPassword,
  setPersistence,
  signInWithEmailAndPassword,
  updateProfile,
  User,
  UserCredential,
} from "firebase/auth";
import { addDoc, collection, doc, setDoc } from "firebase/firestore";
import { FIREBASE_DB, FIREBASE_AUTH } from "./clientApp";

// TODO: persist user token after login
export async function createUserWithEmail(
  password: string,
  values: any
): Promise<User | null> {
  const { email } = values;
  await setPersistence(FIREBASE_AUTH, browserLocalPersistence);
  const user = await createUserWithEmailAndPassword(
    FIREBASE_AUTH,
    email,
    password
  );
  if (user) {
    await updateProfile(user.user, {
      displayName: `${values["given-name"]} ${values["family-name"]}`,
    });
    await setDoc(doc(FIREBASE_DB, "Users", email), {
      userId: user.user.uid,
      firstName: values["given-name"],
      lastName: values["family-name"],
      mobile: values["tel-national"],
      postalCode: values["postal-code"],
      unitNo: values["line2"],
      city: values["address-level2"],
      street: values["street-address"],
      email,
    });
    //TODO: write trigger to crate these docs
    await addDoc(collection(FIREBASE_DB, "Cart"), {
      userId: user.user.uid,
      items: [],
    });
    await addDoc(collection(FIREBASE_DB, "Orders"), {});
    return user.user;
  }
  return null;
}

export async function signInWithEmail(
  email: string,
  password: string
): Promise<UserCredential> {
  await setPersistence(FIREBASE_AUTH, browserLocalPersistence);
  const user = await signInWithEmailAndPassword(FIREBASE_AUTH, email, password);
  return user;
}
