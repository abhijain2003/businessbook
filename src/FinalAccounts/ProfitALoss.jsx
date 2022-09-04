import React from 'react'

function ProfitALoss({
  indirectExpenseArr,
  ledgerEntryData,
  grossData,
  indirectGain,
  liabilityArray,
  currUser
}) {



  let debitSideTotal = grossData < 0 ? (grossData) * (-1) : 0;
  let creditSideTotal = grossData >= 0 ? grossData : 0;

 if (indirectExpenseArr.length !== 0 && ledgerEntryData.length !== 0 && indirectGain.length !== 0 && liabilityArray.length !== 0) {
  return (
    <div>
      <div className='w-[90%] sm:w-[70%] mt-16 mx-auto flex justify-between'>
        <p className='font-bold'>Dr.</p>
        <p className='font-bold'>Proft & Loss A/c</p>
        <p className='font-bold'>Cr.</p>
      </div>
      <div style={{ borderTop: '1px solid black', borderRight: '1px solid black', borderLeft: '1px solid black' }} className='w-[90%] sm:w-[70%] mx-auto text-center grid grid-cols-[30%_20%_30%_20%]'>
        <p style={{ borderRight: '1px solid black', wordBreak: 'break-word' }}>{grossData < 0 ? "Gross Loss" : ""}</p>
        <p style={{ borderRight: '1px solid black', wordBreak: 'break-word' }}>{grossData < 0 ? (grossData) * (-1) : null}</p>
        <p style={{ borderRight: '1px solid black', wordBreak: 'break-word' }}>{grossData >= 0 ? 'Gross Profit' : ''}</p>
        <p>{grossData >= 0 ? grossData : null}</p>
      </div>
      {
        indirectExpenseArr.map((val, i) => {
          let losses = ledgerEntryData.filter((entry) => {
            if (val.value === entry.DebitAccount) {
              return entry
            }
          });

          if (losses.length !== 0) {
            let lossesAmtArr = losses.map((val) => { return val.DebitAmount });
            let lossAmt = lossesAmtArr.reduce((acc, curr) => { return acc + curr }, 0);
            debitSideTotal += lossAmt

            return (
              <div key={i} style={{ borderTop: '1px solid black', borderRight: '1px solid black', borderLeft: '1px solid black' }} className='w-[90%] sm:w-[70%] mx-auto text-center grid grid-cols-[30%_20%_30%_20%]'>
                <p style={{ borderRight: '1px solid black', wordBreak: 'break-word' }}>{losses[0].DebitAccount}</p>
                <p style={{ borderRight: '1px solid black', wordBreak: 'break-word' }}>{lossAmt}</p>
                <p style={{ borderRight: '1px solid black', wordBreak: 'break-word' }}></p>
                <p></p>
              </div>
            )
          }

        })
      }
      {
        liabilityArray.map((val, i) => {
          let data = ledgerEntryData.filter((entry) => {
            if (entry.DebitAccount === val.value && !val.value.includes('sales-tax') && (entry.CreditAccount === 'cash-account' || entry.CreditAccount === currUser[0].bankName)) {
              return entry
            }
          });

          if (data.length !== 0) {
            let total = data.map((val) => { return val.DebitAmount });
            total = total.reduce((acc, curr) => { return acc + curr }, 0);
            debitSideTotal += total

            return (
              <div key={i} style={{ borderTop: '1px solid black', borderRight: '1px solid black', borderLeft: '1px solid black' }} className='w-[90%] sm:w-[70%] mx-auto text-center grid grid-cols-[30%_20%_30%_20%]'>
                <p style={{ borderRight: '1px solid black', wordBreak: 'break-word' }}>{data[0].DebitAccount + " paid"}</p>
                <p style={{ borderRight: '1px solid black', wordBreak: 'break-word' }}>{total}</p>
                <p style={{ borderRight: '1px solid black', wordBreak: 'break-word' }}></p>
                <p></p>
              </div>
            )
          }


        })
      }
      {
        indirectGain.map((val, i) => {
          let gaines = ledgerEntryData.filter((entry) => {
            if (val.value === entry.CreditAccount) {
              return entry
            }
          });


          if (gaines.length !== 0) {
            let gainAmtArr = gaines.map((val) => { return val.DebitAmount });
            let gainAmt = gainAmtArr.reduce((acc, curr) => { return acc + curr }, 0);
            creditSideTotal += gainAmt

            return (
              <div key={i} style={{ borderTop: '1px solid black', borderRight: '1px solid black', borderLeft: '1px solid black' }} className='w-[90%] sm:w-[70%] mx-auto text-center grid grid-cols-[30%_20%_30%_20%]'>
                <p style={{ borderRight: '1px solid black', wordBreak: 'break-word' }}></p>
                <p style={{ borderRight: '1px solid black', wordBreak: 'break-word' }}></p>
                <p style={{ borderRight: '1px solid black', wordBreak: 'break-word' }}>{gaines[0].CreditAccount}</p>
                <p>{gainAmt}</p>
              </div>
            )
          }

        })
      }
      <div style={{ borderTop: '1px solid black', borderRight: '1px solid black', borderLeft: '1px solid black' }} className='w-[90%] sm:w-[70%] mx-auto text-center grid grid-cols-[30%_20%_30%_20%]'>
        <p style={{ borderRight: '1px solid black', wordBreak: 'break-word' }}>{creditSideTotal - debitSideTotal >= 0 ? "Net Profit" : ""}</p>
        <p style={{ borderRight: '1px solid black', wordBreak: 'break-word' }}>{creditSideTotal - debitSideTotal >= 0 ? creditSideTotal - debitSideTotal : ""}</p>
        <p style={{ borderRight: '1px solid black', wordBreak: 'break-word' }}>{creditSideTotal - debitSideTotal < 0 ? "Net Loss" : ""}</p>
        <p>{creditSideTotal - debitSideTotal < 0 ? debitSideTotal - creditSideTotal : ""}</p>
      </div>
      <div style={{ border: '1px solid black' }} className='w-[90%] sm:w-[70%] mx-auto text-center grid grid-cols-[30%_20%_30%_20%]'>
        <p style={{ borderRight: '1px solid black', wordBreak: 'break-word' }}>Total</p>
        <p style={{ borderRight: '1px solid black', wordBreak: 'break-word' }}>{debitSideTotal += (creditSideTotal - debitSideTotal) >= 0 ? (creditSideTotal - debitSideTotal) : 0}</p>
        <p style={{ borderRight: '1px solid black', wordBreak: 'break-word' }}>Total</p>
        <p>{creditSideTotal += (creditSideTotal - debitSideTotal < 0 ? (debitSideTotal - creditSideTotal) : 0)}</p>
      </div>
    </div>
  )
 }
}

export default ProfitALoss