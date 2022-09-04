import React from 'react';
import { useParams, useLocation } from 'react-router-dom';


function ClientAnalytics() {

    const route = useParams();
    const location = useLocation();
    const Rdata = location.state.receipt;
    const Sdata = location.state.sale;
    const ReturnData = location.state.returnRecord;


    const userSaleData = Sdata.filter((val) => {
        if (val.user === route.user && new Date(val.billDate).getFullYear() === new Date().getFullYear()) {
            return val;
        }
    });

    const userReturnData = ReturnData.filter((val) => {
        if (val.user === route.user && val.note === 'credit') {
            return val
        }
    });

    const customerRecieptData = Rdata.filter((val) => {
        if (val.user === route.user && new Date(val.recieptDate).getFullYear() === new Date().getFullYear()) {
            return val
        }
    })

    let allClientList = userSaleData.map((val) => { return val.buyer });

    allClientList = allClientList.filter((v, i, a) => a.indexOf(v) === i);

    let saleByClient = allClientList.map((val) => {
        let data = userSaleData.filter((bill) => {
            return bill.buyer === val
        })
        return data;
    })



    return (
        <div className='bg-[#D3CEDF] h-[100vh] w-[100%] items-center flex justify-center'>
            <div className='w-[95%] h-[90%] bg-white'>
                <div className='w-[100%] h-[90vh] overflow-y-auto items-center text-center flex justify-center sm:hidden'>
                    <h1>Mobile screen is not supported</h1>
                </div>
                <div className='w-[100%] h-[90vh] overflow-y-auto text-center hidden sm:flex sm:flex-col' style={{ border: '1px solid black' }} >
                    <h1 className='text-[20px] font-medium' style={{ borderBottom: '1px solid black' }} >Clients list</h1>
                    {
                        saleByClient.map((val, index) => {
                            let product = [];
                            let allDatesOfReturn = [];

                            let recieptByClient = customerRecieptData.filter((itm) => {
                                return itm.recievedFrom === val[0].buyer
                            })

                            let returnByClient = userReturnData.filter((obj) => {
                                if (val[0].buyer === obj.partyName) {
                                    return obj
                                }
                            });
                            returnByClient.map((itm) => {
                                itm.dateOfReturnArray.map((obj) => {
                                    allDatesOfReturn.push(obj)
                                })
                            })
                            allDatesOfReturn = allDatesOfReturn.sort((a, b) => {
                                return new Date(a) - new Date(b)
                            })

                            return (
                                <div className='flex flex-col' key={index}>
                                    <p>{val[0].buyer}</p>
                                    <div className="grid grid-cols-3 text-center gap-x-4">
                                        <div>
                                            <div className='text-[16px] font-medium flex w-[90%] mx-auto justify-between'>
                                                <p>bill Date</p>
                                                <p>sale</p>
                                            </div>
                                            {
                                                val.map((pro, ind) => {
                                                    product.push(...pro.product)

                                                    let sale = product.map((mon) => {
                                                        return Number(mon.amt) * Number(mon.qtn) + Number(mon.cgst) + Number(mon.sgst) + Number(mon.igst)
                                                    })
                                                    sale = sale.reduce((acc, curr) => { return acc + curr }, 0)

                                                    return (
                                                        <div key={ind} className='flex w-[90%] mx-auto justify-between'>
                                                            <p>{pro.billDate}</p>
                                                            <p>{sale}</p>
                                                        </div>
                                                    )
                                                })
                                            }
                                        </div>
                                        <div>
                                            <div className='text-[16px] font-medium flex w-[90%] mx-auto justify-between'>
                                                <p>Reciept Date</p>
                                                <p>Reciept</p>
                                            </div>
                                            {
                                                recieptByClient.map((pro, ind) => {

                                                    return (
                                                        <div key={ind} className='flex w-[90%] mx-auto justify-between'>
                                                            <p>{pro.recieptDate}</p>
                                                            <p>{pro.Amount}</p>
                                                        </div>
                                                    )
                                                })
                                            }
                                        </div>
                                        <div>
                                            <div className='text-[16px] font-medium flex w-[90%] mx-auto justify-between'>
                                                <p>Return Date</p>
                                                <p>Number of Return</p>
                                            </div>
                                            {<div className='flex w-[90%] mx-auto justify-between'>
                                                <p>{new Date(allDatesOfReturn[0]).toLocaleDateString() + " - " + new Date(allDatesOfReturn[allDatesOfReturn.length - 1]).toLocaleDateString()}</p>
                                                <p>{allDatesOfReturn.length}</p>
                                            </div>}
                                        </div>
                                    </div>
                                </div>
                            )

                        })
                    }
                </div>
            </div>
        </div>
    )
}

export default ClientAnalytics