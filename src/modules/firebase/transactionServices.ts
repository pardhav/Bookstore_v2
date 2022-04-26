import { deleteDoc, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { FIREBASE_DB } from "./clientApp";

export async function createTransaction(
  payload: any,
  userId: string,
  amounts: any
) {
  const transactionRef = doc(FIREBASE_DB, "Transactions", userId);
  const transactionDoc = await getDoc(transactionRef);
  const cartRef = doc(FIREBASE_DB, "Cart", userId);
  const cartData = (await getDoc(cartRef)).data();
  const orderRef = doc(FIREBASE_DB, "Orders", userId);
  const orderDoc = await getDoc(orderRef);
  const timeNow = Date.now();
  const dataTransaction = {
    [timeNow]: payload,
  };
  const dataOrder = {
    [timeNow]: {
      items: Object.values(cartData as any),
      transaction: payload,
      amounts,
    },
  };
  if (transactionDoc.exists()) {
    const existingData = transactionDoc.data();
    await updateDoc(transactionRef, { ...existingData, ...dataTransaction });
  } else {
    await setDoc(transactionRef, dataTransaction);
  }
  console.log({ dataOrder });
  if (orderDoc.exists()) {
    const existingData = orderDoc.data();

    await updateDoc(orderRef, { ...existingData, ...dataOrder });
  } else {
    await setDoc(orderRef, dataOrder);
  }
  deleteDoc(cartRef);
}
