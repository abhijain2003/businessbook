import React, { useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useReactToPrint } from "react-to-print";
import { useParams } from 'react-router-dom';


function SalesTaxReturn() {

    const location = useLocation();
    const Sdata = location.state.sale;
    const found = location.state.user;
    const userSaleData = Sdata.filter((rec) => rec.user === found[0].companyName);

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

    const componentRef = useRef();
    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
    })

    return (
        <div className='h-[100vh] bg-[#D3CEDF]' >
            <div className='w-[90%] mx-auto'>
                {/* filters */}
                <div className="w-full md:w-2/3 mx-auto shadow p-5 rounded-lg bg-white">
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

                            <select onChange={(e) => setbillType(e.target.value)} className="px-4 py-3 w-full rounded-md bg-gray-100 border-transparent focus:border-gray-500 focus:bg-white focus:ring-0 text-sm" >
                                <option value="" >BILL TYPE</option>
                                <option value="Cash" >CASH</option>
                                <option value="Credit" >CREDIT</option>
                            </select>
                        </div>
                    </div>

                </div>
                {/* filters */}
                <div style={{ overflowY: 'auto' }} ref={componentRef} className='bg-white p-4 m-4 h-[60vh] text-center print lg:w-full'>

                    <h1 className='font-bold uppercase text-2xl text-center mt-12 mb-8' >{found[0].companyName.split("-").join(" ").charAt(0).toUpperCase() + found[0].companyName.split("-").join(" ").slice(1)} Sales Record from {found[0].DateOfJoin} to today</h1>

                    <div className="w-full grid text-[12px]" style={{ gridTemplateColumns: '3% 7% 10% 22% 12% 10% 8% 8% 8% 12%' }} >
                        <p style={{ border: '1px solid black', fontWeight: 'bold', textTransform: 'uppercase', width: '100%', wordBreak: 'break-word', padding: '4px' }} >SNO.</p>
                        <p style={{ border: '1px solid black', fontWeight: 'bold', textTransform: 'uppercase', width: '100%', wordBreak: 'break-word', padding: '4px' }} >Date</p>
                        <p style={{ border: '1px solid black', fontWeight: 'bold', textTransform: 'uppercase', width: '100%', wordBreak: 'break-word', padding: '4px' }} >Bill No.</p>
                        <p style={{ border: '1px solid black', fontWeight: 'bold', textTransform: 'uppercase', width: '100%', wordBreak: 'break-word', padding: '4px' }} >Party Name</p>
                        <p style={{ border: '1px solid black', fontWeight: 'bold', textTransform: 'uppercase', width: '100%', wordBreak: 'break-word', padding: '4px' }} >Party GST</p>
                        <p style={{ border: '1px solid black', fontWeight: 'bold', textTransform: 'uppercase', width: '100%', wordBreak: 'break-word', padding: '4px' }} >Taxable Amt.</p>
                        <p style={{ border: '1px solid black', fontWeight: 'bold', textTransform: 'uppercase', width: '100%', wordBreak: 'break-word', padding: '4px' }} >CGST</p>
                        <p style={{ border: '1px solid black', fontWeight: 'bold', textTransform: 'uppercase', width: '100%', wordBreak: 'break-word', padding: '4px' }} >SGST</p>
                        <p style={{ border: '1px solid black', fontWeight: 'bold', textTransform: 'uppercase', width: '100%', wordBreak: 'break-word', padding: '4px' }} >IGST</p>
                        <p style={{ border: '1px solid black', fontWeight: 'bold', textTransform: 'uppercase', width: '100%', wordBreak: 'break-word', padding: '4px' }} >Total Amount</p>
                    </div>

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


                        return (
                            <div key={i} className="w-full grid text-[14px]" style={{ gridTemplateColumns: '3% 7% 10% 22% 12% 10% 8% 8% 8% 12%' }} >
                                <p style={{ border: '1px solid black', width: '100%', wordBreak: 'break-word', padding: '4px' }} >{i + 1}</p>
                                <p style={{ border: '1px solid black', width: '100%', wordBreak: 'break-word', padding: '4px' }} >{Bdate.toLocaleDateString()}</p>
                                <p style={{ border: '1px solid black', width: '100%', wordBreak: 'break-word', padding: '4px' }} >{i + 1}</p>
                                <p style={{ border: '1px solid black', width: '100%', wordBreak: 'break-word', padding: '4px' }} >{sale.buyer.split("-").join(" ").charAt(0).toUpperCase() + sale.buyer.split("-").join(" ").slice(1)}</p>
                                <p style={{ border: '1px solid black', width: '100%', wordBreak: 'break-word', padding: '4px' }} >{sale.ClientGST}</p>
                                <p style={{ border: '1px solid black', width: '100%', wordBreak: 'break-word', padding: '4px' }} >{subT}</p>
                                <p style={{ border: '1px solid black', width: '100%', wordBreak: 'break-word', padding: '4px' }} >{cgst.toFixed(2)}</p>
                                <p style={{ border: '1px solid black', width: '100%', wordBreak: 'break-word', padding: '4px' }} >{sgst.toFixed(2)}</p>
                                <p style={{ border: '1px solid black', width: '100%', wordBreak: 'break-word', padding: '4px' }} >{igst.toFixed(2)}</p>
                                <p style={{ border: '1px solid black', width: '100%', wordBreak: 'break-word', padding: '4px' }} >{cgst + sgst + igst + subT + Number(sale.shippingAmt)}</p>
                            </div>
                        )

                    })}
                </div>

            </div>
        </div>
    )
}

export default SalesTaxReturn