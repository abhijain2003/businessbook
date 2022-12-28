import React, { useState, useEffect, useRef } from "react";
import { useReactToPrint } from "react-to-print";
import numWords from "num-words";
import { addReciept } from "../utils/Reciept";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useParams } from "react-router-dom";
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

  useEffect(() => {
    window.addEventListener("keydown", downHandler);
    window.addEventListener("keyup", upHandler);

    return () => {
      window.removeEventListener("keydown", downHandler);
      window.removeEventListener("keyup", upHandler);
    };
  }, []);

  return keyPressed;
};

const items = [1, 2, 3];

const ReciptInvoice = () => {

  const router = useParams();
  const location = useLocation();
  let foundUser = location.state.user;
  const Sdata = location.state.sale;
  const Rdata = location.state.receipt;


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

  useEffect(() => {

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

  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  let ownerName = foundUser[0].companyName.toUpperCase().replace(/-/g, " ");
  var date = new Date();
  const foundSale = Sdata.filter((val) => val.user === router.user)
  let foundReciept = Rdata.filter((rec) => rec.user === foundUser[0].companyName);

  const [showAllCustomerList, setshowAllCustomerList] = useState(false);
  const [customerList, setcustomerList] = useState([]);
  const [Amount, setAmount] = useState(0);
  const [recievedFrom, setrecievedFrom] = useState("");
  const [recievedBy, setrecievedBy] = useState("");
  const recieptNo = foundReciept.length + 1;
  const recieptDate = date.toLocaleDateString();

  useEffect(() => {
    setcustomerList(foundSale.map((val) => {
      return val.buyer;
    }));
  }, [])

  const successNotify = () => toast.success("Successfully Added", { autoClose: 1000 });
  const errorNotify = () => toast.error("Error occurred", { autoClose: 1000 });
  const infoNotify = () => toast.info("Please fill all information first");

  async function handleAdd() {

    if (recievedFrom === "" && Amount === 0) {
      infoNotify();
    } else {
      await addReciept(recieptNo, recieptDate, recievedFrom.toLowerCase().replace(/ /g, "-"), recievedBy.toLowerCase().replace(/ /g, "-"), Amount, foundUser[0].companyName).then(() => {
        successNotify();
        router.push(`/user/${router.user}`)
        console.log("successfully added");
      })
        .catch((err) => {
          errorNotify()
          console.log(err)
        });
    }
  }


  return (
    <div className="bg-[#D3CEDF] lg:grid sm:flex sm:flex-col h-[100vh] parentReciept" style={{ gridTemplateColumns: "20%  60% 20%" }}>
      {/* search */}
      <div style={{ overflowY: 'auto', backgroundColor: showAllCustomerList ? 'white' : null }} className="w-[90%] self-center mx-auto h-[70vh] text-center uppercase flex flex-col justify-center items-center" >
        {showAllCustomerList ? <div className="cursor-pointer" onClick={() => setshowAllCustomerList(false)} > x </div> : null}
        {showAllCustomerList ?
          customerList.map((val) => (
            <div className="bg-white cursor-pointer font-bold text-[16px] w-[90%] px-3 py-2 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline" >{val}</div>
          ))

          : customerList.filter((val) => {
            if (recievedFrom.length === 0) {
              return null;
            } else if (val.split("-").join(" ").includes(recievedFrom.toLowerCase())) {
              return val;
            }
          }).map((buyer) => (
            <div onClick={() => setrecievedFrom(buyer)} className="bg-white font-bold text-[16px] w-[90%] px-3 py-2 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline" >{buyer}</div>
          ))

        }

      </div>
      {/* search */}
      <div
        id="container" ref={componentRef} style={{ border: "1px solid black", gridTemplateRows: '20% 60% 20%' }} className="bg-white div-2 reciept grid sm:w-full mx-auto h-[60%] my-auto">
        {/* main head */}
        <div className="flex justify-between w-[95%] mx-auto">
          <ToastContainer />
          <h1 className="uppercase font-bold text-xl text-[navy]" >Payment Receipt</h1>
          <div className="flex flex-col">
            <div className="flex justify-between">
              <div className="uppercase" style={{ borderBottom: '1px solid black' }} >reciept no.</div>
              <div className="font-bold" style={{ borderBottom: '1px solid black' }} >{foundReciept.length + 1}</div>
            </div>
            <div className="flex justify-between">
              <div className="uppercase" style={{ borderBottom: '1px solid black' }} >date:</div>
              <div className="font-bold" style={{ borderBottom: '1px solid black' }} >{recieptDate}</div>
            </div>
          </div>
        </div>

        {/* reciept details */}
        <div className="flex flex-col h-full">
          <input
            style={{ borderBottom: '1px solid navy', width: '95%' }}
            placeholder={"Recieved from"}
            className={`items ${cursor === 0 ? "actives" : ""}  mx-auto`}
            onClick={() => setSelected(0)}
            onMouseEnter={() => setHovered(0)}
            value={recievedFrom}
            onChange={(e) => setrecievedFrom(e.target.value)}
            onMouseLeave={() => setHovered(undefined)}
          />
          <div className="grid h-[60%] w-[95%] mx-auto" style={{ gridTemplateColumns: '80% 20%' }}>
            {/* amount in nomenclature */}
            <div className="flex flex-col justify-evenly">
              <div style={{ borderBottom: '1px solid navy', width: '95%' }}
                className="h-[30px]"
                placeholder={"Amount in letters"}>{
                  "Rs. " + numWords(Amount) + " Only"
                }</div>
              <input
                style={{ borderBottom: '1px solid navy', width: '95%' }}
                placeholder={"Recieved By"}
                className={`items ${cursor === 2 ? "actives" : ""}  mx-auto`}
                onClick={() => setSelected(2)}
                onChange={(e) => setrecievedBy(e.target.value)}
                onMouseEnter={() => setHovered(2)}
                onMouseLeave={() => setHovered(undefined)}
              />
            </div>
            {/* amount in numbers and signature */}
            <div className="grid" style={{ gridTemplateRows: '45% 10% 45%' }}>
              <div style={{ border: '1px solid navy', display: 'flex', justifyContent: 'center', alignItems: 'center' }} className="bg-blue-200 h-full">
                <input
                  style={{ width: '95%' }}
                  placeholder={"$200"}
                  className={`items ${cursor === 1 ? "actives" : ""}  mx-auto bg-blue-200`}
                  onClick={() => setSelected(1)}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  onMouseEnter={() => setHovered(1)}
                  onMouseLeave={() => setHovered(undefined)}
                />
              </div>
              <div></div>
              <div style={{ border: '1px solid navy', display: 'flex', justifyContent: 'center', alignItems: 'center' }} >Sign</div>
            </div>

          </div>
        </div>

        {/* company details */}
        <div className="text-center font-bold w-full bg-blue-500 text-white">
          <h1>{ownerName}</h1>
          <h1 className="uppercase" >{foundUser[0].companyAddress}</h1>
        </div>
      </div>

      <div className="flex justify-evenly mx-auto">
        <button
          onClick={handlePrint}
          className=" text-white bg-blue-600 p-4 h-[100px] hover:bg-blue-100 hover:text-blue-600 ml-2 div-2 rounded-[10px] h-[50px] mt-2"
        > Print
        </button>
        <button
          onClick={handleAdd}
          className=" text-white bg-blue-600 p-4 h-[100px] hover:bg-blue-100 hover:text-blue-600 ml-2 div-2 rounded-[10px] h-[50px] mt-2"
        >Add
        </button>
        <button onClick={() => setshowAllCustomerList(true)}
          className=" text-white bg-blue-600 p-4 h-[100px] hover:bg-blue-100 hover:text-blue-600 ml-2 div-2 rounded-[10px] h-[50px] mt-2"
        >View All</button>
      </div>
    </div>
  );
};

export default ReciptInvoice;

