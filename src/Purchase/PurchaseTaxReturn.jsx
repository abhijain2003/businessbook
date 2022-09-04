import React, { useState, useRef } from 'react';
import 'react-toastify/dist/ReactToastify.css';
import { useParams } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { useReactToPrint } from "react-to-print";


function PurchaseRecord() {

  const location = useLocation();

  const found = location.state.user;
  const Pdata = location.state.purchase;
  const userPurData = Pdata.filter((rec) => rec.user === found[0].companyName);
  const [userPurchase, setuserPurchase] = useState(userPurData);
  const [searchVal, setsearchVal] = useState("");
  const [monthVal, setmonthVal] = useState("");
  const [yearVal, setyearVal] = useState("");
  const [priceVal, setpriceVal] = useState(0);
  let months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  let years = ["2022", "2023", "2024", "2025", "2026", "2027", "2028", "2029", "2030", "2031", "2032"];
  let price = [["Below 10000", 10000], ["Below 20000", 20000], ["Below 50000", 50000], ["Below 75000", 75000], ["Below 100000", 100000], ["Below 200000", 200000], ["Below 500000", 500000], ["Below 1000000", 1000000]];

  function handleReset() {
    setuserPurchase(userPurData)
  }

  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  })

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
    <div className='bg-[#D3CEDF]' >
      <div className='grid grid-rows-2 min-h-screen w-[90%] mx-auto'>
        {/* filters */}
        <div className="w-full md:w-2/3 mx-auto h-[40vh] shadow mx-auto p-5 rounded-lg bg-white">
          <div className="relative">
            <div className="absolute flex items-center ml-2 h-full">

            </div>

            <input type="text" onChange={(e) => setsearchVal(e.target.value)} placeholder="Search by Party Name" className="px-8 py-3 w-full rounded-md bg-gray-100 border-transparent focus:border-gray-500 focus:bg-white focus:ring-0 text-sm" />
          </div>

          <div className="flex items-center justify-evenly mt-4">
            <button onClick={handleSearch} className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 text-sm font-medium rounded-md">
              Search Filter
            </button>

            <button onClick={handlePrint} className="px-4 py-2 bg-green-400 hover:bg-gray-200 text-gray-800 text-sm font-medium rounded-md">
              Print Record
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

              <select onChange={(e) => setpriceVal(e.target.value)} className="px-4 py-3 w-full rounded-md bg-gray-100 border-transparent focus:border-gray-500 focus:bg-white focus:ring-0 text-sm">
                <option value={0}>Below Price</option>
                {price.map((prc, i) => (
                  <option key={i} value={prc[1]}>{prc[0]}</option>
                ))}
              </select>

              <p className="font-medium px-4 py-3 w-full rounded-md bg-gray-100 border-transparent focus:border-gray-500 focus:bg-white focus:ring-0 text-sm">Click On Entry to view Bill Photo</p>
            </div>
          </div>
        </div>
        {/* filters */}
        <div ref={componentRef} style={{ overflowY: 'auto' }} className='h-[45vh] text-center print lg:w-full mb-4 bg-white p-4'>
          <h1 className='font-bold uppercase text-2xl text-center mt-12 mb-8' >{found[0].companyName.split("-").join(" ").charAt(0).toUpperCase() + found[0].companyName.split("-").join(" ").slice(1)} Purchase Record from {found[0].DateOfJoin} to today</h1>

          <div className="w-full grid text-[12px]" style={{ gridTemplateColumns: '3% 10% 7% 28% 12% 12% 6% 6% 6% 10%' }} >
            <p style={{ border: '1px solid black', fontWeight: 'bold', textTransform: 'uppercase', width: '100%', wordBreak: 'break-word', padding: '4px' }} >SNO.</p>
            <p style={{ border: '1px solid black', fontWeight: 'bold', textTransform: 'uppercase', width: '100%', wordBreak: 'break-word', padding: '4px' }} >Bill Date</p>
            <p style={{ border: '1px solid black', fontWeight: 'bold', textTransform: 'uppercase', width: '100%', wordBreak: 'break-word', padding: '4px' }} >Bill No.</p>
            <p style={{ border: '1px solid black', fontWeight: 'bold', textTransform: 'uppercase', width: '100%', wordBreak: 'break-word', padding: '4px' }} >Supplier Name</p>
            <p style={{ border: '1px solid black', fontWeight: 'bold', textTransform: 'uppercase', width: '100%', wordBreak: 'break-word', padding: '4px' }} >Supplier GST</p>
            <p style={{ border: '1px solid black', fontWeight: 'bold', textTransform: 'uppercase', width: '100%', wordBreak: 'break-word', padding: '4px' }} >Taxable Amt.</p>
            <p style={{ border: '1px solid black', fontWeight: 'bold', textTransform: 'uppercase', width: '100%', wordBreak: 'break-word', padding: '4px' }} >CGST</p>
            <p style={{ border: '1px solid black', fontWeight: 'bold', textTransform: 'uppercase', width: '100%', wordBreak: 'break-word', padding: '4px' }} >SGST</p>
            <p style={{ border: '1px solid black', fontWeight: 'bold', textTransform: 'uppercase', width: '100%', wordBreak: 'break-word', padding: '4px' }} >IGST</p>
            <p style={{ border: '1px solid black', fontWeight: 'bold', textTransform: 'uppercase', width: '100%', wordBreak: 'break-word', padding: '4px' }} >Total Amount</p>
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
                <div className="w-full grid text-[12px]" style={{ gridTemplateColumns: '3% 10% 7% 28% 12% 12% 6% 6% 6% 10%' }} >
                  <p style={{ border: '1px solid black', fontWeight: 'bold', textTransform: 'uppercase', width: '100%', wordBreak: 'break-word', padding: '4px' }} >{i + 1}</p>
                  <p style={{ border: '1px solid black', width: '100%', wordBreak: 'break-word', padding: '4px' }} >{pur.billDate}</p>
                  <p style={{ border: '1px solid black', width: '100%', wordBreak: 'break-word', padding: '4px' }} >{pur.billNo}</p>
                  <p style={{ border: '1px solid black', width: '100%', wordBreak: 'break-word', padding: '4px' }} >{pur.Supplier.split("-").join(" ").charAt(0).toUpperCase() + pur.Supplier.split("-").join(" ").slice(1)}</p>
                  <p style={{ border: '1px solid black', width: '100%', wordBreak: 'break-word', padding: '4px' }} >{pur.Suppliergst}</p>
                  <p style={{ border: '1px solid black', width: '100%', wordBreak: 'break-word', padding: '4px' }} >{pur.TaxAmt}</p>
                  <p style={{ border: '1px solid black', width: '100%', wordBreak: 'break-word', padding: '4px' }} >{pur.CGST}</p>
                  <p style={{ border: '1px solid black', width: '100%', wordBreak: 'break-word', padding: '4px' }} >{pur.SGST}</p>
                  <p style={{ border: '1px solid black', width: '100%', wordBreak: 'break-word', padding: '4px' }} >{pur.IGST}</p>
                  <p style={{ border: '1px solid black', width: '100%', wordBreak: 'break-word', padding: '4px' }} >{pur.TaxAmt + pur.CGST + pur.SGST + pur.IGST}</p>
                </div></a>
            )
          })}
        </div>

      </div>
    </div>
  )
}

export default PurchaseRecord;