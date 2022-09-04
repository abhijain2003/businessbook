import {
  addDoc,
  collection,
  getDocs,
  updateDoc,
  doc,
} from "firebase/firestore";
import { db } from "./firebase";

// ledger account
const ledgerCollectionRef = collection(db, "Ledger");
//ldeger entry
const ledgerEntryCollectionRef = collection(db, "LedgerEntry");

// ledger accounts
export const getLedger = async () => {
  const data = await getDocs(ledgerCollectionRef);
  let ledgerArr = data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));

  return ledgerArr;
}
//update ledger account
export const updateLedgerAccount = async (id, newField) => {
  const userDoc = doc(db, "Ledger", id);

  await updateDoc(userDoc, newField);
}

//add new ledger account
export const addLedgerAccount = async (value, type, user) => {
  addDoc(ledgerCollectionRef, {
     user: user,
     accounts: [
      {type: type, value: value}
     ]
  })
}



// ledger Entries


// ledger entries
export const getLedgerEntry = async () => {
  const data = await getDocs(ledgerEntryCollectionRef);

  let ledgerEntryArr = data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));

  return ledgerEntryArr;
}

export const addLedgerEntry = async (user, dateOfEntry, DebitAmount, DebitAccount, CreditAmount, CreditAccount) => {
  addDoc(ledgerEntryCollectionRef, {
    user: user,
    dateOfEntry: dateOfEntry,
    DebitAmount: DebitAmount,
    DebitAccount: DebitAccount,
    CreditAmount: CreditAmount,
    CreditAccount: CreditAccount
  });
}

export const updateLedgerEntry = async (id, newField) => {
  const ledgerEntryDoc = doc(db, "LedgerEntry", id);

  await updateDoc(ledgerEntryDoc, newField);
}
