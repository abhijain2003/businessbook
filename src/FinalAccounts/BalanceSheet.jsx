import React from 'react';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { addFinal, updateFinal } from "../utils/Final";


function BalanceSheet({
  ledgerEntryData,
  liabilityArray,
  assetsArray,
  sundryCreditor,
  sundryDebtors,
  OpeningStocks,
  closingStocks,
  remaingCashBalance,
  grossData,
  indirectExpenseArr,
  indirectGain,
  currUser,
  capitalAccount,
  FinalData,

}) {


  React.useEffect(() => {
    let data = FinalData.filter((val) => {
      if (val.EntryYear === new Date().getFullYear()) {
        return val
      }
    })

    if (data.length === 0) {
      alert("You have not added it to your database")
    }
  }, [FinalData]);




  const successNotify = (text) =>
    toast.success(text, { autoClose: 1000 });
  const errorNotify = () => toast.error("Error occurred", { autoClose: 1000 });




  // that is for calculating net profit/loss 
  let debit = grossData < 0 ? (grossData) * (-1) : 0;
  let credit = grossData >= 0 ? grossData : 0;

  indirectExpenseArr.map((val, i) => {
    let losses = ledgerEntryData.filter((entry) => {
      if (val.value === entry.DebitAccount) {
        return entry
      }
    });

    if (losses.length !== 0) {
      let lossesAmtArr = losses.map((val) => { return val.DebitAmount });
      let lossAmt = lossesAmtArr.reduce((acc, curr) => { return acc + curr }, 0);
      debit += lossAmt
    }
  })

  indirectGain.map((val, i) => {
    let gaines = ledgerEntryData.filter((entry) => {
      if (val.value === entry.CreditAccount) {
        return entry
      }
    });

    if (gaines.length !== 0) {
      let gainAmtArr = gaines.map((val) => { return val.DebitAmount });
      let gainAmt = gainAmtArr.reduce((acc, curr) => { return acc + curr }, 0);
      credit += gainAmt
    }
  })
  liabilityArray.map((val) => {
    let data = ledgerEntryData.filter((entry) => {
      if (entry.DebitAccount === val.value && !val.value.includes('sales-tax') && (entry.CreditAccount === 'cash-account' || entry.CreditAccount === currUser[0].bankName)) {
        return entry
      }
    });

    if (data.length !== 0) {
      let total = data.map((val) => { return val.DebitAmount });
      total = total.reduce((acc, curr) => { return acc + curr }, 0);
      debit += total
    }
  })


  let netloss = credit - debit < 0 ? (debit - credit) : 0;
  let netProfit = credit - debit >= 0 ? (credit - debit) : 0;

  function handleAdd() {
    let data = FinalData.filter((val) => {
      if (val.EntryYear === new Date().getFullYear()) {
        return val
      }
    })

    if (data.length === 0) {
      addFinal(
        currUser[0].companyName,
        grossData >= 0 ? grossData : 0,
        grossData < 0 ? (grossData) * (-1) : 0,
        credit - debit >= 0 ? (credit - debit) : 0,
        credit - debit < 0 ? (debit - credit) : 0,
        closingStocks,
        new Date().getFullYear()
      ).then(() => {
        successNotify("Successfully Added");
      }).catch(() => {
        errorNotify();
      })
    } else {
      updateFinal(data[0].id, {
        user: currUser[0].companyName,
        grossProfit: grossData >= 0 ? grossData : 0,
        grossLoss: grossData < 0 ? (grossData) * (-1) : 0,
        netProfit: credit - debit >= 0 ? (credit - debit) : 0,
        netLoss: credit - debit < 0 ? (debit - credit) : 0,
        closingStocks: closingStocks,
        EntryYear: new Date().getFullYear()
      }).then(() => {
        successNotify("Successfully Added");
      }).catch((error) => {
        errorNotify();
      })
    }
  }

  let assetData = [];
  let depreciation = [];
  assetsArray.map((val) => {
    let data = ledgerEntryData.filter((entry) => {
      if (val.value === entry.DebitAccount) {
        return entry
      }
    })

    let Ddata = ledgerEntryData.filter((entry) => {
      if (entry.DebitAccount === 'depreciation-account' && entry.CreditAccount === val.value) {
        return entry
      }
    })
    depreciation.push(...Ddata);
    assetData.push(...data)
  });

  let liability = [];
  let paidUp = [];
  liabilityArray.map((val) => {
    let data = ledgerEntryData.filter((entry) => {
      if (entry.CreditAccount === val.value && !val.value.includes("sales-tax")) {
        return entry
      }
    })

    let Ddata = ledgerEntryData.filter((entry) => {
      if (entry.DebitAccount === val.value && !val.value.includes("sales-tax")) {
        return entry
      }
    })
    paidUp.push(...Ddata);
    liability.push(...data)
  });

  let finalDebit = sundryCreditor + OpeningStocks + (netloss === 0 ? capitalAccount.length !== 0 && capitalAccount[0].DebitAmount + netProfit : capitalAccount.length !== 0 && capitalAccount[0].DebitAmount - netloss);
  let finalCredit = sundryDebtors + closingStocks + (remaingCashBalance >= 0 ? remaingCashBalance : 0);


  return (
    <div className='mb-8' >
      <ToastContainer />
      <div className='w-[90%] sm:w-[70%] mt-16 mx-auto flex justify-between'>
        <p className='font-bold'>Liabilities</p>
        <p className='font-bold'>Balance Sheet</p>
        <p className='font-bold'>Assets</p>
      </div>
      <div style={{ borderTop: '1px solid black', borderRight: '1px solid black', borderLeft: '1px solid black' }} className='w-[90%] sm:w-[70%] mx-auto text-center grid grid-cols-[30%_20%_30%_20%]'>
        <p style={{ borderRight: '1px solid black', wordBreak: 'break-word' }}>Sundry Creditors</p>
        <p style={{ borderRight: '1px solid black', wordBreak: 'break-word' }}>{sundryCreditor}</p>
        <p style={{ borderRight: '1px solid black', wordBreak: 'break-word' }}>Sundry Debtors</p>
        <p>{sundryDebtors}</p>
      </div>
      <div style={{ borderTop: '1px solid black', borderRight: '1px solid black', borderLeft: '1px solid black' }} className='w-[90%] sm:w-[70%] mx-auto text-center grid grid-cols-[30%_20%_30%_20%]'>
        <p style={{ borderRight: '1px solid black', wordBreak: 'break-word' }}>Opening Stocks</p>
        <p style={{ borderRight: '1px solid black', wordBreak: 'break-word' }}>{OpeningStocks}</p>
        <p style={{ borderRight: '1px solid black', wordBreak: 'break-word' }}>Closing Stocks</p>
        <p>{closingStocks}</p>
      </div>
      <div style={{ borderTop: '1px solid black', borderRight: '1px solid black', borderLeft: '1px solid black' }} className='w-[90%] sm:w-[70%] mx-auto text-center grid grid-cols-[30%_20%_30%_20%]'>
        <p style={{ borderRight: '1px solid black', wordBreak: 'break-word' }}>Capital</p>
        <p style={{ borderRight: '1px solid black', wordBreak: 'break-word' }}>{netloss === 0 ? capitalAccount.length !== 0 && capitalAccount[0].DebitAmount + netProfit : capitalAccount.length !== 0 && capitalAccount[0].DebitAmount - netloss}</p>
        <p style={{ borderRight: '1px solid black', wordBreak: 'break-word' }}>Cash/Bank Balance</p>
        <p>{remaingCashBalance >= 0 ? remaingCashBalance : 0}</p>
      </div>
      {
        assetData.map((val, i) => {

          let depreData = depreciation.filter((entry) => {
            if (entry.CreditAccount === val.DebitAccount) {
              return entry
            }
          });
          depreData = depreData.map((val) => { return val.DebitAmount });
          depreData = depreData.reduce((acc, curr) => { return acc + curr }, 0);
          finalCredit += (val.DebitAmount - depreData)

          return (
            <div key={i} style={{ borderTop: '1px solid black', borderRight: '1px solid black', borderLeft: '1px solid black' }} className='w-[90%] sm:w-[70%] mx-auto text-center grid grid-cols-[30%_20%_30%_20%]'>
              <p style={{ borderRight: '1px solid black', wordBreak: 'break-word' }}></p>
              <p style={{ borderRight: '1px solid black', wordBreak: 'break-word' }}></p>
              <p style={{ borderRight: '1px solid black', wordBreak: 'break-word' }}>{val.DebitAccount}</p>
              <p>{val.DebitAmount - depreData}</p>
            </div>
          )
        })
      }
      {
        liability.map((val, i) => {

          let depreData = paidUp.filter((entry) => {
            if (entry.DebitAccount === val.CreditAccount) {
              return entry
            }
          });
          depreData = depreData.map((val) => { return val.DebitAmount });
          depreData = depreData.reduce((acc, curr) => { return acc + curr }, 0);
          finalDebit += (val.DebitAmount - depreData)

          return (
            <div key={i} style={{ borderTop: '1px solid black', borderRight: '1px solid black', borderLeft: '1px solid black' }} className='w-[90%] sm:w-[70%] mx-auto text-center grid grid-cols-[30%_20%_30%_20%]'>
              <p style={{ borderRight: '1px solid black', wordBreak: 'break-word' }}>{val.CreditAccount}</p>
              <p style={{ borderRight: '1px solid black', wordBreak: 'break-word' }}>{val.DebitAmount - depreData}</p>
              <p style={{ borderRight: '1px solid black', wordBreak: 'break-word' }}></p>
              <p></p>
            </div>
          )
        })
      }
      <div style={{ border: '1px solid black', borderRight: '1px solid black', borderLeft: '1px solid black' }} className='w-[90%] sm:w-[70%] mx-auto text-center grid grid-cols-[30%_20%_30%_20%]'>
        <p style={{ borderRight: '1px solid black', wordBreak: 'break-word' }}>Total</p>
        <p style={{ borderRight: '1px solid black', wordBreak: 'break-word' }}>{finalDebit}</p>
        <p style={{ borderRight: '1px solid black', wordBreak: 'break-word' }}>Total</p>
        <p>{finalCredit}</p>
      </div>


      <div className='w-full flex justify-center items-center' >
        <button onClick={handleAdd} className="px-4 py-2 bg-green-600 hover:bg-green-400 mt-8 text-gray-800 text-sm font-medium rounded-md">
          Saved Data
        </button>
      </div>
    </div>
  )
}

export default BalanceSheet