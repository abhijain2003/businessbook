import {
    addDoc,
    collection,
    getDocs,
    updateDoc,
    doc,
    deleteDoc
} from "firebase/firestore";
import { db } from "./firebase";

const ReturnCollection = collection(db, "return");

export const addReturn = async (user, dateOfReturn, productName, totalQtnReturn, partyName, note) => {
    await addDoc(ReturnCollection, {
        user: user,
        dateOfReturnArray: dateOfReturn,
        productName: productName,
        totalQtnReturnArray: totalQtnReturn,
        partyName: partyName,
        note:note
    });
}

export const getReturnRecord = async () => {
    const data = await getDocs(ReturnCollection);
    let returnStockArr = data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));

    return returnStockArr;
}

export const updateReturn = async (id, newField) => {
    const stockDoc = doc(db, "return", id);
  
    await updateDoc(stockDoc, newField);
  }