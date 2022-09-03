import {
  addDoc,
  collection,
  getDocs
} from "firebase/firestore";
import { db } from "./firebase";

const salesCollectionRef = collection(db, "sales");

export const addSale = async (
  CName,
  CAddress,
  company,
  clientgst,
  product,
  ship,
  billType,
  date
) => {
  await addDoc(salesCollectionRef, {
    buyer: CName,
    clientAddress: CAddress,
    user: company,
    ClientGST: clientgst,
    product: product,
    shippingAmt: ship,
    billType: billType,
    billDate: date
  });
};

export const getSales = async () => {
  const data = await getDocs(salesCollectionRef);
  let salesArr = data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));

  return salesArr;
}

