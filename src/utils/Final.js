import {
    addDoc,
    collection,
    getDocs,
    doc,
    updateDoc
} from "firebase/firestore";
import { db } from "./firebase";

const FinalCollection = collection(db, "final");


export const addFinal = async (user, grossProfit, grossLoss, netProfit, netLoss, closingStocks, EntryYear) => {
    await addDoc(FinalCollection, {
        user: user,
        grossProfit:grossProfit,
        grossLoss:grossLoss,
        netProfit:netProfit,
        netLoss:netLoss,
        closingStocks: closingStocks,
        EntryYear: EntryYear
    });
}

export const getFinal = async () => {
    const data = await getDocs(FinalCollection);
    let ProfitArr = data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));

    return ProfitArr;
}

export const updateFinal = async (id, newField) => {
    const userDoc = doc(db, "final", id);
  
    await updateDoc(userDoc, newField);
  }
