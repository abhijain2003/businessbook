import React, { useState } from "react";
import { addReturn, updateReturn } from "../utils/ReturnRecord";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useParams, useLocation } from "react-router-dom";



function ReturnEntry() {

  const location = useLocation();
  const Pdata = location.state.Pdata;
  const Idata = location.state.Idata;
  const Sdata = location.state.Sdata;
  const Rdata = location.state.Rdata;
  


  const successNotify = (text) => toast.success(text, { autoClose: 1000 });
  const errorNotify = () => toast.error("Error occurred", { autoClose: 1000 });
  const infoNotify = (text) => toast.info(text);

  const [noteType, setnoteType] = useState("");
  const [supplierName, setsupplierName] = useState("");
  const [billDate, setbillDate] = useState("");
  const [foundProductArray, setfoundProductArray] = useState([]);
  const [productName, setproductName] = useState("");
  const [returnQtn, setreturnQtn] = useState(0);
  const [returnDate, setreturnDate] = useState("");
  const route = useParams();

  const purchaseData = Pdata.filter((val) => {
    const Currdate = new Date().getFullYear();
    const billDate = new Date(val.billDate).getFullYear();
    if (val.user === route.user && billDate === Currdate) {
      return val;
    }
  });

  const salesData = Sdata.filter((val) => {
    const Currdate = new Date().getFullYear();
    const billDate = new Date(val.billDate).getFullYear();
    if (val.user === route.user && billDate === Currdate) {
      return val;
    }
  });

  const foundInventory = Idata.filter((val) => {
    if (val.user === route.user) {
      return val;
    }
  });

  const foundReturnData = Rdata.filter((val) => {
    if (val.user === route.user) {
      return val;
    }
  });

  function fetchLedger() {
    if (supplierName === "" || billDate === "") {
      infoNotify("Please fill all details first");
    }

    var foundLedger = foundInventory.filter((entry) => {
      if (
        entry.dateOfPurchaseArray.includes(billDate) &&
        entry.purchasedFromArray.includes(supplierName)
      ) {
        return entry;
      }
    })

    var foundSalesUser = salesData.filter((val) => {
      let dateInBill = new Date(val.billDate);
      let userEnterDate = new Date(billDate);

      if (val.buyer === supplierName
        && dateInBill.getDate() === userEnterDate.getDate()
        && dateInBill.getMonth() === userEnterDate.getMonth()
        && dateInBill.getFullYear() === userEnterDate.getFullYear()) {
        return val
      }
    })

    const products = [];
    foundSalesUser.map((val) => {
      products.push(...val.product);
    })

    if (noteType === "debit" ? foundLedger.length === 0 : foundSalesUser.length === 0) {
      infoNotify(
        "bill date is not found, make sure your purchase date and inventory date is same."
      );
    } else {
      setfoundProductArray(noteType === "debit" ? foundLedger : products);
    }
  }


  async function handleAdd() {
    if (productName === '' || returnQtn === "" || returnDate === "") {
      return infoNotify("please fill all details first.")
    } else {
      let foundExistingEntry = foundReturnData.filter((val) => {
        if (val.productName === productName && val.note === noteType) {
          return val;
        }
      })

      if (foundExistingEntry.length === 0) {
        await addReturn(
          route.user,
          [returnDate],
          productName,
          [returnQtn],
          supplierName,
          noteType
        ).then((res) => {
          successNotify("successfully added.")
          window.location.reload();
        }).catch((err) => {
          console.log(err);
        })
      } else {
        let newDateArr = [...foundExistingEntry[0].dateOfReturnArray, returnDate];
        let newQtnArr = [...foundExistingEntry[0].totalQtnReturnArray, returnQtn];
        await updateReturn(foundExistingEntry[0].id, {
          dateOfReturnArray: newDateArr,
          totalQtnReturnArray: newQtnArr
        }).then((res) => {
          successNotify("successfully added.")
          window.location.reload();
        }).catch((err) => {
          console.log(err);
        })
      }

    }
  }

  return (
    <div className="bg-[#D3CEDF] min-h-screen sm:h-[100vh] w-full flex justify-center items-center">
      <ToastContainer />
      <div className="w-[90%] p-4 h-[90%] mx-auto bg-white">
        <div className="w-[300px] mx-auto">
          {
            noteType === "" ? <div className="font-medium my-4 text-center">
              <h1>Add New Return Entry</h1>
              <ul style={{ listStyle: 'outside' }} >
                <li>Select Debit for Purchase Return</li>
                <li>Select Credit for Sales Return</li>
              </ul>
            </div> : null
          }
          <select
            className="w-full text-center font-medium px-3 py-2 text-sm leading-tight text-gray-700 border rounded shadow focus:outline-none focus:shadow-outline"
            onChange={(e) => setnoteType(e.target.value)}
          >
            <option value="">Notes</option>
            <option value="debit">Debit Note</option>
            <option value="credit">Credit Note</option>
          </select>
        </div>
        {noteType !== "" ? (
          <div className="sm:w-[600px] w-[300px] mx-auto mt-8 gap-y-4 gap-x-4 flex flex-col sm:grid sm:grid-cols-3">
            <div className="mb-4 md:mr-2 md:mb-0 flex flex-col">
              <label className="block mb-2 text-sm font-bold text-gray-700">
                Party Name
              </label>
              <select
                onChange={(e) => setsupplierName(e.target.value)}
                className="w-full text-center font-medium px-3 py-2 text-sm leading-tight text-gray-700 border rounded shadow focus:outline-none focus:shadow-outline"
              >
                <option>Party Name</option>
                {
                  noteType === "debit" ? purchaseData.map((val, i) => (
                    <option key={i} value={val.Supplier}>
                      {val.Supplier}
                    </option>
                  )) : salesData.map((val, i) => (
                    <option key={i} value={val.buyer}>
                      {val.buyer}
                    </option>
                  ))
                }
              </select>
            </div>
            <div className="mb-4 md:mr-2 md:mb-0 flex flex-col">
              <label className="block mb-2 text-sm font-bold text-gray-700">
                {noteType === "debit" ? "Purchase" : "Sale"} Date
              </label>
              <input
                onChange={(e) => setbillDate(e.target.value)}
                className="w-full text-center font-medium px-3 py-2 text-sm leading-tight text-gray-700 border rounded shadow focus:outline-none focus:shadow-outline"
                type={"date"}
              />
            </div>
            <div className="mb-4 md:mr-2 md:mb-0 flex flex-col">
              <label className="block mb-2 text-sm font-bold text-gray-700">
                CLick to fetch Details
              </label>
              <button
                onClick={fetchLedger}
                className="bg-blue-600 h-full text-white hover:bg-slate-400 rounded-[12px] font-medium"
              >
                Fetch Ledger
              </button>
            </div>

            {
              foundProductArray.length !== 0 && <div className="sm:w-[600px] w-[300px] mx-auto mt-8 gap-y-4 gap-x-4 flex flex-col sm:grid sm:grid-cols-3">
                <div className="mb-4 md:mr-2 md:mb-0 flex flex-col">
                  <label className="block mb-2 text-sm font-bold text-gray-700">
                    Product Name
                  </label>
                  <select
                    onChange={(e) => setproductName(e.target.value)}
                    className="w-full uppercase text-center font-medium px-3 py-2 text-sm leading-tight text-gray-700 border rounded shadow focus:outline-none focus:shadow-outline"
                  >
                    <option value={""} >Product Name</option>
                    {
                      noteType === 'debit' ? foundProductArray.map((val, k) => (
                        <option value={val.productName} key={k} >{val.productName}</option>
                      )) : foundProductArray.map((val, k) => (
                        <option value={val.descrip} key={k} >{val.descrip}</option>
                      ))
                    }
                  </select>
                </div>
                <div className="mb-4 md:mr-2 md:mb-0 flex flex-col">
                  <label className="block mb-2 text-sm font-bold text-gray-700">
                    Return Quantity
                  </label>
                  <input
                    placeholder="if (mtr/kg) type total value"
                    onChange={(e) => setreturnQtn(Number(e.target.value))}
                    className="w-full text-center font-medium px-3 py-2 text-sm leading-tight text-gray-700 border rounded shadow focus:outline-none focus:shadow-outline"
                    type={"text"}
                  />
                </div>
                <div className="mb-4 md:mr-2 md:mb-0 flex flex-col">
                  <label className="block mb-2 text-sm font-bold text-gray-700">
                    Return date
                  </label>
                  <input
                    onChange={(e) => setreturnDate(e.target.value)}
                    className="w-full text-center font-medium px-3 py-2 text-sm leading-tight text-gray-700 border rounded shadow focus:outline-none focus:shadow-outline"
                    type={"date"}
                  />
                </div>
                <div className="mb-4 md:mr-2 mx-auto col-span-2 md:mb-0 flex flex-col">
                  <label className="block mb-2 text-sm font-bold text-gray-700">
                    CLick to Add Entry
                  </label>
                  <button
                    onClick={handleAdd}
                    className="bg-blue-600 h-full text-white hover:bg-slate-400 rounded-[12px] font-medium"
                  >
                    CLick
                  </button>
                </div>
              </div>
            }

          </div>
        ) : null}
      </div>
    </div>
  );
}

export default ReturnEntry;
