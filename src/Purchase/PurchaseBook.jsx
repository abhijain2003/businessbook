import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useLocation } from 'react-router-dom';



function PurchaseRecord() {

  const location = useLocation();

  const found = location.state.user;
  const Pdata = location.state.purchase;
  var userPurData = Pdata.filter((rec) => rec.user === found[0].companyName);
  const [userPurchase, setuserPurchase] = useState(userPurData);
  const [searchVal, setsearchVal] = useState("");
  const [monthVal, setmonthVal] = useState("");
  const [yearVal, setyearVal] = useState("");
  const [priceVal, setpriceVal] = useState(0);
  let months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  let years = ["2022", "2023", "2024", "2025", "2026", "2027", "2028", "2029", "2030", "2031", "2032"];
  let price = [["Below 10000", 10000], ["Below 20000", 20000], ["Below 50000", 50000], ["Below 75000", 75000], ["Below 100000", 100000], ["Below 200000", 200000], ["Below 500000", 500000], ["Below 1000000", 1000000]];

  userPurData = userPurData.sort(function (a, b) {
    return new Date(a.billDate) - new Date(b.billDate);
  });

  function handleReset() {
    setuserPurchase(userPurData)
  }


  function handleSearch() {
    setuserPurchase(userPurData.filter((val) => {
      let mon = new Date(val.billDate).getMonth();
      let yr = new Date(val.billDate).getFullYear();
      let finalSum = val.TaxAmt + val.CGST + val.SGST + val.IGST
      if (mon === Number(monthVal) && yearVal === "" && priceVal === 0) {
        return val
      } else if (monthVal === "" && yr === Number(yearVal) && priceVal === 0) {
        return val;
      } else if (monthVal === "" && yearVal === "" && Number(priceVal) > finalSum) {
        return val;
      } else if (mon === Number(monthVal) && yr === Number(yearVal) && priceVal === 0) {
        return val;
      } else if (mon === Number(monthVal) && yr === Number(yearVal) && Number(priceVal) > finalSum) {
        return val;
      }
    }))
  }


  return (
    <div className='bg-[#D3CEDF] h-[100vh] w-full' >
      <div className='w-[90%] h-[90%] mx-auto'>
        {/* filters */}
        <h1 className='font-bold uppercase text-2xl text-center' >{found[0].companyName.split("-").join(" ").charAt(0).toUpperCase() + found[0].companyName.split("-").join(" ").slice(1)} Purchase Record from {found[0].DateOfJoin} to today</h1>
        <div style={{ overflowY: 'auto' }} className='h-[90vh] items-center mt-4 text-center print lg:w-full p-4 bg-white'>

          <div className='w-full grid grid-cols-2 gap-x-4 gap-y-4 grid-rows-3 md:flex md:justify-evenly' >

            <div className="relative">
              <div className="absolute flex items-center ml-2 h-full">

              </div>
              <input type="text" onChange={(e) => setsearchVal(e.target.value)} placeholder="Search by Party Name" className="p-2 rounded-[12px] w-full pl-8 bg-slate-200" />
            </div>

            <button onClick={handleSearch} className="bg-slate-200 p-2 rounded-[8px]">
              Search Filter
            </button>

            <button onClick={handleReset} className="bg-slate-200 p-2 rounded-[8px]">
              Reset Filter
            </button>

            <select onChange={(e) => setmonthVal(e.target.value)} className="bg-slate-200 p-2 rounded-[8px]">
              <option value="">Month</option>
              {months.map((mon, i) => (
                <option key={i} value={i}>{mon}</option>
              ))}
            </select>

            <select onChange={(e) => setyearVal(e.target.value)} className="bg-slate-200 p-2 rounded-[8px]">
              <option value="">Year</option>
              {years.map((yer, i) => (
                <option key={i} value={yer}>{yer}</option>
              ))}
            </select>

            <select onChange={(e) => setpriceVal(e.target.value)} className="bg-slate-200 p-2 rounded-[8px]">
              <option value={0}>Below Price</option>
              {price.map((prc, i) => (
                <option key={i} value={prc[1]}>{prc[0]}</option>
              ))}
            </select>

          </div>

          <div className="w-full mt-12 bg-[#92A9BD] grid text-[12px] md:text-[16px]" style={{ gridTemplateColumns: '10% 10% 10% 20% 15% 10% 10% 15%' }} >
            <p style={{ padding: '4px', fontWeight: 'bold', textTransform: 'uppercase', width: '100%', wordBreak: 'break-word', padding: '4px' }} >SNO.</p>
            <p style={{ padding: '4px', fontWeight: 'bold', textTransform: 'uppercase', width: '100%', wordBreak: 'break-word', padding: '4px' }} >Bill Date</p>
            <p style={{ padding: '4px', fontWeight: 'bold', textTransform: 'uppercase', width: '100%', wordBreak: 'break-word', padding: '4px' }} >Bill No.</p>
            <p style={{ padding: '4px', fontWeight: 'bold', textTransform: 'uppercase', width: '100%', wordBreak: 'break-word', padding: '4px' }} >Supplier Name</p>
            <p style={{ padding: '4px', fontWeight: 'bold', textTransform: 'uppercase', width: '100%', wordBreak: 'break-word', padding: '4px' }} >Supplier GST</p>
            <p style={{ padding: '4px', fontWeight: 'bold', textTransform: 'uppercase', width: '100%', wordBreak: 'break-word', padding: '4px' }} >Taxable Amt.</p>
            <p style={{ padding: '4px', fontWeight: 'bold', textTransform: 'uppercase', width: '100%', wordBreak: 'break-word', padding: '4px' }} >Total Tax</p>
            <p style={{ padding: '4px', fontWeight: 'bold', textTransform: 'uppercase', width: '100%', wordBreak: 'break-word', padding: '4px' }} >Total Amount</p>
          </div>
          {userPurchase.filter((val) => {
            if (searchVal === "") {
              return val
            } else if (val.Supplier.split("-").join(" ").toLowerCase().includes(searchVal.toLowerCase())) {
              return val
            }
          }).map((pur, i) => {
            return (
              <a key={i} className="cursor-pointer" rel="noreferrer" href={pur.billPhoto} target="_blank" >
                <div className="w-full bg-slate-200 grid text-[12px] md:text-[16px]" style={{ gridTemplateColumns: '10% 10% 10% 20% 15% 10% 10% 15%' }} >
                  <p style={{ padding: '4px', fontWeight: 'bold', textTransform: 'uppercase', width: '100%', wordBreak: 'break-word', padding: '4px' }} >{i + 1}</p>
                  <p style={{ padding: '4px', width: '100%', wordBreak: 'break-word', padding: '4px' }} >{pur.billDate}</p>
                  <p style={{ padding: '4px', width: '100%', wordBreak: 'break-word', padding: '4px' }} >{pur.billNo}</p>
                  <p style={{ padding: '4px', width: '100%', wordBreak: 'break-word', padding: '4px' }} >{pur.Supplier.split("-").join(" ").charAt(0).toUpperCase() + pur.Supplier.split("-").join(" ").slice(1)}</p>
                  <p style={{ padding: '4px', width: '100%', wordBreak: 'break-word', padding: '4px' }} >{pur.Suppliergst}</p>
                  <p style={{ padding: '4px', width: '100%', wordBreak: 'break-word', padding: '4px' }} >{pur.TaxAmt}</p>
                  <p style={{ padding: '4px', width: '100%', wordBreak: 'break-word', padding: '4px' }} >{Number(pur.CGST) + Number(pur.SGST) + Number(pur.IGST)}</p>
                  <p style={{ padding: '4px', width: '100%', wordBreak: 'break-word', padding: '4px' }} >{pur.TaxAmt + pur.CGST + pur.SGST + pur.IGST}</p>
                </div></a>
            )
          })}
        </div>

      </div>
    </div>
  )
}

export default PurchaseRecord;