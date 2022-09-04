import React, { useState, useEffect } from 'react';
import ProfitALoss from './ProfitALoss';
import BalanceSheet from './BalanceSheet';
import { useLocation, useParams } from 'react-router-dom';


function FinalAccount() {

  const route = useParams();
  const location = useLocation();
  const Ldata = location.state.ledger;
  const Sdata = location.state.sale;
  const Pdata = location.state.purchase;
  const Fdata = location.state.final;
  const Lentrydata = location.state.ledgerEntry;


  const [directExpenseArr, setdirectExpenseArr] = useState([]);
  const [indirectExpenseArr, setindirectExpenseArr] = useState([]);
  const [indirectGain, setindirectGain] = useState([]);
  const [assetsArray, setassetsArray] = useState([]);
  const [liabilityArray, setliabilityArray] = useState([]);

  const [yearVal, setyearVal] = useState("");
  const [FinalData, setFinalData] = useState([]);
  const [SaleData, setSaleData] = useState([]);
  const [PurchaseData, setPurchaseData] = useState([]);
  let years = ["2022", "2023", "2024", "2025", "2026", "2027", "2028", "2029", "2030", "2031", "2032"];



  //fetching user data
  const currUser = location.state.user;

  useEffect(() => {
    setFinalData(Fdata.filter((val) => {
      if (val.EntryYear === new Date().getFullYear() - 1 && val.user === route.user) {
        return val
      }
    }))
    setPurchaseData(Pdata.filter((val) => {
      if (new Date(val.billDate).getFullYear() === new Date().getFullYear() && val.user === route.user) {
        return val
      }
    }))
    setSaleData(Sdata.filter((val) => {
      if (new Date(val.billDate).getFullYear() === new Date().getFullYear() && val.user === route.user) {
        return val
      }
    }))
  }, [])


  // filtering and merging common and user specific ledger accounts
  let commonArr = Ldata.filter((val) => {
    if (val.user === 'common') {
      return val
    }
  });
  commonArr = commonArr[0].accounts
  let userSpecificArr = Ldata.filter((val) => {
    if (val.user === route.user) {
      return val
    }
  });
  userSpecificArr = userSpecificArr[0].accounts
  useEffect(() => {
    let finalArr = [...commonArr, ...userSpecificArr]

    let directArr = finalArr.filter((val) => {
      if (val.type === 'direct-expense' && val.value !== 'purchase-account') {
        return val
      }
    })

    let indirectExpArr = finalArr.filter((val) => {
      if (val.type === 'indirect-expense') {
        return val
      }
    })

    let indirectGainArr = finalArr.filter((val) => {
      if (val.type === 'indirect-gain') {
        return val
      }
    })

    let assets = finalArr.filter((val) => {
      if (val.type === 'asset' && val.value !== 'cash-account' && val.value !== currUser[0].bankName && val.value !== 'stock-in-hand') {
        return val
      }
    })

    let liability = finalArr.filter((val) => {
      if (val.type === 'liability' && val.value !== 'capital-account') {
        return val
      }
    })

    setassetsArray(assets);
    setliabilityArray(liability);
    setindirectGain(indirectGainArr);
    setindirectExpenseArr(indirectExpArr)
    setdirectExpenseArr(directArr)
  }, [])

  function handleSearch() {

    let ledgerEntries = Lentrydata.filter((val) => {
      if (val.user === route.user && new Date(val.dateOfEntry).getFullYear() === Number(yearVal)) {
        return val
      }
    });

    setledgerEntryData(ledgerEntries)

    setFinalData(Fdata.filter((val) => {
      if (val.EntryYear === Number(yearVal) - 1 && val.user === currUser[0].companyName) {
        return val
      }
    }))

    setPurchaseData(Pdata.filter((val) => {
      if (new Date(val.billDate).getFullYear() === Number(yearVal) && val.user === currUser[0].companyName) {
        return val
      }
    }))

    setSaleData(Sdata.filter((val) => {
      if (new Date(val.billDate).getFullYear() === Number(yearVal) && val.user === currUser[0].companyName) {
        return val
      }
    }))

  }

  function handleReset() {
    window.location.reload();
  }



  const [ledgerEntryData, setledgerEntryData] = useState([]);
  // finding specific ledger entries
  let ledgerEntries = Lentrydata.filter((val) => {
    if (val.user === route.user && new Date(val.dateOfEntry).getFullYear() === new Date().getFullYear()) {
      return val
    }
  });

  useEffect(() => {
    setledgerEntryData(ledgerEntries)
  }, [ledgerEntries])

  // finding Opening Stocks
  let OpeningStocks = FinalData.filter((val) => {
    if (val.user === route.user) {
      return val
    }
  });
  OpeningStocks = OpeningStocks.length !== 0 ? OpeningStocks[0].closingStocks : 0;


  // finding Total Purchases
  let TotalPurchase = PurchaseData.filter((val) => {
    if (val.user === route.user) {
      return val;
    }
  });
  let purArr = [];
  TotalPurchase.map((val) => {
    purArr.push(val.TaxAmt, val.CGST, val.IGST, val.SGST)
  });
  TotalPurchase = purArr.reduce((curr, acc) => { return curr + acc }, 0);



  // finding total sales
  let TotalSales = SaleData.filter((val) => {
    if (val.user === route.user) {
      return val;
    }
  });
  let Products = [];
  TotalSales.map((val) => {
    Products.push(...val.product)
  });
  let saleArr = [];
  Products.map((val) => {
    saleArr.push(Number(val.qtn) * Number(val.amt), Number(val.sgst), Number(val.cgst), Number(val.igst))
  })
  TotalSales = saleArr.reduce((curr, acc) => { return curr + acc }, 0);



  //  finding debtors lists
  const debtorLists = userSpecificArr.filter((val) => {
    if (val.type === 'debtor') {
      return val
    }
  })

  //  finding asset lists
  const creditorsList = userSpecificArr.filter((val) => {
    if (val.type === 'creditor') {
      return val
    }
  })



  //finding credit sales
  let creditSales = [];
  debtorLists.map((val) => {
    let data = ledgerEntryData.filter((entry) => {
      if (entry.CreditAccount === 'sales-account' && entry.DebitAccount === val.value) {
        return entry
      }
    })
    data.length !== 0 ? creditSales.push(data[0]) : console.log('nothing')

  })
  creditSales = creditSales.map((val) => {
    return val.DebitAmount
  })
  var creditSaleSum = creditSales.reduce((acc, curr) => { return acc + curr }, 0)


  //finding pay after sales
  let amoutforSales = [];
  debtorLists.map((val) => {
    let data = ledgerEntryData.filter((entry) => {
      if (entry.CreditAccount === val.value && (entry.DebitAccount === 'cash-account' || entry.DebitAccount === currUser[0].bankName)) {
        return entry
      }
    })
    data.length !== 0 ? amoutforSales.push(data[0]) : console.log('nothing')

  })

  amoutforSales = amoutforSales.map((val) => {
    return val.DebitAmount
  })
  var amountafterSales = amoutforSales.reduce((acc, curr) => { return acc + curr }, 0)


  //finding sales return 
  let creditSalesReturn = [];
  debtorLists.map((val) => {
    let data = ledgerEntryData.filter((entry) => {
      if (entry.DebitAccount === 'sales-return' && entry.CreditAccount === val.value) {
        return entry
      }
    })
    data.length !== 0 ? creditSalesReturn.push(data[0]) : console.log('nothing')

  })
  creditSalesReturn = creditSalesReturn.map((val) => {
    return val.DebitAmount
  })
  var salesReturnAmount = creditSalesReturn.reduce((acc, curr) => { return acc + curr }, 0)

  //finding credit purchases
  let creditPurchase = [];
  creditorsList.map((val) => {
    let data = ledgerEntryData.filter((entry) => {
      if (entry.DebitAccount === 'purchase-account' && entry.CreditAccount === val.value) {
        return entry
      }
    })
    data.length !== 0 ? creditPurchase.push(data[0]) : console.log('nothing')

  })
  creditPurchase = creditPurchase.map((val) => {
    return val.DebitAmount
  })
  var creditPurchaseSum = creditPurchase.reduce((acc, curr) => { return acc + curr }, 0)

  //finding pay after purchase
  let amoutforPurchase = [];
  creditorsList.map((val) => {
    let data = ledgerEntryData.filter((entry) => {
      if (entry.DebitAccount === val.value && (entry.CreditAccount === 'cash-account' || entry.CreditAccount === currUser[0].bankName)) {
        return entry
      }
    })
    data.length !== 0 ? amoutforPurchase.push(data[0]) : console.log('nothing')

  })
  amoutforPurchase = amoutforPurchase.map((val) => {
    return val.DebitAmount
  })
  var amountafterPurchase = amoutforPurchase.reduce((acc, curr) => { return acc + curr }, 0)

  //finding purchase return 
  let creditPurchaseReturn = [];
  creditorsList.map((val) => {
    let data = ledgerEntryData.filter((entry) => {
      if (entry.CreditAccount === 'purchase-return' && entry.DebitAccount === val.value) {
        return entry
      }
    })
    data.length !== 0 ? creditPurchaseReturn.push(data[0]) : console.log('nothing')

  })
  creditPurchaseReturn = creditPurchaseReturn.map((val) => {
    return val.DebitAmount
  })
  var purchaseReturnAmount = creditPurchaseReturn.reduce((acc, curr) => { return acc + curr }, 0)

  const sundryDebtors = creditSaleSum - amountafterSales - salesReturnAmount;
  const sundryCreditor = creditPurchaseSum - amountafterPurchase - purchaseReturnAmount;

  // finding remaining cash/bank balance
  let directEarning = ledgerEntryData.filter((val) => {
    if (val.DebitAccount === 'cash-account' || val.DebitAccount === currUser[0].bankName) {
      return val
    }
  });
  directEarning = directEarning.map((val) => { return val.DebitAmount });
  directEarning = directEarning.reduce((curr, acc) => { return acc + curr }, 0);

  let directPay = ledgerEntryData.filter((val) => {
    if (val.CreditAccount === 'cash-account' || val.CreditAccount === currUser[0].bankName) {
      return val
    }
  });
  directPay = directPay.map((val) => { return val.DebitAmount });
  directPay = directPay.reduce((curr, acc) => { return acc + curr }, 0);
  const remaingCashBalance = directEarning - directPay;



  // finding purchase Returns
  let purchaseReturn = ledgerEntryData.filter((val) => {
    if (val.CreditAccount === 'purchase-return') {
      return val
    }
  });
  purchaseReturn = purchaseReturn.map((val) => { return val.DebitAmount });
  purchaseReturn = purchaseReturn.reduce((curr, acc) => { return curr + acc }, 0);

  // finding sales Returns
  let salesReturn = ledgerEntryData.filter((val) => {
    if (val.DebitAccount === 'sales-return') {
      return val
    }
  });
  salesReturn = salesReturn.map((val) => { return val.DebitAmount });
  salesReturn = salesReturn.reduce((curr, acc) => { return curr + acc }, 0);

  let closingStocks = TotalPurchase - TotalSales - purchaseReturn + salesReturn;

  let grossDebit = OpeningStocks + (TotalPurchase - purchaseReturn);
  let grossCredit = (TotalSales - salesReturn) + closingStocks;


  let capitalAccount = ledgerEntryData.filter((val) => {
    if (val.CreditAccount === 'capital-account') {
      return val
    }
  });


  return (
    <div>
      {/* trading account */}
      <h1 className='text-center font-bold text-[20px]' >Whenever There is a update in your Final Account, Don't Forgot to Click Saved Data👎 Button to save Data.</h1>
      <div className='w-[90%] mt-12 sm:w-[50%] mx-auto grid grid-cols-3 gap-2' >
        <select onChange={(e) => setyearVal(e.target.value)} className="bg-slate-200 p-2 rounded-[8px]">
          <option value="">Year</option>
          {years.map((yer, i) => (
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


      <div className='w-[90%] sm:w-[70%] mt-16 mx-auto flex justify-between'>
        <p className='font-bold'>Dr.</p>
        <p className='font-bold'>Trading A/c</p>
        <p className='font-bold'>Cr.</p>
      </div>
      <div style={{ border: '1px solid black' }} className='w-[90%] sm:w-[70%] mx-auto text-center grid grid-cols-[30%_20%_30%_20%]'>
        <p style={{ borderRight: '1px solid black', wordBreak: 'break-word' }}>OpeningStocks</p>
        <p style={{ borderRight: '1px solid black', wordBreak: 'break-word' }}>{OpeningStocks}</p>
        <p style={{ borderRight: '1px solid black', wordBreak: 'break-word' }}>Total Sales</p>
        <p>{TotalSales - salesReturn}</p>
      </div>
      <div style={{ borderBottom: '1px solid black', borderRight: '1px solid black', borderLeft: '1px solid black' }} className='w-[90%] sm:w-[70%] mx-auto text-center grid grid-cols-[30%_20%_30%_20%]'>
        <p style={{ borderRight: '1px solid black', wordBreak: 'break-word' }}>Total Purchase</p>
        <p style={{ borderRight: '1px solid black', wordBreak: 'break-word' }}>{TotalPurchase - purchaseReturn}</p>
        <p style={{ borderRight: '1px solid black', wordBreak: 'break-word' }}>Closing Stocks</p>
        <p>{closingStocks}</p>
      </div>
      {
        directExpenseArr.map((val, i) => {
          let directExpenses = ledgerEntryData.filter((entry) => {
            if (entry.DebitAccount === val.value) {
              return entry
            }
          });

          if (directExpenses.length !== 0) {
            let directExpenseSum = directExpenses.map((val) => { return val.DebitAmount });
            directExpenseSum = directExpenseSum.reduce((acc, curr) => { return acc + curr })
            grossDebit += directExpenseSum;
            return (
              <div key={i} style={{ borderBottom: '1px solid black', borderRight: '1px solid black', borderLeft: '1px solid black' }} className='w-[90%] sm:w-[70%] mx-auto text-center grid grid-cols-[30%_20%_30%_20%]'>
                <p style={{ borderRight: '1px solid black', wordBreak: 'break-word' }}>{directExpenses[0].DebitAccount}</p>
                <p style={{ borderRight: '1px solid black', wordBreak: 'break-word' }}>{directExpenseSum}</p>
                <p style={{ borderRight: '1px solid black', wordBreak: 'break-word' }}></p>
                <p></p>
              </div>
            )
          }

        })
      }
      <div style={{ borderBottom: '1px solid black', borderRight: '1px solid black', borderLeft: '1px solid black' }} className='w-[90%] sm:w-[70%] mx-auto text-center grid grid-cols-[30%_20%_30%_20%]'>
        <p style={{ borderRight: '1px solid black', wordBreak: 'break-word' }}>{grossCredit - grossDebit >= 0 ? "Gross Profit" : ""}</p>
        <p style={{ borderRight: '1px solid black', wordBreak: 'break-word' }}>{grossCredit - grossDebit >= 0 ? grossCredit - grossDebit : null}</p>
        <p style={{ borderRight: '1px solid black', wordBreak: 'break-word' }}>{grossCredit - grossDebit < 0 ? "Gross Loss" : ""}</p>
        <p>{grossCredit - grossDebit < 0 ? grossDebit - grossCredit : null}</p>
      </div>
      <div style={{ borderBottom: '1px solid black', borderRight: '1px solid black', borderLeft: '1px solid black' }} className='w-[90%] sm:w-[70%] mx-auto text-center grid grid-cols-[30%_20%_30%_20%]'>
        <p style={{ borderRight: '1px solid black', wordBreak: 'break-word' }}>Total</p>
        <p style={{ borderRight: '1px solid black', wordBreak: 'break-word' }}>{grossDebit + (grossCredit - grossDebit >= 0 ? grossCredit - grossDebit : 0)}</p>
        <p style={{ borderRight: '1px solid black', wordBreak: 'break-word' }}>Total</p>
        <p>{grossCredit + (grossCredit - grossDebit < 0 ? grossDebit - grossCredit : 0)}</p>
      </div>
      <ProfitALoss
        indirectExpenseArr={indirectExpenseArr}
        ledgerEntryData={ledgerEntryData}
        grossData={grossCredit - grossDebit}
        indirectGain={indirectGain}
        currUser={currUser}
        liabilityArray={liabilityArray}
      />
      <BalanceSheet
        ledgerEntryData={ledgerEntryData}
        liabilityArray={liabilityArray}
        assetsArray={assetsArray}
        sundryCreditor={sundryCreditor}
        sundryDebtors={sundryDebtors}
        OpeningStocks={OpeningStocks}
        closingStocks={closingStocks}
        indirectGain={indirectGain}
        Sdata={Sdata}
        Pdata={Pdata}
        currUser={currUser}
        capitalAccount={capitalAccount}
        indirectExpenseArr={indirectExpenseArr}
        remaingCashBalance={remaingCashBalance}
        grossData={grossCredit - grossDebit}
        FinalData={Fdata}
      />
    </div>
  )
}

export default FinalAccount;
