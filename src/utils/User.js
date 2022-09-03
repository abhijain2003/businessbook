import {
  addDoc,
  collection,
  getDocs,
  updateDoc,
  doc,
  deleteDoc
} from "firebase/firestore";
import { db } from "./firebase";

const userCollectionRef = collection(db, "user");
const saleRuleCollectionRef = collection(db, "ruleBook");

export const addUser = async (Name, number, mail, address, id, gst,bankName, accountNumber, branchName, ifscCode,logo, date) => {
  await addDoc(userCollectionRef, {
    companyName: Name,
    companyNumber: number,
    companyMail: mail,
    companyAddress: address,
    loginId: id,
    GST: gst,
    bankName: bankName,
    accountNumber: accountNumber,
    branchName: branchName,
    ifscCode: ifscCode,
    businessLogo: logo,
    DateOfJoin: date,
  });
};

export const getUser = async () => {
  const data = await getDocs(userCollectionRef);
  let userArr = data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));

  return userArr;
};

export const updateUser = async (id, newId) => {
  const userDoc = doc(db, "user", id);
  const newField = { loginId: newId };

  await updateDoc(userDoc, newField);
};

export const updateUserInfo = async (id, newField) => {
  const userDoc = doc(db, "user", id);

  await updateDoc(userDoc, newField);
}

export const deleteUser = async (id) => {
  const userDoc = doc(db, "user", id);
  await deleteDoc(userDoc);
}






export const addRule = async (rule1, rule2, rule3, rule4, rule5, user) => {
  await addDoc(saleRuleCollectionRef, {
    rule1: rule1,
    rule2: rule2,
    rule3: rule3,
    rule4: rule4,
    rule5: rule5,
    user: user
  });
}

export const getRule = async () => {
  const data = await getDocs(saleRuleCollectionRef);
  let ruleArr = data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));

  return ruleArr;
}

export const updateRule = async (id, newField) => {
  const userDoc = doc(db, "ruleBook", id);

  await updateDoc(userDoc, newField);
}

export const deleteRule = async (id) => {
  const userDoc = doc(db, "ruleBook", id);
  await deleteDoc(userDoc);
}