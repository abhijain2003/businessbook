import React from 'react';
import { useParams, useLocation } from 'react-router-dom';




function InventoryPurchase() {

  const route = useParams();
  const location  = useLocation();
  const Idata = location.state.Idata;

  //founding user inventory
  const foundUserStocks = Idata.filter((val) => val.user === route.user.slice(0, route.user.length - 20));

  const uniqueId = route.user.slice(route.user.length - 20);

  const currentStockDetail = foundUserStocks.filter((val) => val.id === uniqueId);
 

  return (
    <div className='bg-[#D3CEDF] h-[100vh] flex items-center' >
      <div className='w-[90%] h-[90vh] overflow-y-auto mx-auto bg-white text-center'>
       <h1 className='font-bold text-[20px] uppercase' >Purchase Detail of Product {currentStockDetail[0].productName.split('-').join(" ")}</h1>
        <div className='grid mx-auto bg-[#92A9BD] mt-4' style={{ gridTemplateColumns: '8% 20% 12% 20% 20% 20%' }} >
          <p className="border-2 border-black sm:border-0" style={{ fontWeight: 'bold', textTransform: 'uppercase', width: '100%', wordBreak: 'break-word', padding: '4px' }}>SNO.</p>
          <p className="border-2 border-black sm:border-0" style={{ fontWeight: 'bold', textTransform: 'uppercase', width: '100%', wordBreak: 'break-word', padding: '4px' }}>Purchased From</p>
          <p className="border-2 border-black sm:border-0" style={{ fontWeight: 'bold', textTransform: 'uppercase', width: '100%', wordBreak: 'break-word', padding: '4px' }}>Date of Purchase</p>
          <p className="border-2 border-black sm:border-0" style={{ fontWeight: 'bold', textTransform: 'uppercase', width: '100%', wordBreak: 'break-word', padding: '4px' }}>Purchase Qtn.</p>
          <p className="border-2 border-black sm:border-0" style={{ fontWeight: 'bold', textTransform: 'uppercase', width: '100%', wordBreak: 'break-word', padding: '4px' }}>Purchase Amt.</p>
          <p className="border-2 border-black sm:border-0" style={{ fontWeight: 'bold', textTransform: 'uppercase', width: '100%', wordBreak: 'break-word', padding: '4px' }}>Total Amt. Invested</p>
        </div>

        {
          currentStockDetail[0].dateOfPurchaseArray.map((stock, i) => (
              <div key={i} className="grid mx-auto bg-slate-200" style={{ gridTemplateColumns: '8% 20% 12% 20% 20% 20%' }} >
                <p>{i + 1}</p>
                <p>{currentStockDetail[0].purchasedFromArray[i].split('-').join(" ")}</p>
                <p>{stock}</p>
                <p>{currentStockDetail[0].totalQtnPurchasedArray[i]}</p>
                <p>{currentStockDetail[0].perUnitPriceArray[i]}</p>
                <p>{(currentStockDetail[0].perUnitPriceArray[i]) * (currentStockDetail[0].totalQtnPurchasedArray[i])}</p>
              </div>
            ))
        }

      </div>
    </div>
  )
}

export default InventoryPurchase