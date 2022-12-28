import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useLocation } from 'react-router-dom';





function TrialBalance() {

  const route = useParams();
  const location = useLocation();
  const Lentrydata = location.state.ledgerEntry;
  const Ldata = location.state.ledger;
  const Udata = location.state.user;
  const Fdata = location.state.final;

  const [yearVal, setyearVal] = useState("");
  let years = ["2022", "2023", "2024", "2025", "2026", "2027", "2028", "2029", "2030", "2031", "2032"];

  //fetching user data
  const currUser = Udata?.filter((val) => {
    if (val.companyName === route.user) {
      return val
    }
  })


  // finding last year closing stock
  const tradingAcc = Fdata?.filter((val) => {
    if (val.user === route.user && val.EntryYear === new Date().getFullYear() - 1) {
      return val
    }
  })

  const [openingStock, setopeningStock] = useState(0);
  useEffect(() => {
    if (tradingAcc?.length !== 0) {
      setopeningStock(tradingAcc[0].closingStocks)
    }
  }, [tradingAcc])



  const [ledgerEntries, setledgerEntries] = useState([]);
  //fetching current year ledger entry data
  const ledgerEntryData = Lentrydata?.filter((val) => {
    if (val.user === route.user && new Date(val.dateOfEntry).getFullYear() === new Date().getFullYear()) {
      return val
    }
  });


  function handleReset() {
    setledgerEntries(ledgerEntryData)
  }

  useEffect(() => {
    handleReset()
  },[])

  function handleSearch() {
    const ledgerEntryData = Lentrydata?.filter((val) => {
      if (val.user === route.user && new Date(val.dateOfEntry).getFullYear() === Number(yearVal)) {
        return val
      }
    });
    setledgerEntries(ledgerEntryData)
  }

  //common ledger accounts
  let commonLedgerAccounts = Ldata?.filter((val) => {
    if (val.user === 'common') {
      return val
    }
  });
  commonLedgerAccounts = commonLedgerAccounts[0]?.accounts;


  //user specified ledger accounts
  let userSpecificLedgerAccounts = Ldata?.filter((val) => {
    if (val.user === route.user) {
      return val
    }
  });
  userSpecificLedgerAccounts = userSpecificLedgerAccounts[0]?.accounts;


  //  finding debtors lists
  const debtorLists = userSpecificLedgerAccounts?.filter((val) => {
    if (val.type === 'debtor') {
      return val
    }
  })

  //  finding asset lists
  const creditorsList = userSpecificLedgerAccounts?.filter((val) => {
    if (val.type === 'creditor') {
      return val
    }
  })


  //finding credit sales
  let creditSales = [];
  debtorLists?.map((val) => {
    let data = ledgerEntries?.filter((entry) => {
      if (entry.CreditAccount === 'sales-account' && entry.DebitAccount === val.value) {
        return entry
      }
    })
    data?.length !== 0 ? creditSales.push(data[0]) : hello()
  })
  creditSales = creditSales?.map((val) => {
    return val.DebitAmount
  })
  var creditSaleSum = creditSales.reduce((acc, curr) => { return acc + curr }, 0)


  // random function call
  function hello() {
    return console.log("hello")
  }

  //finding pay after sales
  let amoutforSales = [];
  debtorLists?.map((val) => {
    let data = ledgerEntries?.filter((entry) => {
      if (entry.CreditAccount === val.value && (entry.DebitAccount === 'cash-account' || entry.DebitAccount === currUser[0].bankName)) {
        return entry
      }
    })
    data?.length !== 0 ? amoutforSales.push(data[0]) : hello()
  })
  amoutforSales = amoutforSales?.map((val) => {
    return val.DebitAmount
  })
  var amountafterSales = amoutforSales.reduce((acc, curr) => { return acc + curr }, 0)



  //finding sales return 
  let salesReturn = [];
  debtorLists?.map((val) => {
    let data = ledgerEntries?.filter((entry) => {
      if (entry.DebitAccount === 'sales-return' && entry.CreditAccount === val.value) {
        return entry
      }
    })
    data?.length !== 0 ? salesReturn.push(data[0]) : hello()
  })
  salesReturn = salesReturn?.map((val) => {
    return val.DebitAmount
  })
  var salesReturnAmount = salesReturn.reduce((acc, curr) => { return acc + curr }, 0)


  //finding credit purchases
  let creditPurchase = [];
  creditorsList?.map((val) => {
    let data = ledgerEntries?.filter((entry) => {
      if (entry.DebitAccount === 'purchase-account' && entry.CreditAccount === val.value) {
        return entry
      }
    })
    data?.length !== 0 ? creditPurchase.push(data[0]) : hello()
  })
  creditPurchase = creditPurchase?.map((val) => {
    return val.DebitAmount
  })
  var creditPurchaseSum = creditPurchase.reduce((acc, curr) => { return acc + curr }, 0)


  //finding pay after purchase
  let amoutforPurchase = [];
  creditorsList?.map((val) => {
    let data = ledgerEntries?.filter((entry) => {
      if (entry.DebitAccount === val.value && (entry.CreditAccount === 'cash-account' || entry.CreditAccount === currUser[0].bankName)) {
        return entry
      }
    })
    data?.length !== 0 ? amoutforPurchase.push(data[0]) : hello()
  })
  amoutforPurchase = amoutforPurchase?.map((val) => {
    return val.DebitAmount
  })
  var amountafterPurchase = amoutforPurchase.reduce((acc, curr) => { return acc + curr }, 0)


  //finding purchase return 
  let purchaseReturn = [];
  creditorsList?.map((val) => {
    let data = ledgerEntries?.filter((entry) => {
      if (entry.CreditAccount === 'purchase-return' && entry.DebitAccount === val.value) {
        return entry
      }
    })
    data?.length !== 0 ? purchaseReturn.push(data[0]) : hello()
  })
  purchaseReturn = purchaseReturn?.map((val) => {
    return val.DebitAmount
  })
  var purchaseReturnAmount = purchaseReturn.reduce((acc, curr) => { return acc + curr }, 0)


  var finalDebitSideSum = 0;
  var finalCreditSideSum = 0;
  const sundryDebtors = creditSaleSum - amountafterSales - salesReturnAmount;
  const sundryCreditor = creditPurchaseSum - amountafterPurchase - purchaseReturnAmount;
  finalDebitSideSum += sundryDebtors;
  finalCreditSideSum += sundryCreditor

  userSpecificLedgerAccounts = userSpecificLedgerAccounts?.filter((val) => {
    if (val.type !== 'debtor' && val.type !== 'creditor') {
      return val
    }
  })



  return (
    <div className='w-full min-h-screen flex flex-col justify-center items-center' >
      <div className='w-[90%] mt-12 sm:w-[50%] grid grid-cols-3 gap-x-2' >
        <select onChange={(e) => setyearVal(e.target.value)} className="bg-slate-200 p-2 rounded-[8px]">
          <option value="">Year</option>
          {years?.map((yer, i) => (
            <option key={i} value={yer}>{yer}</option>
          ))}
        </select>

        <button onClick={handleSearch} className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 text-sm font-medium rounded-md">
          Search Filter
        </button>

        <button onClick={handleReset} className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 text-sm font-medium rounded-md">
          Reset Filter
        </button>
      </div>

      <h1 className='mt-16 font-bold uppercase text-[16px]' >Trial Balance of Year {new Date().getFullYear()}</h1>
      <div className='w-[90%] mt-8 sm:w-[70%] grid grid-cols-[60%_20%_20%] text-center' >
        <p>Particulars</p>
        <p>Debit</p>
        <p>Credit</p>
      </div>
      <div className='w-[90%] sm:w-[70%] mb-24 overflow-y-auto mx-auto border-2 border-black text-center capitalize font-medium' >
        <div className='grid grid-cols-[60%_20%_20%]' style={{ borderBottom: '1px solid black' }} >
          <p style={{ borderRight: '1px solid black', wordBreak: 'break-word' }}>Opening Stocks</p>
          <p style={{ borderRight: '1px solid black', wordBreak: 'break-word' }}>{openingStock}</p>
          <p>0</p>
        </div>
        <div className='grid grid-cols-[60%_20%_20%]' style={{ borderBottom: '1px solid black' }} >
          <p style={{ borderRight: '1px solid black', wordBreak: 'break-word' }} >Sundry Debtors & Creditors</p>
          <p style={{ borderRight: '1px solid black', wordBreak: 'break-word' }} >{sundryDebtors}</p>
          <p>{sundryCreditor}</p>
        </div>
        {
          userSpecificLedgerAccounts?.map((accountType, i) => {
            let debitEntries = ledgerEntries?.filter((entry) => {
              if (accountType.value === entry.DebitAccount) {
                return entry
              }
            })

            let creditEntries = ledgerEntries?.filter((entry) => {
              if (accountType.value === entry.CreditAccount) {
                return entry
              }
            })

            let debitEntrySum = 0;
            let creditEntrySum = 0;
            if (debitEntries?.length !== 0 || creditEntries?.length !== 0) {
              debitEntries = debitEntries?.map((val) => { return val.DebitAmount });
              creditEntries = creditEntries?.map((val) => { return val.DebitAmount });


              debitEntrySum = debitEntries.reduce((curr, acc) => { return curr + acc }, 0)
              creditEntrySum = creditEntries.reduce((curr, acc) => { return curr + acc }, 0)
              finalDebitSideSum += debitEntrySum
              finalCreditSideSum += creditEntrySum

              return (
                <div key={i} className='grid grid-cols-[60%_20%_20%]' style={{ borderBottom: '1px solid black' }} >
                  <p style={{ borderRight: '1px solid black', wordBreak: 'break-word' }}>{accountType.value}</p>
                  <p style={{ borderRight: '1px solid black', wordBreak: 'break-word' }}>{debitEntrySum}</p>
                  <p>{creditEntrySum}</p>
                </div>
              )
            }
          })
        }

        {
          commonLedgerAccounts?.map((accountType, i) => {

            let debitEntries = ledgerEntries?.filter((entry) => {
              if (accountType.value === entry.DebitAccount) {
                return entry
              }
            })

            let creditEntries = ledgerEntries?.filter((entry) => {
              if (accountType.value === entry.CreditAccount) {
                return entry
              }
            })

            let debitEntrySum = 0;
            let creditEntrySum = 0;
            if (debitEntries?.length !== 0 || creditEntries?.length !== 0) {
              debitEntries = debitEntries?.map((val) => { return val.DebitAmount });
              creditEntries = creditEntries?.map((val) => { return val.DebitAmount });


              debitEntrySum = debitEntries.reduce((curr, acc) => { return curr + acc }, 0)
              creditEntrySum = creditEntries.reduce((curr, acc) => { return curr + acc }, 0)
              finalDebitSideSum += debitEntrySum
              finalCreditSideSum += creditEntrySum

              return (
                <div key={i} className='grid grid-cols-[60%_20%_20%]' style={{ borderBottom: '1px solid black' }} >
                  <p style={{ borderRight: '1px solid black', wordBreak: 'break-word' }}>{accountType.value}</p>
                  <p style={{ borderRight: '1px solid black', wordBreak: 'break-word' }}>{debitEntrySum}</p>
                  <p>{creditEntrySum}</p>
                </div>
              )
            }
          })
        }
        <div className='grid grid-cols-[60%_20%_20%]' style={{ borderBottom: '1px solid black' }} >
          <p style={{ borderRight: '1px solid black', wordBreak: 'break-word' }}>Totals</p>
          <p style={{ borderRight: '1px solid black', wordBreak: 'break-word' }}>{finalDebitSideSum}</p>
          <p>{finalCreditSideSum + openingStock}</p>
        </div>
      </div>
    </div>
  )
}

export default TrialBalance