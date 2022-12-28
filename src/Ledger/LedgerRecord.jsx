import React, { useState, useEffect } from 'react';
import 'react-toastify/dist/ReactToastify.css';
import { useLocation } from 'react-router-dom';
import { useParams } from 'react-router-dom';



function LedgerRecord() {

  const location = useLocation();
  const LedgerEntrydata = location.state.ledgerEntry;
  const LedgerAccountData = location.state.ledger;

  //search filters
  const [searchVal, setsearchVal] = useState("");
  const [monthVal, setmonthVal] = useState("");
  const [yearVal, setyearVal] = useState("");
  let months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  let years = ["2022", "2023", "2024", "2025", "2026", "2027", "2028", "2029", "2030", "2031", "2032"];


  const name = useParams().user;

  //for setting accounts array value
  const [allAccountType, setallAccountType] = useState([]);

  useEffect(() => {
    const userLedgerEntryData = LedgerEntrydata?.filter((com) => com.user === name);
    setallAccountType(userLedgerEntryData)
  }, [LedgerEntrydata, name])


  const [allLedgerAccounts, setallLedgerAccounts] = useState([]);
  useEffect(() => {
    let commonArray = LedgerAccountData?.filter((com) => {
      if (com.user === "common") {
        return com?.accounts
      }
    })

    let userSpecifiedArray = LedgerAccountData?.filter((com) => {
      if (com.user === name) {
        return com?.accounts
      }
    })
    commonArray = commonArray[0]?.accounts;
    if (userSpecifiedArray?.length !== 0) {
      userSpecifiedArray = userSpecifiedArray[0]?.accounts
    }
    const finalArray = commonArray?.concat(userSpecifiedArray);

    setallLedgerAccounts(finalArray)
  }, [LedgerAccountData, name])

  //reseting all filters
  function handleReset() {
    setallAccountType(LedgerEntrydata?.filter((com) => com.user === name))
  }


  //searching filters
  function handleSearch() {
    setallAccountType(LedgerEntrydata?.filter((val) => {
      let entryDate = new Date(val.dateOfEntry);
      let monthValue = entryDate.getMonth();
      let yearValue = entryDate.getFullYear();

      if (monthValue === Number(monthVal) && yearVal === "") {
        return val
      } else if (monthVal === "" && yearValue === Number(yearVal)) {
        return val;
      } else if (monthValue === Number(monthVal) && yearValue === Number(yearVal)) {
        return val;
      } else if (monthValue === Number(monthVal) && yearValue === Number(yearVal)) {
        return val;
      }
    }));
  }




  return (
    <div className='min-h-screen bg-[#D3CEDF]' >
      {/* filters start */}
      <div className="w-full md:w-2/3 mx-auto shadow p-5 rounded-lg bg-white mb-8">
        <div className="relative">
          <div className="absolute flex items-center ml-2 h-full">

          </div>

          <input onChange={(e) => setsearchVal(e.target.value)} type="text" placeholder="Search by Account Name" className="px-8 py-3 w-full rounded-md bg-gray-100 border-transparent focus:border-gray-500 focus:bg-white focus:ring-0 text-sm" />
        </div>

        <div className="flex items-center justify-evenly mt-4">
          <button onClick={handleSearch} className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 text-sm font-medium rounded-md">
            Search Filter
          </button>

          <button onClick={handleReset} className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 text-sm font-medium rounded-md">
            Reset Filter
          </button>

        </div>

        <div>
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 mt-4">
            <select onChange={(e) => setmonthVal(e.target.value)} className="px-4 py-3 w-full rounded-md bg-gray-100 border-transparent focus:border-gray-500 focus:bg-white focus:ring-0 text-sm">
              <option value="">Month</option>
              {months.map((mon, i) => (
                <option key={i} value={i}>{mon}</option>
              ))}
            </select>

            <select onChange={(e) => setyearVal(e.target.value)} className="px-4 py-3 w-full rounded-md bg-gray-100 border-transparent focus:border-gray-500 focus:bg-white focus:ring-0 text-sm">
              <option value="">Year</option>
              {years.map((yer, i) => (
                <option key={i} value={yer}>{yer}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* filters end */}



      {allLedgerAccounts?.filter((val) => {
        if (searchVal === "") {
          return val
        } else if (val.value.split("-").join(" ").toLowerCase().includes(searchVal.toLowerCase())) {
          return val
        }
      }).map((accountType, i) => {
        const debitEntries = allAccountType?.filter((entry) => {
          if (accountType.value === entry.DebitAccount) {
            return entry
          }
        })

        const creditEntries = allAccountType?.filter((entry) => {
          if (accountType.value === entry.CreditAccount) {
            return entry
          }
        })

        let debitTotal = 0;
        let creditTotal = 0;

        if (debitEntries?.length !== 0 || creditEntries?.length !== 0) {

          return (
            <div className='w-[95%] sm:w-[70%] mx-auto uppercase font-medium text-[15px]' key={i}>
              <h1 className='uppercase text-center font-medium' >{accountType.value + " Ledger Record"}</h1>
              <div style={{ overflowY: 'auto' }} className='border-2 border-black my-8 text-center bg-white h-[300px] grid grid-cols-2'>
                <div style={{ borderRight: '1px solid black' }} >
                  <div>
                    <h1 style={{ borderBottom: '1px solid black' }} >Debit</h1>
                    {debitEntries.map((debit, d) => {
                      debitTotal += debit.CreditAmount
                      return (
                        <div style={{ borderBottom: '1px solid black' }} key={d} className="grid grid-cols-[20%_50%_30%]" >
                          <p style={{ borderRight: '1px solid black', width: '100%', wordBreak: 'break-all', fontSize: '12px' }} >{debit.dateOfEntry}</p>
                          <p style={{ borderRight: '1px solid black', width: '100%', wordBreak: 'break-all', fontSize: '12px' }} >{debit.CreditAccount}</p>
                          <p style={{ width: '100%', wordBreak: 'break-all', fontSize: '12px' }} >{debit.CreditAmount}</p>
                        </div>
                      )
                    })}
                    <div style={{ borderBottom: '1px solid black' }} className="grid grid-cols-[20%_50%_30%]" >
                      <p style={{ borderRight: '1px solid black', width: '100%', wordBreak: 'break-all', fontSize: '12px' }} >-</p>
                      <p style={{ borderRight: '1px solid black', width: '100%', wordBreak: 'break-all', fontSize: '12px' }} >Total</p>
                      <p style={{ width: '100%', wordBreak: 'break-all', fontSize: '12px' }} >{debitTotal}</p>
                    </div>
                  </div>
                </div>
                <div>
                  <div>
                    <h1 style={{ borderBottom: '1px solid black' }} >Credit</h1>
                    {creditEntries.map((credit, c) => {
                      creditTotal += credit.DebitAmount
                      return (
                        <div style={{ borderBottom: '1px solid black' }} key={c} className="grid grid-cols-[20%_50%_30%]" >
                          <p style={{ borderRight: '1px solid black', width: '100%', wordBreak: 'break-all', fontSize: '12px' }} >{credit.dateOfEntry}</p>
                          <p style={{ borderRight: '1px solid black', width: '100%', wordBreak: 'break-all', fontSize: '12px' }} >{credit.DebitAccount}</p>
                          <p style={{ width: '100%', wordBreak: 'break-all', fontSize: '12px' }} >{credit.DebitAmount}</p>
                        </div>
                      )
                    })}
                    <div style={{ borderBottom: '1px solid black' }} className="grid grid-cols-[20%_50%_30%]" >
                      <p style={{ borderRight: '1px solid black', width: '100%', wordBreak: 'break-all', fontSize: '12px' }} >-</p>
                      <p style={{ borderRight: '1px solid black', width: '100%', wordBreak: 'break-all', fontSize: '12px' }} >Total</p>
                      <p style={{ width: '100%', wordBreak: 'break-all', fontSize: '12px' }} >{creditTotal}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )
        } else {
          return null
        }

      })}
    </div>
  )
}

export default LedgerRecord

