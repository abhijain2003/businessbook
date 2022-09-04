import React, { useState, useEffect, useRef, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { addSale } from "../utils/Sales";
import SalesInvoiceTemplate from "./SalesInvoiceTemplate";
import { useReactToPrint } from "react-to-print";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useLocation } from "react-router-dom";


const useKeyPress = function (targetKey) {
  const [keyPressed, setKeyPressed] = useState(false);

  function downHandler({ key }) {
    if (key === targetKey) {
      setKeyPressed(true);
    }
  }

  const upHandler = ({ key }) => {
    if (key === targetKey) {
      setKeyPressed(false);
    }
  };

  React.useEffect(() => {
    window.addEventListener("keydown", downHandler);
    window.addEventListener("keyup", upHandler);

    return () => {
      window.removeEventListener("keydown", downHandler);
      window.removeEventListener("keyup", upHandler);
    };
  });

  return keyPressed;
};

const items = [1, 2, 3, 4, 5, 6];

const SalesInvoice = () => {

  const location = useLocation()
  const foundUser = location.state.user;
  const Ruledata = location.state.rule;
  const Sdata = location.state.sale;
  const Stockdata = location.state.inventory;



  const [selected, setSelected] = useState(undefined);
  const downPress = useKeyPress("ArrowDown");
  const upPress = useKeyPress("ArrowUp");
  const enterPress = useKeyPress("Enter");
  const [cursor, setCursor] = useState(0);
  const [hovered, setHovered] = useState(undefined);

  useEffect(() => {
    if (items.length && downPress) {
      setCursor((prevState) =>
        prevState < items.length - 1 ? prevState + 1 : prevState
      );
    }
  }, [downPress]);
  useEffect(() => {
    if (items.length && upPress) {
      setCursor((prevState) => (prevState > 0 ? prevState - 1 : prevState));
    }
  }, [upPress]);
  useEffect(() => {
    if (items.length && enterPress) {
      setSelected(items[cursor]);
    }
  }, [cursor, enterPress]);
  useEffect(() => {
    if (items.length && hovered) {
      setCursor(items.indexOf(hovered));
    }
  }, [hovered]);


  const router = useParams();
  const navigate = useNavigate()

  useEffect(() => {
    function resizable(el, factor) {
      var int = Number(factor) || 7.7;
      function resize() {
        el.style.width = (el.value.length + 10) * int + "px";
      }
      var e = "keyup,keypress,focus,blur,change".split(",");
      for (var i in e) el.addEventListener(e[i], resize, false);
      resize();
    }
    resizable(document.getElementById("CN"), 7);
    resizable(document.getElementById("CA"), 9);
    resizable(document.getElementById("CG"), 7);



    document
      .getElementById("container")
      .querySelectorAll("input")
      .forEach((node) => {
        window.addEventListener(
          "keydown",
          function (e) {
            if (e.key === "Enter") {
              document
                .getElementById("container")
                .querySelector(".actives")
                .focus();
            }
          },
          true
        );
      });
  }, [router]);
  

  let ownerName = foundUser[0].companyName.toUpperCase().replace(/-/g, " ");


  let foundSale = Sdata.filter(
    (sale) => sale.user === foundUser[0].companyName
  );

   const [SoldProductArray, setSoldProductArray] = useState([]);

  const products = useMemo(() => [], []);
  foundSale.map((val) => {
    products.push(...val.product);
  })
  useEffect(() => {
    setSoldProductArray(products);
  }, [products])


  var foundRule = Ruledata.filter(
    (com) => com.user === foundUser[0].companyName
  );

  const foundStocks = Stockdata.filter(
    (com) => com.user === foundUser[0].companyName
  );


  const [clientName, setclientName] = useState("");
  const [clientAddress, setclientAddress] = useState("");
  const [clientGST, setclientGST] = useState("NA");
  const [ship, setship] = useState(0);
  const [billType, setbillType] = useState(null);
  let totalTaxableAmt = 0;
  let totalTax = 0;
  let totalAmountDue = 0;

  let userTemplate = {
    descrip: "",
    qtn: "",
    amt: "",
    hsn: "",
    cgst: "",
    sgst: "",
    igst: "",
  };
  const [times, settimes] = useState([userTemplate]);

  function handleForm() {
    settimes((prev) => [...prev, userTemplate]);
    items.push(
      items[items.length - 3] + 3,
      items[items.length - 2] + 2,
      items[items.length - 1] + 1
    );
  }

  function handleDelete(index) {
    let copytimes = [...times];
    copytimes.splice(index, 1);
    settimes(copytimes);
    items.pop();
    items.pop();
    items.pop();
  }

  function onChange(e, index) {
    const updateUserTemplate = times.map((temp, i) =>
      i === index
        ? Object.assign(temp, { [e.target.name]: e.target.value })
        : temp
    );
    settimes(updateUserTemplate);
  }


  const successNotify = () =>
    toast.success("Successfully Added", { autoClose: 1000 });
  const errorNotify = () => toast.error("Error occurred", { autoClose: 1000 });
  const infoNotify = () => toast.info("Please fill all detials first");



  const [oldClient, setoldClient] = useState(null);
  useEffect(() => {
    foundSale.filter((sale) => {
      if (sale.buyer === clientName.toLowerCase().replace(/ /g, "-")) {
        setoldClient(sale);
      }
    });
  }, [clientName, foundSale]);

  useEffect(() => {
    if (oldClient !== null) {
      let autofill = window.confirm(
        "We found old details of the client. Click ok for autofill"
      );

      if (autofill) {
        setclientAddress(oldClient.clientAddress);
        setclientGST(oldClient.ClientGST);
      }
    }
  }, [oldClient]);

  const [showBill, setshowBill] = useState(false);
  const [sumTaxable, setsumTaxable] = useState(0);
  const [sumTax, setsumTax] = useState(0);
  const [sumDue, setsumDue] = useState(0);
  function handleViewBill() {
    setshowBill(true);
    times.map((data) => {
      let subT = Number(data.qtn) * Number(data.amt);
      totalTaxableAmt += subT;
      let sumTax = Number(data.cgst) + Number(data.sgst) + Number(data.igst);
      totalTax += sumTax;
      totalAmountDue = totalTaxableAmt + totalTax;
    });
    setsumTaxable(totalTaxableAmt);
    setsumTax(totalTax);
    setsumDue(totalAmountDue + Number(ship));
  }

  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  var date = new Date();

  async function handleAdd() {
    if (
      clientName === "" ||
      clientAddress === "" ||
      times[0].descrip === "" ||
      times[0].amt === "" ||
      times[0].qtn === ""
    ) {
      infoNotify();
    } else {
      await addSale(
        clientName.toLowerCase().replace(/ /g, "-"),
        clientAddress.toLowerCase().replace(/ /g, "-"),
        foundUser[0].companyName,
        clientGST,
        times,
        ship,
        billType,
        date.toLocaleDateString()
      )
        .then(() => {
          successNotify();
          navigate(`/user/${foundUser[0].companyName}`)
          console.log("successfully addedd");
        })
        .catch((err) => {
          errorNotify();
          console.log(err.message);
        });
    }
  }

  return (
    <div className="h-[100vh] bg-[#D3CEDF] overflow-y-hidden">
      <div className="w-[90%] mx-auto">
        <ToastContainer />
        <h1 className="font-bold text-[25px]">
          Invoice Entry #{foundSale.length + 1}
        </h1>
      </div>
      <div className="grid overflow-y-auto h-[90vh] bg-white w-[90%] mx-auto">
        {/* bill view starts */}
        <div style={{
          gridArea: "1/1",
          border: "1px solid black",
          transform: showBill ? "translateY(0%)" : "translateY(-110%)",
          transition: "0.5s ease-in",
        }} >
          <SalesInvoiceTemplate
            print={true}
            componentRef={componentRef}
            clientName={clientName}
            clientAddress={clientAddress}
            clientGST={clientGST}
            times={times}
            ship={ship}
            billType={billType}
            ownerName={ownerName}
            foundUser={foundUser}
            foundRule={foundRule}
            sumDue={sumDue}
            sumTax={sumTax}
            sumTaxable={sumTaxable}
            foundSale={foundSale}
          />
        </div>
        {
          showBill ? (
            <div className="absolute flex flex-col items-center right-0 lg:top-20 justify-evenly w-[200px]">
              <button
                onClick={handlePrint}
                className="text-white bg-slate-500 div-2 rounded-[10px] w-[50%] mt-2"
              >
                Print
              </button>
              <button
                onClick={() => setshowBill(false)}
                className="text-white bg-[#06283D] div-2 rounded-[10px] w-[50%] mt-2"
              > Clear
              </button>
              <button
                onClick={handleAdd}
                className=" text-white bg-blue-500 ml-2 div-2 rounded-[10px] w-[50%] mt-2"
              >Add
              </button>
            </div>
          ) : null
        }
        {/* bill view ends */}
        <div
          id="container"
          style={{ gridArea: "1/1" }}
          className="flex w-full flex-col mt-24 mx-auto"
        >
          {/* client  information starts*/}
          <div className="mb-4 md:flex sm:w-[90%] md:justify-between mx-auto">
            <div className="mb-4 md:mr-2 md:mb-0 flex flex-col">
              <label className="block mb-2 text-sm font-bold text-gray-700">
                Client Name
              </label>
              <input
                className={`items ${cursor === 0 ? "actives" : ""
                  }  w-full px-3 py-2 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline`}
                onClick={() => setSelected(0)}
                id="CN"
                placeholder="Client Name"
                onChange={(e) => setclientName(e.target.value)}
                onMouseEnter={() => setHovered(0)}
                value={clientName}
                onMouseLeave={() => setHovered(undefined)}
              />
            </div>
            <div className="mb-4 md:mr-2 md:mb-0 flex flex-col">
              <label className="block mb-2 text-sm font-bold text-gray-700">
                Client Address
              </label>
              <input
                className={`items ${cursor === 1 ? "actives" : ""
                  }  w-full px-3 py-2 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline`}
                onClick={() => setSelected(1)}
                onMouseEnter={() => setHovered(1)}
                id="CA"
                onChange={(e) => setclientAddress(e.target.value)}
                placeholder="client Address"
                value={clientAddress}
                onMouseLeave={() => setHovered(undefined)}
              />
            </div>
            <div className="mb-4 md:mr-2 md:mb-0 flex flex-col">
              <label className="block mb-2 text-sm font-bold text-gray-700">
                Client GST
              </label>
              <input
                className={`items ${cursor === 2 ? "actives" : ""
                  }  w-full px-3 py-2 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline`}
                onClick={() => setSelected(2)}
                onMouseEnter={() => setHovered(2)}
                id="CG"
                onChange={(e) => setclientGST(e.target.value)}
                placeholder="Client GST"
                value={clientGST}
                onMouseLeave={() => setHovered(undefined)}
              />
            </div>
            <div className="mb-4 md:mr-2 md:mb-0 flex flex-col">
              <label className="block mb-2 text-sm font-bold text-gray-700">
                Type of Invoice
              </label>
              <select
                onChange={(e) => setbillType(e.target.value)}
                className="w-full px-3 py-2 text-sm leading-tight text-gray-700 border rounded shadow focus:outline-none focus:shadow-outline"
              >
                <option value={null}>BILL TYPE</option>
                <option value="CASH">CASH</option>
                <option value="CREDIT">CREDIT</option>
              </select>
            </div>
          </div>
          {/* client information ends */}
          {/* product information starts */}
          {times.map((data, i) => {
            let n = 3 + i + i;
            let subT = Number(data.qtn) * Number(data.amt);

            return (
              <div key={i}
                style={{ gridTemplateRows: "1fr 1fr" }}
                className="mb-4 md:grid mx-auto sm:w-[90%]"
              >
                <div
                  style={{ gridTemplateColumns: "40% 15% 15% 15% 15%" }}
                  className="mb-4 md:grid gap-x-2 mx-auto text-center w-full"
                >
                  <div className="mb-4 md:mr-2 md:mb-0 flex flex-col">
                    <label className="block mb-2 text-sm font-bold text-gray-700">
                      Product Name
                    </label>
                    <select name="descrip" onChange={(e) => onChange(e, i)} className="w-full px-3 py-2 text-sm leading-tight text-gray-700 border rounded shadow focus:outline-none focus:shadow-outline" >
                      <option value="" >Product Name</option>
                      {
                        foundStocks.map((items, div) => {

                          //purchased stock quantity addition
                          const purchasedStockQtn = items.totalQtnPurchasedArray.reduce((acc, curr) => acc + curr);

                          //calculating sold product quantity
                          const soldStocks = SoldProductArray.filter((item) => {
                            if (item.descrip === items.productName) {
                              return item;
                            }
                          });

                          const sumOfSoldStock = soldStocks.reduce((acc, curr) => { return acc + Number(curr.qtn) }, 0);

                          return (
                            <option key={div} value={items.productName} >{items.productName + "( " + (purchasedStockQtn - sumOfSoldStock) + items.qtnType + " )"}</option>
                          )
                        })
                      }
                    </select>
                  </div>
                  <div className="mb-4 md:mr-2 md:mb-0 flex flex-col">
                    <label className="block mb-2 text-sm font-bold text-gray-700">
                      HSN CODE
                    </label>
                    <input
                      className={`items ${cursor === i + n ? "actives" : ""
                        }  w-full px-3 py-2 text-sm leading-tight text-gray-700 border rounded shadow focus:outline-none focus:shadow-outline`}
                      onClick={() => setSelected(i + n)}
                      onMouseEnter={() => setHovered(i + n)}
                      id="PQ"
                      name="hsn"
                      placeholder="HSN CODE"
                      onChange={(e) => onChange(e, i)}
                      onMouseLeave={() => setHovered(undefined)}
                    />
                  </div>
                  <div className="mb-4 md:mr-2 md:mb-0 flex flex-col">
                    <label className="block mb-2 text-sm font-bold text-gray-700">
                      QTN.
                    </label>
                    <input
                      className={`items ${cursor === i + 1 + n ? "actives" : ""
                        }  w-full px-3 py-2 text-sm leading-tight text-gray-700 border rounded shadow focus:outline-none focus:shadow-outline`}
                      onClick={() => setSelected(i + 1 + n)}
                      name="qtn"
                      onMouseEnter={() => setHovered(i + 1 + n)}
                      id="PP"
                      placeholder="QTN."
                      onChange={(e) => onChange(e, i)}
                      onMouseLeave={() => setHovered(undefined)}
                    />
                  </div>
                  <div className="mb-4 md:mr-2 md:mb-0 flex flex-col">
                    <label className="block mb-2 text-sm font-bold text-gray-700">
                      AMT.
                    </label>
                    <input
                      className={`items ${cursor === i + 2 + n ? "actives" : ""
                        }  w-full px-3 py-2 text-sm leading-tight text-gray-700 border rounded shadow focus:outline-none focus:shadow-outline`}
                      onClick={() => setSelected(i + 2 + n)}
                      name="amt"
                      onMouseEnter={() => setHovered(i + 2 + n)}
                      id="PP"
                      placeholder="AMT."
                      onChange={(e) => onChange(e, i)}
                      onMouseLeave={() => setHovered(undefined)}
                    />
                  </div>
                  <div className="mb-4 md:mr-2 md:mb-0 flex flex-col">
                    <label className="block mb-2 text-sm font-bold text-gray-700">
                      Taxable Amt.
                    </label>
                    <div
                      id="ST"
                      className="w-full px-3 py-2 text-sm leading-tight text-gray-700 border rounded shadow focus:outline-none focus:shadow-outline"
                    >
                      {subT.toFixed(2)}
                    </div>
                  </div>
                </div>
                <div
                  style={{ gridTemplateColumns: "15% 15% 15% 15% 20% 20%" }}
                  className="w-full mb-4 md:grid gap-x-2 mx-auto"
                >
                  <div className="mb-4 md:mr-2 md:mb-0 flex flex-col">
                    <label className="block mb-2 text-sm font-bold text-gray-700">
                      CGST
                    </label>
                    <select
                      onChange={(e) => onChange(e, i)} name="cgst"
                      className="w-full px-3 py-2 text-sm leading-tight text-gray-700 border rounded shadow focus:outline-none focus:shadow-outline"
                    >
                      <option value={((0 / 100) * subT).toFixed(2)}>CGST</option>
                      <option value={((2.5 / 100) * subT).toFixed(2)}>2.5%</option>
                      <option value={((6 / 100) * subT).toFixed(2)}>6%</option>
                      <option value={((9 / 100) * subT).toFixed(2)}>9%</option>
                      <option value={((14 / 100) * subT).toFixed(2)}>14%</option>
                      <option value={((1.5 / 100) * subT).toFixed(2)}>1.5%</option>
                      <option value={((0 / 100) * subT).toFixed(2)}>0%</option>
                      <option value={((0.125 / 100) * subT).toFixed(2)}>0.125%</option>
                    </select>
                  </div>
                  <div className="mb-4 md:mr-2 md:mb-0 flex flex-col">
                    <label className="block mb-2 text-sm font-bold text-gray-700">
                      SGST
                    </label>
                    <select
                      onChange={(e) => onChange(e, i)} name="sgst"
                      className="w-full px-3 py-2 text-sm leading-tight text-gray-700 border rounded shadow focus:outline-none focus:shadow-outline"
                    >
                      <option value={((0 / 100) * subT).toFixed(2)}>SGST</option>
                      <option value={((2.5 / 100) * subT).toFixed(2)}>2.5%</option>
                      <option value={((6 / 100) * subT).toFixed(2)}>6%</option>
                      <option value={((9 / 100) * subT).toFixed(2)}>9%</option>
                      <option value={((14 / 100) * subT).toFixed(2)}>14%</option>
                      <option value={((1.5 / 100) * subT).toFixed(2)}>1.5%</option>
                      <option value={((0 / 100) * subT).toFixed(2)}>0%</option>
                      <option value={((0.125 / 100) * subT).toFixed(2)}>0.125%</option>
                    </select>
                  </div>
                  <div className="mb-4 md:mr-2 md:mb-0 flex flex-col">
                    <label className="block mb-2 text-sm font-bold text-gray-700">
                      IGST
                    </label>
                    <select
                      onChange={(e) => onChange(e, i)} name="igst"
                      className="w-full px-3 py-2 text-sm leading-tight text-gray-700 border rounded shadow focus:outline-none focus:shadow-outline"
                    >
                      <option value={((0 / 100) * subT).toFixed(2)}>IGST</option>
                      <option value={((5 / 100) * subT).toFixed(2)}>5%</option>
                      <option value={((12 / 100) * subT).toFixed(2)}>12%</option>
                      <option value={((18 / 100) * subT).toFixed(2)}>18%</option>
                      <option value={((28 / 100) * subT).toFixed(2)}>28%</option>
                      <option value={((3 / 100) * subT).toFixed(2)}>3%</option>
                      <option value={((0.25 / 100) * subT).toFixed(2)}>0.25%</option>
                      <option value={((0 / 100) * subT).toFixed(2)}>0%</option>
                    </select>
                  </div>
                  <div className="mb-4 md:mr-2 md:mb-0 flex flex-col">
                    <label className="block mb-2 text-sm font-bold text-gray-700">
                      Total Tax
                    </label>
                    <div
                      id="ST"
                      className="w-full px-3 py-2 text-sm leading-tight text-gray-700 border rounded shadow focus:outline-none focus:shadow-outline"
                    >{(Number(times[i].cgst) + Number(times[i].sgst) + Number(times[i].igst)).toFixed(2)}</div>
                  </div>
                  <div className="mb-4 md:mr-2 md:mb-0 flex flex-col">
                    <label className="block mb-2 text-sm font-bold text-gray-700">
                      Total After Tax
                    </label>
                    <div
                      id="ST"
                      className="w-full px-3 py-2 text-sm leading-tight text-gray-700 border rounded shadow focus:outline-none focus:shadow-outline"
                    >
                      {(Number(times[i].cgst) + Number(times[i].sgst) + Number(times[i].igst) + subT).toFixed(2)}
                    </div>
                  </div>
                  {i + 1 !== times.length ? (
                    <div
                      className="mb-4 md:mr-2 md:mb-0 flex flex-col"
                      onClick={() => handleDelete(i)}
                    >
                      <label className="block mb-2 text-sm font-bold text-gray-700">
                        Delete Product
                      </label>
                      <div
                        id="ST"
                        className="w-[100px] text-center text-white bg-blue-600 px-4 py-2 hover:bg-blue-100 hover:text-blue-600 rounded-[10px] cursor-pointer"
                      >
                        Delete
                      </div>
                    </div>
                  ) : (
                    <div className="mb-4 md:mr-2 md:mb-0 flex flex-col">
                      <label className="block mb-2 text-sm font-bold text-gray-700">
                        Add Product
                      </label>
                      <button
                        onClick={handleForm}
                        className="w-[100px] text-center  text-white bg-blue-600 px-4 py-2 hover:bg-blue-100 hover:text-blue-600 rounded-[10px] cursor-pointer"
                      >
                        Add+
                      </button>
                    </div>
                  )}
                </div>
                {/* product description ends */}
              </div>
            );
          })}
          <div className="mb-4 md:flex sm:w-[50%] md:justify-between mx-auto">
            <div className="mb-4 md:mr-2 md:mb-0 flex flex-col">
              <label className="block mb-2 text-sm font-bold text-gray-700">
                Shipping Chrg.
              </label>
              <input
                onChange={(e) => setship(e.target.value)}
                id="SA"
                style={{ border: "1px solid black", background: "none" }}
                placeholder="₹0.0"
                className="w-full px-3 py-2 text-sm leading-tight text-gray-700 border rounded shadow focus:outline-none focus:shadow-outline"
              />
            </div>
            <div className="mb-4 md:mr-2 md:mb-0 flex flex-col">
              <label className="block mb-2 text-sm font-bold text-gray-700">
                View Bill Format
              </label>
              <button
                onClick={handleViewBill}
                className="w-[100px] text-center  text-white bg-blue-600 px-4 py-2 hover:bg-blue-100 hover:text-blue-600 rounded-[10px] cursor-pointer"
              >
                View
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalesInvoice;
