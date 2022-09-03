import {
    addDoc,
    collection,
    getDocs
  } from "firebase/firestore";
  import { db } from "./firebase";
  
  const purCollectionRef = collection(db, "purchase");
  
  export const addPur = async (
    billno,
    date,
    partyName,
    supplierGST,
    taxAmt,
    cgst,
    sgst,
    igst,
    ship,
    user,
    image
  ) => {
    await addDoc(purCollectionRef, {
      Supplier: partyName,
      Suppliergst:supplierGST,
      CGST: cgst,
      SGST: sgst,
      IGST: igst,
      user: user,
      TaxAmt: taxAmt,
      billNo: billno,
      shippingAmt: ship,
      billDate: date,
      billPhoto: image
    });
  };
  
  export const getPur = async () => {
    const data = await getDocs(purCollectionRef);
    let purArr = data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
  
    return purArr;
  }
  

  
  