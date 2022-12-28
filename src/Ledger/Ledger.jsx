import React, { useState, useEffect } from "react";
import { updateLedgerAccount, addLedgerEntry, addLedgerAccount } from "../utils/Ledger";
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

const items = [1, 2, 3, 4, 5];

const Ledger = () => {

  
  const location = useLocation();

  const Ldata = location.state.ledger;
  const Sdata = location.state.sale;
  const Pdata = location.state.purchase;

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

  let route = useParams();
  let found = location.state.user;

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
  }, []);


  const [allLedgerAccounts, setallLedgerAccounts] = useState([]); //fetched account data from database
  const [debitAccountValue, setdebitAccountValue] = useState(""); //debit account value what user type
  const [creditAccountValue, setcreditAccountValue] = useState("");//credit account value what user type
  const [debitAmount, setdebitAmount] = useState(0);//debit amount what user type
  const [creditAmount, setcreditAmount] = useState(0);//credit amount what user type
  const [viewAll, setviewAll] = useState([false, -1]);//view all account or not
  const [foundDebitAccount, setfoundDebitAccount] = useState("");//found debit account
  const [foundCreditAccount, setfoundCreditAccount] = useState("");//found credit account
  const [createNewAccountBox, setcreateNewAccountBox] = useState(false);//create new account div will show or not
  const [newAccountName, setnewAccountName] = useState("");//value of new account created by user
  const [newAccountType, setnewAccountType] = useState("");//type of new account created by user
  const [dateOfEntry, setdateOfEntry] = useState(""); //date of ledger entry

  // assigning all ledger account in useState
  useEffect(() => {
    let commonArray = Ldata.filter((com) => {
      if (com.user === "common") {
        return com?.accounts
      }
    })

    let userSpecifiedArray = Ldata.filter((com) => {
      if (com.user === route.user) {
        return com?.accounts
      }
    })

    commonArray = commonArray[0]?.accounts;
    if (userSpecifiedArray.length !== 0) {
      userSpecifiedArray = userSpecifiedArray[0]?.accounts
    }
    const finalArray = commonArray.concat(userSpecifiedArray);

    setallLedgerAccounts(finalArray)
  }, [Ldata, route.user]);



  //this is for setting foundaccounts on user type value basis


  useEffect(() => {
    function foundaccounts() {
      setfoundDebitAccount(allLedgerAccounts.filter((val) => {
        if (debitAccountValue.length === 0) {
          return null;
        } else if (val.value.split("-").join(" ").toLowerCase().includes(debitAccountValue.toLowerCase())) {
          return val;
        }
      }))

      setfoundCreditAccount(allLedgerAccounts.filter((val) => {
        if (creditAccountValue.length === 0) {
          return null;
        } else if (val.value.split("-").join(" ").toLowerCase().includes(creditAccountValue.toLowerCase())) {
          return val;
        }
      }))
    }

    foundaccounts();
  }, [debitAccountValue, creditAccountValue, allLedgerAccounts])

  useEffect(() => {
    document
      .getElementById("container")
      .querySelectorAll("input")[0].addEventListener(
        "keydown",
        function (e) {
          if (e.shiftKey && foundDebitAccount.length !== 0) {
            setdebitAccountValue(foundDebitAccount[0].value.split("-").join(" "))
          }
        },
        true
      );

    document
      .getElementById("container")
      .querySelectorAll("input")[2].addEventListener(
        "keydown",
        function (e) {
          if (e.shiftKey && foundCreditAccount.length !== 0) {
            setcreditAccountValue(foundCreditAccount[0].value.split("-").join(" "))
          }
        },
        true
      );
  }, [foundDebitAccount, foundCreditAccount])

  //this is for updating accounts when user create new account
  async function handleUpdate() {

    let existedAccount = allLedgerAccounts.filter((val) => {
      if (val.type === newAccountType && val.value === newAccountName) {
        return val;
      }
    })

    if (existedAccount.length !== 0) {
      infoNotify("Account already existed");
    } else if (newAccountName !== "" && newAccountType !== "") {

      let foundUserSpecifiedAccount = Ldata.filter((com) => {
        if (com.user === route.user) {
          return com;
        }
      })
      //if user is adding custom ledger account first time
      if (foundUserSpecifiedAccount.length === 0) {
        await addLedgerAccount(newAccountName, newAccountType, route.user)
          .then((res) => {
            successNotify();
            setnewAccountName("");
            setnewAccountType("");
            setcreateNewAccountBox(false);

            window.location.reload();
          }).catch((err) => {
            errorNotify();
            console.log(err);
          })
      } else {
        let foundUserSpecifiedAccountArray = foundUserSpecifiedAccount[0].accounts
        let copy = [...foundUserSpecifiedAccountArray];
        copy.push({ type: newAccountType, value: newAccountName });
        await updateLedgerAccount(foundUserSpecifiedAccount[0].id, { accounts: copy }).then((res) => {
          successNotify();
          setnewAccountName("");
          setnewAccountType("");
          setcreateNewAccountBox(false);

          window.location.reload();
        }).catch((err) => {
          errorNotify();
          console.log(err);
        })
      }

    } else {
      infoNotify("Please Enter details first");
    }
  }

  //setting debit account value from view all div
  function handleSetValue(ind, input) {
    if (input === 0) {
      setdebitAccountValue(allLedgerAccounts[ind].value);
    } else if (input === 1) {
      setcreditAccountValue(allLedgerAccounts[ind].value);
    }

  }


  const successNotify = () => toast.success("Successfully Added", { autoClose: 1000 });
  const errorNotify = () => toast.error("Error occurred", { autoClose: 1000 });
  const infoNotify = (val) => toast.info(val, { autoClose: 1000 });

  const ledgerArray = ["Debit Entry", "Credit Entry"];


  async function handleAdd() {
    if (dateOfEntry !== "" && debitAmount !== 0 && debitAccountValue !== "" && creditAmount !== 0 && creditAccountValue !== "") {
      await addLedgerEntry(found[0].companyName, dateOfEntry, debitAmount, debitAccountValue.split(" ").join("-"), creditAmount, creditAccountValue.split(" ").join("-"))
        .then((res) => {
          successNotify();
          setdateOfEntry("");
          setdebitAccountValue("");
          setdebitAmount("");
          setcreditAccountValue("");
          setcreditAmount("");
        })
        .catch((err) => {
          errorNotify();
          window.location.reload();
          console.log(err);
        })
    } else {
      infoNotify("Please Enter details first");
    }
  }

  const currUserSale = Sdata.filter((val) => {
    if (val.user === route.user) {
      return val
    }
  })

  const currUserPurchase = Pdata.filter((val) => {
    if (val.user === route.user) {
      return val
    }
  })


  return (
    <div className="MainDiv overflow-x-hidden">
      {/* view all section */}
      <div className="div1" style={{ transform: viewAll[0] ? 'translateY(0)' : 'translateY(-110%)', transition: '0.5s ease-in-out' }}>
        <div className="bg-white md:w-[90%] w-full h-full mx-auto text-center border-2 border-black md:h-[80vh] mt-4 flex flex-col" >
          <div className="flex items-center justify-between p-2">
            <h1 className="font-medium my-8 font-bold uppercase" >All Accounts</h1>
            <p onClick={() => setviewAll([false, -1])} className="hover:scale-150 cursor-pointer" style={{ transition: '0.3s ease-in' }} >x</p>
          </div>
          <div style={{ overflowY: 'auto', marginBottom: '10px' }} >{allLedgerAccounts.map((val, m) => (
            <p onClick={() => handleSetValue(m, viewAll[1])} key={m} className="cursor-pointer w-full px-3 py-2 text-sm leading-tight uppercase font-medium text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline" >{val.value + "(" + val.type + ")"}</p>
          ))}</div>
        </div>
      </div>

      {/* debit and credit entry box */}
      <div className="div2" >
        <ToastContainer />
        <h1 className="text-gray-700 bg-blue-100 text-center font-medium text-[25px] my-8 font-bold uppercase" >{found[0].companyName.split("-").join(" ").charAt(0).toUpperCase() + found[0].companyName.split("-").join(" ").slice(1)}  Ledger Entry</h1>
        <div id="container" className="bg-white w-full overflow-y-auto mb-4 lg:grid lg:grid-cols-2 md:h-[500px] border-2 border-black" >
          {/* debit and credit entry div */}
          {ledgerArray.map((val, i) => (
            <div key={i} className="mb-4 md:mr-2 md:mb-0 w-[80%] mx-auto grid" style={{ gridTemplateRows: '10% 40% 25% 25%' }} >
              <h1 className="font-medium text-[20px] font-bold uppercase" >{val}</h1>

              {/* search filter result */}
              <div style={{ overflowY: 'auto' }} className="h-[160px] flex flex-col items-center justify-center" >{
                i === 0 && foundDebitAccount.length !== 0 ? foundDebitAccount.map((val, k) => (
                  <p key={k} className="uppercase font-medium w-full px-3 py-2 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline" >{val.value.split("-").join(" ")}</p>
                )) : i === 1 && foundCreditAccount.length !== 0 ? foundCreditAccount.map((val, k) => (
                  <p key={k} className="uppercase font-medium w-full px-3 py-2 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline" >{val.value.split("-").join(" ")}</p>
                )) : <div className="flex flex-col" >
                  <button onClick={() => setviewAll([true, i])} className=" text-white bg-blue-600 hover:bg-blue-100 hover:text-blue-600 ml-2 p-2 rounded-[10px] h-[50px] mt-2" >View All</button>
                  <button onClick={() => { setcreateNewAccountBox(true) }} className=" text-white bg-blue-600 hover:bg-blue-100 hover:text-blue-600 ml-2 p-2 rounded-[10px] h-[50px] mt-2" >Create New</button>
                </div>
              }</div>

              <div className="mb-4 md:mr-2 md:mb-0  flex flex-col">
                <label
                  className="block mb-2 text-sm font-bold text-gray-700"
                >
                  Account Type
                </label>
                {i === 0 ? <input
                  className={`items ${cursor === 0 ? "actives" : ""}  w-full px-3 py-2 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline`}
                  onClick={() => setSelected(0)}
                  onMouseEnter={() => setHovered(0)}
                  value={debitAccountValue}
                  onChange={(e) => { setdebitAccountValue(e.target.value) }}
                  onMouseLeave={() => setHovered(undefined)}
                /> : <input
                  className={`items ${cursor === 2 ? "actives" : ""}  w-full px-3 py-2 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline`}
                  onClick={() => setSelected(2)}
                  onMouseEnter={() => setHovered(2)}
                  value={creditAccountValue}
                  onChange={(e) => { setcreditAccountValue(e.target.value) }}
                  onMouseLeave={() => setHovered(undefined)}
                />}
              </div>
              <div className="mb-4 md:mr-2 md:mb-0  flex flex-col">
                <label
                  className="block mb-2 text-sm font-bold text-gray-700"
                >
                  Enter Amount
                </label>
                {i === 1 ? <input
                  className={`items ${cursor === 3 ? "actives" : ""}  w-full px-3 py-2 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline`}
                  onClick={() => setSelected(3)}
                  value={creditAmount}
                  onMouseEnter={() => setHovered(3)}
                  onChange={(e) => { setcreditAmount(Number(e.target.value)) }}
                  onMouseLeave={() => setHovered(undefined)}
                /> : <input
                  className={`items ${cursor === 1 ? "actives" : ""}  w-full px-3 py-2 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline`}
                  onClick={() => setSelected(1)}
                  value={debitAmount}
                  onMouseEnter={() => setHovered(1)}
                  onChange={(e) => { setdebitAmount(Number(e.target.value)) }}
                  onMouseLeave={() => setHovered(undefined)}
                />}
              </div>
            </div>
          ))}
          <div className="mb-4 md:mr-2 md:mb-0 w-[80%] mx-auto flex flex-col">
            <label
              className="block mb-2 text-sm font-bold text-gray-700"
            >
              Enter Date
            </label>
            <input type={'date'}
              className={`items ${cursor === 4 ? "actives" : ""}  w-full px-3 py-2 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline`}
              onClick={() => setSelected(4)}
              value={dateOfEntry}
              onMouseEnter={() => setHovered(4)}
              onChange={(e) => setdateOfEntry(e.target.value)}
              onMouseLeave={() => setHovered(undefined)}
            />
          </div>
          <div className="mb-4 md:mr-2 md:mb-0 w-[80%] mx-auto flex flex-col">
            <label
              className="block mb-2 text-sm font-bold text-gray-700"
            >
              Submit Entry
            </label>
            <button onClick={handleAdd} className=" text-white bg-blue-600 hover:bg-blue-100 hover:text-blue-600 ml-2 p-2 rounded-[10px] h-[50px] mt-2" >Add</button>
          </div>
        </div>
      </div>

      {/* new ledger entry section */}
      <div style={{ transform: createNewAccountBox ? 'translateY(0%)' : 'translateY(-300%)' }} className="div3 bg-[#D3CEDF] ease-in duration-300 h-[70vh] self-center font-medium text-[16px] div3 mx-auto text-center border-2 border-black mt-4 flex flex-col justify-evenly" >
        <div className="flex justify-between w-[90%] mx-auto" >
          <h1>Create New Ledger Account</h1>
          <p onClick={() => setcreateNewAccountBox(false)} className="cursor-pointer" >x</p>
        </div>
        <div className="mb-4 md:mr-2 md:mb-0  flex flex-col">
          <label
            className="block mb-2 text-sm font-bold"
          >
            Enter Account Type
          </label>
          <select value={newAccountType} onChange={(e) => setnewAccountType(e.target.value)} style={{ border: '1px solid black' }} className="w-[80%] mx-auto px-3 py-2 text-sm leading-tight text-gray-700 rounded shadow focus:outline-none focus:shadow-outline" >
            <option value="" >Type of Account</option>
            <option value="asset" >Asset</option>
            <option value="liability" >Liability</option>
            <option value="direct-expense" >Direct Expense</option>
            <option value="indirect-expense" >Indirect Expense</option>
            <option value="gain" >Income</option>
            <option value="debtor" >Sundry Debtor</option>
            <option value="creditor" >Sundry Creditor</option>
          </select>
        </div>
        <div className="mb-4 md:mr-2 md:mb-0  flex flex-col">
          <label
            className="block mb-2 text-sm font-bold"
          >
            Enter Account Name
          </label>

          {newAccountType === "debtor" ? <select onChange={(e) => setnewAccountName((e.target.value).split(" ").join("-").toLowerCase())} style={{ border: '1px solid black' }} className="w-[80%] mx-auto px-3 py-2 text-sm leading-tight text-gray-700 rounded shadow focus:outline-none focus:shadow-outline">
            <option value="" >Sundry Debtors List</option>
            {currUserSale.map((val, i) => (
              <option key={i} >{val.buyer.toUpperCase().split("-").join(" ")}</option>
            ))}
          </select> : newAccountType === "creditor" ? <select onChange={(e) => setnewAccountName((e.target.value).split(" ").join("-").toLowerCase())} style={{ border: '1px solid black' }} className="w-[80%] mx-auto px-3 py-2 text-sm leading-tight text-gray-700 rounded shadow focus:outline-none focus:shadow-outline">
            <option value="" >Sundry Creditors List</option>
            {currUserPurchase.map((val, i) => (
              <option key={i} >{val.Supplier.toUpperCase().split("-").join(" ")}</option>
            ))}
          </select> : <input value={newAccountName} onChange={(e) => setnewAccountName((e.target.value).split(" ").join("-").toLowerCase())} style={{ border: '1px solid black' }}
            className="w-[80%] mx-auto px-3 py-2 text-sm leading-tight text-gray-700 rounded shadow appearance-none focus:outline-none focus:shadow-outline"
          />}
        </div>
        <div className="mb-4 md:mr-2 md:mb-0  flex flex-col">
          <button onClick={handleUpdate} className='text-orange-400 mt-2 bg-white w-[60%] mx-auto px-4 py-2  rounded-[10px] cursor-pointer' >Create</button>
        </div>
      </div>
    </div>
  );
};

export default Ledger;

