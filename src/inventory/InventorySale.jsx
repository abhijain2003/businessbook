import React, { useState, useEffect } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { useMemo } from 'react';



function InventorySale() {

  const router = useParams();
  const location = useLocation();
  const Sdata = location.state.Sdata;
  const user = location.state.user;
  const rule = location.state.rule;

  const currentUserName = router.user.split("$")[0];

  const currentProductName = router.user.split("$")[1];

  //founding sales and pushing sold product
  const foundUserSales = Sdata.filter((val) => val.user === currentUserName);
  const [SoldProductArray, setSoldProductArray] = useState([]);
  const products = useMemo(() => [], []);
  foundUserSales.map((val) => {
    products.push(...val.product);
  })


  useEffect(() => {
    setSoldProductArray(products.filter((item) => {
      if (item.descrip === currentProductName) {
        return item;
      }
    }));
  }, [products, currentProductName]);



  let billForDate = foundUserSales.map((val) => {
    const result = val.product.filter((item) => {
      if (item.descrip === currentProductName) {
        return item;
      }
    })

    return result.length !== 0 && val
  })

  billForDate = billForDate.filter((val) => val !== false);


  return (
    <div className='bg-[#D3CEDF] h-[100vh] flex items-center' >
      <div className='w-[90%] h-[90vh] overflow-y-auto mx-auto bg-white text-center'>
        <h1 className='font-bold text-[20px] uppercase' >Sale Record {currentProductName}</h1>
        <div className='grid mx-auto bg-[#92A9BD] mt-4' style={{ gridTemplateColumns: '8% 12% 20% 15% 15% 20% 10%' }} >
          <p className="border-2 border-black sm:border-0" style={{ fontWeight: 'bold', textTransform: 'uppercase', width: '100%', wordBreak: 'break-word', padding: '4px' }}>SNO.</p>
          <p className="border-2 border-black sm:border-0" style={{ fontWeight: 'bold', textTransform: 'uppercase', width: '100%', wordBreak: 'break-word', padding: '4px' }}>Date</p>
          <p className="border-2 border-black sm:border-0" style={{ fontWeight: 'bold', textTransform: 'uppercase', width: '100%', wordBreak: 'break-word', padding: '4px' }}>Sold To</p>
          <p className="border-2 border-black sm:border-0" style={{ fontWeight: 'bold', textTransform: 'uppercase', width: '100%', wordBreak: 'break-word', padding: '4px' }}>Sold Qtn.</p>
          <p className="border-2 border-black sm:border-0" style={{ fontWeight: 'bold', textTransform: 'uppercase', width: '100%', wordBreak: 'break-word', padding: '4px' }}>Sold Amt.</p>
          <p className="border-2 border-black sm:border-0" style={{ fontWeight: 'bold', textTransform: 'uppercase', width: '100%', wordBreak: 'break-word', padding: '4px' }}>Total Amt. Earned</p>
          <p className="border-2 border-black sm:border-0" style={{ fontWeight: 'bold', textTransform: 'uppercase', width: '100%', wordBreak: 'break-word', padding: '4px' }}>View Bill</p>
        </div>

        {
          SoldProductArray.length !== 0 && SoldProductArray.map((product, i) => (
            <div key={i} className='grid mx-auto bg-slate-200 text-[12px] sm:text-[14px] font-medium' style={{ gridTemplateColumns: '8% 12% 20% 15% 15% 20% 10%' }} >
              <p className="border-2 border-black sm:border-0" style={{ textTransform: 'uppercase', width: '100%', wordBreak: 'break-word', padding: '4px' }}>{i + 1}</p>
              <p className="border-2 border-black sm:border-0" style={{ textTransform: 'uppercase', width: '100%', wordBreak: 'break-word', padding: '4px' }}>{billForDate[i].billDate}</p>
              <p className="border-2 border-black sm:border-0" style={{ textTransform: 'uppercase', width: '100%', wordBreak: 'break-word', padding: '4px' }}>{billForDate[i].buyer}</p>
              <p className="border-2 border-black sm:border-0" style={{ textTransform: 'uppercase', width: '100%', wordBreak: 'break-word', padding: '4px' }}>{product.qtn}</p>
              <p className="border-2 border-black sm:border-0" style={{ textTransform: 'uppercase', width: '100%', wordBreak: 'break-word', padding: '4px' }}>{product.amt}</p>
              <p className="border-2 border-black sm:border-0" style={{ textTransform: 'uppercase', width: '100%', wordBreak: 'break-word', padding: '4px' }}>{Number(product.qtn) * Number(product.amt)}</p>
              <Link to={`/user/${currentUserName + billForDate[i].id}/inventorysalebill`} state={{ user: user, Sdata: Sdata, rule: rule }} ><p className="cursor-pointer border-2 border-black sm:border-0 text-blue-600 underline" style={{ textTransform: 'uppercase', width: '100%', wordBreak: 'break-word', padding: '4px' }}>View Bill</p></Link>
            </div>
          ))
        }

      </div>
    </div>
  )
}

export default InventorySale