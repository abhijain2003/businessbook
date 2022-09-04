import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import SalesInvoiceTemplate from "./SalesInvoiceTemplate";
import { useParams } from 'react-router-dom';
import { useLocation } from 'react-router-dom';


function SalesRecord() {

  const name = useParams().user;
  const location = useLocation();
  const found = location.state.user;
  const Ruledata = location.state.rule;
  const Sdata = location.state.sale;

  var foundRule = Ruledata.filter(
    (com) => com.user === found[0].companyName
  );
  var userSaleData = Sdata.filter((rec) => rec.user === found[0].companyName);

  const [userSale, setuserSale] = useState(userSaleData);
  const [searchVal, setsearchVal] = useState("");
  const [monthVal, setmonthVal] = useState("");
  const [yearVal, setyearVal] = useState("");
  const [priceVal, setpriceVal] = useState(0);
  const [billType, setbillType] = useState("");
  let months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  let years = ["2022", "2023", "2024", "2025", "2026", "2027", "2028", "2029", "2030", "2031", "2032"];
  let price = [["Below 10000", 10000], ["Below 20000", 20000], ["Below 50000", 50000], ["Below 75000", 75000], ["Below 100000", 100000], ["Below 200000", 200000], ["Below 500000", 500000], ["Below 1000000", 1000000]];

  function handleSearch() {
    setuserSale(userSaleData.filter((val) => {
      let mon = new Date(val.billDate).getMonth();
      let typeOfBill = val.billType;
      let yr = new Date(val.billDate).getFullYear();
      let subT = val.product.map((pric) => Number(pric.amt) * Number(pric.qtn));
      subT = subT.reduce((curr, acc) => { return acc + curr });
      let cgst = val.product.map((pric) => Number(pric.cgst));
      cgst = cgst.reduce((curr, acc) => { return acc + curr });
      let sgst = val.product.map((pric) => Number(pric.sgst));
      sgst = sgst.reduce((curr, acc) => { return acc + curr });
      let igst = val.product.map((pric) => Number(pric.igst));
      igst = igst.reduce((curr, acc) => { return acc + curr });
      let finalSum = subT + cgst + sgst + igst + val.shippingAmt;
      if (mon === Number(monthVal) && yearVal === "" && priceVal === 0 && billType === "") {
        return val
      } else if (monthVal === "" && yr === Number(yearVal) && priceVal === 0 && billType === "") {
        return val;
      } else if (monthVal === "" && yearVal === "" && Number(priceVal) > finalSum && billType === "") {
        return val;
      } else if (mon === Number(monthVal) && yr === Number(yearVal) && priceVal === 0 && billType === "") {
        return val;
      } else if (mon === Number(monthVal) && yr === Number(yearVal) && Number(priceVal) > finalSum && billType === "") {
        return val;
      } else if (mon === Number(monthVal) && yearVal === "" && priceVal === 0 && billType === typeOfBill) {
        return val
      } else if (monthVal === "" && yr === Number(yearVal) && priceVal === 0 && billType === typeOfBill) {
        return val;
      } else if (monthVal === "" && yearVal === "" && Number(priceVal) > finalSum && billType === typeOfBill) {
        return val;
      } else if (mon === Number(monthVal) && yr === Number(yearVal) && priceVal === 0 && billType === typeOfBill) {
        return val;
      } else if (mon === Number(monthVal) && yr === Number(yearVal) && Number(priceVal) > finalSum && billType === typeOfBill) {
        return val;
      }
    }))
  }

  function handleReset() {
    setuserSale(userSaleData)
  }

  userSaleData = userSaleData.sort(function (a, b) {
    return new Date(a.billDate) - new Date(b.billDate);
  });

  const successNotify = () => toast.success("Successfully deleted", { autoClose: 1000 });
  const errorNotify = () => toast.error("Error occurred", { autoClose: 1000 });
  const infoNotify = () => toast.info("Please Enter correct login id", { autoClose: 1000 });


  // for viewing in bill format
  const [showBill, setshowBill] = useState(false);


  return (
    <div className='h-[100vh] bg-[#D3CEDF]' >
      <div className='w-[90%] mx-auto'>
        <h1 className='font-bold uppercase text-2xl text-center' >{found[0].companyName.split("-").join(" ").charAt(0).toUpperCase() + found[0].companyName.split("-").join(" ").slice(1)} Sales Record from {found[0].DateOfJoin} to today</h1>
        {/* filters */}
        <div style={{ overflowY: 'auto' }} className='bg-white p-4 h-[70vh] m-4 text-center print lg:w-full'>
          <ToastContainer />

          <div className='w-full grid grid-cols-2 my-4 gap-x-4 gap-y-4 grid-rows-4 md:flex md:justify-evenly' >

            <div className="relative">
              <div className="absolute flex items-center ml-2 h-full">

              </div>

              <input type="text" onChange={(e) => setsearchVal(e.target.value)} placeholder="Search by Party Name" className="p-2 rounded-[12px] w-full pl-8 bg-slate-200" />
            </div>

            {showBill ? null : <><button onClick={handleSearch} className="bg-slate-200 p-2 rounded-[8px]">
              Search Filter
            </button>

              <button onClick={handleReset} className="bg-slate-200 p-2 rounded-[8px]">
                Reset Filter
              </button></>}

            <button onClick={() => setshowBill(curr => !curr)} className="bg-slate-200 p-2 rounded-[8px]">
              {showBill ? "view Entry" : "view Bill"}
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

            <select onChange={(e) => setbillType(e.target.value)} className="bg-slate-200 p-2 rounded-[8px]" >
              <option value="" >BILL TYPE</option>
              <option value="Cash" >CASH</option>
              <option value="Credit" >CREDIT</option>
            </select>

          </div>

          {showBill ? null : <div className="w-full mt-12 bg-[#92A9BD] grid text-[12px] md:text-[16px]" style={{ gridTemplateColumns: '10% 15% 10% 10% 20% 20% 15%' }} >
            <p style={{ fontWeight: 'bold', textTransform: 'uppercase', width: '100%', wordBreak: 'break-word', padding: '4px' }} >SNO.</p>
            <p style={{ fontWeight: 'bold', textTransform: 'uppercase', width: '100%', wordBreak: 'break-word', padding: '4px' }} >Date</p>
            <p style={{ fontWeight: 'bold', textTransform: 'uppercase', width: '100%', wordBreak: 'break-word', padding: '4px' }} >Bill Type</p>
            <p style={{ fontWeight: 'bold', textTransform: 'uppercase', width: '100%', wordBreak: 'break-word', padding: '4px' }} >Bill No.</p>
            <p style={{ fontWeight: 'bold', textTransform: 'uppercase', width: '100%', wordBreak: 'break-word', padding: '4px' }} >Party Name</p>
            <p style={{ fontWeight: 'bold', textTransform: 'uppercase', width: '100%', wordBreak: 'break-word', padding: '4px' }} >Party GST</p>
            <p style={{ fontWeight: 'bold', textTransform: 'uppercase', width: '100%', wordBreak: 'break-word', padding: '4px' }} >Total Amount</p>
          </div>}

          {userSale.filter((val) => {
            if (searchVal === "") {
              return val
            } else if (val.buyer.split("-").join(" ").toLowerCase().includes(searchVal.toLowerCase())) {
              return val
            }
          }).map((sale, i) => {
            //for simple entry view
            let subT = sale.product.map((pric) => Number(pric.amt) * Number(pric.qtn));
            subT = subT.reduce((curr, acc) => { return acc + curr });
            let cgst = sale.product.map((pric) => Number(pric.cgst));
            cgst = cgst.reduce((curr, acc) => { return acc + curr });
            let sgst = sale.product.map((pric) => Number(pric.sgst));
            sgst = sgst.reduce((curr, acc) => { return acc + curr });
            let igst = sale.product.map((pric) => Number(pric.igst));
            igst = igst.reduce((curr, acc) => { return acc + curr });
            let Bdate = new Date(sale.billDate);


            //for bill entry view
            const clientName = sale.buyer;
            const clientAddress = sale.clientAddress
            const clientGST = sale.clientGST
            const times = sale.product
            const ship = sale.shippingAmt
            const billType = sale.billType
            const ownerName = sale.user
            const sumDue = (subT + cgst + sgst + igst + Number(ship)).toFixed(2)
            const sumTax = (cgst + sgst + igst).toFixed(2)
            const sumTaxable = subT;


            return (
              <div>{
                showBill ?
                  <div>
                    <SalesInvoiceTemplate
                      clientName={clientName}
                      clientAddress={clientAddress}
                      clientGST={clientGST}
                      times={times}
                      ship={ship}
                      billType={billType}
                      ownerName={ownerName}
                      foundUser={found}
                      foundRule={foundRule}
                      sumDue={sumDue}
                      sumTax={sumTax}
                      sumTaxable={sumTaxable}
                      foundSale={userSaleData}
                    /></div>
                  :
                  <div key={i} className="w-full bg-slate-200 grid text-[12px] md:text-[16px]" style={{ gridTemplateColumns: '10% 15% 10% 10% 20% 20% 15%' }} >
                    <p style={{ width: '100%', wordBreak: 'break-word', padding: '4px' }} >{i + 1}</p>
                    <p style={{ width: '100%', wordBreak: 'break-word', padding: '4px' }} >{Bdate.toLocaleDateString()}</p>
                    <p style={{ width: '100%', wordBreak: 'break-word', padding: '4px', color: sale.billType === "CASH" ? '#006400' : 'red' }} className="font-medium" >{sale.billType}</p>
                    <p style={{ width: '100%', wordBreak: 'break-word', padding: '4px' }} >{i + 1}</p>
                    <p style={{ width: '100%', wordBreak: 'break-word', padding: '4px' }} >{sale.buyer.split("-").join(" ").charAt(0).toUpperCase() + sale.buyer.split("-").join(" ").slice(1)}</p>
                    <p style={{ width: '100%', wordBreak: 'break-word', padding: '4px' }} >{sale.ClientGST}</p>
                    <p style={{ width: '100%', wordBreak: 'break-word', padding: '4px' }} >{cgst + sgst + igst + subT + Number(sale.shippingAmt)}</p>
                  </div>

              }</div>
            )

          })}
        </div>

      </div>
    </div>
  )
}

export default SalesRecord