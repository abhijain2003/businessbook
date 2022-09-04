import {
    addDoc,
    collection,
    getDocs,
    updateDoc,
    doc
} from "firebase/firestore";
import { db } from "./firebase";

const InventoryCollection = collection(db, "inventory");


export const addInventory = async (user, dateOfPurchase, productName, perUnitPrice, totalQtnPurchased, purchasedFrom, qtnType) => {
    await addDoc(InventoryCollection, {
        user: user,
        dateOfPurchaseArray: dateOfPurchase,
        productName: productName,
        perUnitPriceArray: perUnitPrice,
        totalQtnPurchasedArray: totalQtnPurchased,
        purchasedFromArray: purchasedFrom,
        qtnType: qtnType
    });
}

export const getInventory = async () => {
    const data = await getDocs(InventoryCollection);
    let stockArr = data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));

    return stockArr;
}

export const updateInventory = async (id, newField) => {
    const stockDoc = doc(db, "inventory", id);

    await updateDoc(stockDoc, newField);
}
