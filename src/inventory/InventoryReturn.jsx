import React from 'react';
import { useParams, useLocation } from 'react-router-dom';


function InventoryReturn() {

    const router = useParams();
    const location = useLocation();
    const Rdata = location.state.Rdata;

    const currentUserName = router.user.split("$")[0];

    const currentProductName = router.user.split("$")[1];


    //founding sales and purchase return record
    const foundReturnRecord = Rdata.filter((val) => {
        if (val.user === currentUserName && val.productName === currentProductName) {
            return val
        }
    });

    const purchaseReturn = foundReturnRecord.filter((val) => val.note === "debit");
    const salesReturn = foundReturnRecord.filter((val) => val.note === "credit");


    return (
        <div className="h-[100vh] bg-[#D3CEDF] flex items-center justify-center">
            <div className='h-[90vh] overflow-y-auto w-[90%] mx-auto text-center bg-white p-4 grid grid-cols-2'>
                <div style={{borderRight: '1px solid black'}}>
                    <h1 className='font-medium capitalize bg-slate-500 text-white p-2'>Debit</h1>
                    {
                        purchaseReturn.length !== 0 ? purchaseReturn[0].dateOfReturnArray.map((entry, i) => (
                            <div className='w-full grid grid-cols-3 bg-slate-300' key={i}>
                                <p>{entry}</p>
                                <p>{purchaseReturn[0].totalQtnReturnArray[i]}</p>
                                <p>{purchaseReturn[0].partyName}</p>
                            </div>
                        )) : (
                            <h1>No Entry Available</h1>
                        )
                    }
                </div>
                <div>
                    <h1 className='font-medium capitalize bg-slate-500 text-white p-2'>Credit</h1>
                    {
                        salesReturn.length !== 0 ? salesReturn[0].dateOfReturnArray.map((entry, i) => (
                            <div className='w-full grid grid-cols-3 bg-slate-300' key={i}>
                                <p>{entry}</p>
                                <p>{salesReturn[0].totalQtnReturnArray[i]}</p>
                                <p>{salesReturn[0].partyName}</p>
                            </div>
                        )) : (
                            <h1>No Entry Available</h1>
                        )
                    }
                </div>
            </div>
        </div>
    )
}

export default InventoryReturn