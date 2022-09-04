import React, { useState } from 'react';
import 'react-toastify/dist/ReactToastify.css';
import { useParams } from 'react-router-dom';
import { useLocation } from 'react-router-dom';


function ReciptRecord() {
  const name = useParams().user;
  const location = useLocation();
  const found = location.state.user;
  const Rdata = location.state.receipt;
  var userRecData = Rdata.filter((rec) => rec.user === found[0].companyName);

  userRecData = userRecData.sort(function(a,b){
    return new Date(a.recieptDate) - new Date(b.recieptDate);
  });

  const [userRecipt, setuserRecipt] = useState(userRecData);
  const [searchVal, setsearchVal] = useState("");
  const [monthVal, setmonthVal] = useState("");
  const [yearVal, setyearVal] = useState("");
  const [priceVal, setpriceVal] = useState(0);
  let months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  let years = ["2022", "2023", "2024", "2025", "2026", "2027", "2028", "2029", "2030", "2031", "2032"];
  let price = [["Below 10000", 10000], ["Below 20000", 20000], ["Below 50000", 50000], ["Below 75000", 75000], ["Below 100000", 100000], ["Below 200000", 200000], ["Below 500000", 500000], ["Below 1000000", 1000000]];

  function handleReset() {
    setuserRecipt(userRecData)
    setmonthVal("");
    setyearVal("");
    setpriceVal(0);
  }

  function handleSearch() {
    setuserRecipt(userRecData.filter((val) => {
      let mon = new Date(val.recieptDate).getMonth();
      let yr = new Date(val.recieptDate).getFullYear();
      if (mon === Number(monthVal) && yearVal === "" && priceVal === 0) {
        return val
      } else if (monthVal === "" && yr === Number(yearVal) && priceVal === 0) {
        return val;
      } else if (monthVal === "" && yearVal === "" && Number(priceVal) > Number(val.Amount)) {
        return val;
      } else if (mon === Number(monthVal) && yr === Number(yearVal) && priceVal === 0) {
        return val
      } else if (mon === Number(monthVal) && yr === Number(yearVal) && Number(priceVal) > Number(val.Amount)) {
        return val
      }
    }))
  }

  return (
    <div className='bg-[#D3CEDF]' >
      <div className='grid grid-rows-2 min-h-screen w-[90%] mx-auto'>
        {/* filters */}
        <div className="w-full md:w-2/3 h-[40vh] mx-auto shadow p-5 rounded-lg bg-white">
          <div className="relative">
            <div className="absolute flex items-center ml-2 h-full">
              
            </div>

            <input type="text" onChange={(e) => setsearchVal(e.target.value)} placeholder="Search by Party Name" className="px-8 py-3 w-full rounded-md bg-gray-100 border-transparent focus:border-gray-500 focus:bg-white focus:ring-0 text-sm" />
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

              <select onChange={(e) => setpriceVal(e.target.value)} className="px-4 py-3 w-full rounded-md bg-gray-100 border-transparent focus:border-gray-500 focus:bg-white focus:ring-0 text-sm">
                <option value={0}>Below Price</option>
                {price.map((prc, i) => (
                  <option key={i} value={prc[1]}>{prc[0]}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
        {/* filters */}
        <div style={{overflowY: 'auto'}} className='h-[45vh] text-center print lg:w-full p-4 bg-white'>
          <h1 className='font-bold uppercase text-2xl text-center mt-12 mb-8' >{found[0].companyName.split("-").join(" ").charAt(0).toUpperCase() + found[0].companyName.split("-").join(" ").slice(1)} Purchase Record from {found[0].DateOfJoin} to today</h1>

          <div className="w-full grid text-[12px]" style={{ gridTemplateColumns: '10% 15%  10%  25%  25%  15%' }} >
          <p style={{ border: '1px solid black', fontWeight: 'bold', textTransform: 'uppercase', width: '100%', wordBreak: 'break-word', padding: '4px' }} >S.NO.</p>
            <p style={{ border: '1px solid black', fontWeight: 'bold', textTransform: 'uppercase', width: '100%', wordBreak: 'break-word', padding: '4px' }} >Reciept Date</p>
            <p style={{ border: '1px solid black', fontWeight: 'bold', textTransform: 'uppercase', width: '100%', wordBreak: 'break-word', padding: '4px' }} >Reciept No.</p>
            <p style={{ border: '1px solid black', fontWeight: 'bold', textTransform: 'uppercase', width: '100%', wordBreak: 'break-word', padding: '4px' }} >Recieved From</p>
            <p style={{ border: '1px solid black', fontWeight: 'bold', textTransform: 'uppercase', width: '100%', wordBreak: 'break-word', padding: '4px' }} >Recieved By</p>
            <p style={{ border: '1px solid black', fontWeight: 'bold', textTransform: 'uppercase', width: '100%', wordBreak: 'break-word', padding: '4px' }} >Total Amount</p>
          </div>
          {userRecipt.filter((val) => {
            if (searchVal === "") {
              return val
            } else if (val.recievedFrom.split("-").join(" ").toLowerCase().includes(searchVal.toLowerCase())) {
              return val
            }
          }).map((rec, i) => {
            return (
              <div key={i} className="w-full grid text-[14px]" style={{ gridTemplateColumns: '10% 15%  10%  25%  25%  15%' }} >
                <p style={{ border: '1px solid black', fontWeight: 'bold', textTransform: 'uppercase', width: '100%', wordBreak: 'break-word', padding: '4px', cursor: 'pointer' }} >{i+1}</p>
                <p style={{ border: '1px solid black', fontWeight: 'bold', textTransform: 'uppercase', width: '100%', wordBreak: 'break-word', padding: '4px' }} >{rec.recieptDate}</p>
                <p style={{ border: '1px solid black', fontWeight: 'bold', textTransform: 'uppercase', width: '100%', wordBreak: 'break-word', padding: '4px' }} >{rec.recieptNo}</p>
                <p style={{ border: '1px solid black', fontWeight: 'bold', textTransform: 'uppercase', width: '100%', wordBreak: 'break-word', padding: '4px' }} >{rec.recievedFrom.split("-").join(" ").charAt(0).toUpperCase() + rec.recievedFrom.split("-").join(" ").slice(1)}</p>
                <p style={{ border: '1px solid black', fontWeight: 'bold', textTransform: 'uppercase', width: '100%', wordBreak: 'break-word', padding: '4px' }} >{rec.recievedBy}</p>
                <p style={{ border: '1px solid black', fontWeight: 'bold', textTransform: 'uppercase', width: '100%', wordBreak: 'break-word', padding: '4px' }} >{rec.Amount}</p>
              </div>
            )
          })}
        </div>

      </div>
    </div>
  )
}

export default ReciptRecord;