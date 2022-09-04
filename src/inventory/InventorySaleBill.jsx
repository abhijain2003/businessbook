import React from 'react';
import { useParams, useLocation } from 'react-router-dom';
import SalesInvoiceTemplate from '../Sales/SalesInvoiceTemplate';


function InventorySaleBill() {

  const route = useParams();
  const location = useLocation();
  const Sdata = location.state.Sdata;
  const Ruledata = location.state.rule;

  const foundUserSales = Sdata.filter((val) => val.id === route.user.slice(route.user.length - 20));



  const found = location.state.user;
  var foundRule = Ruledata.filter(
    (com) => com.user === found[0].companyName
  );

  let sumDue = foundUserSales[0].product.map((val) => {
    let taxableAmt = Number(val.amt) * Number(val.qtn);

    return taxableAmt + Number(val.cgst) + Number(val.sgst) + Number(val.igst);
  })

  sumDue = sumDue.reduce((acc, curr) => { return acc + curr }, 0)

  let sumTax = foundUserSales[0].product.map((val) => {

    return Number(val.cgst) + Number(val.sgst) + Number(val.igst);
  })

  sumTax = sumTax.reduce((acc, curr) => { return acc + curr }, 0)

  let sumTaxable = foundUserSales[0].product.map((val) => {

    return Number(val.amt) * Number(val.qtn);
  })

  sumTaxable = sumTaxable.reduce((acc, curr) => { return acc + curr }, 0)


  return (
    <div className='bg-[#D3CEDF] h-[100vh] w-full flex items-center' >
      <div className='w-[90%] h-[90vh] overflow-y-auto mx-auto bg-white text-center'>
        <SalesInvoiceTemplate
          clientName={foundUserSales[0].buyer}
          clientAddress={foundUserSales[0].clientAddress}
          clientGST={foundUserSales[0].clientGST}
          times={foundUserSales[0].product}
          ship={foundUserSales[0].shippingAmt}
          billType={foundUserSales[0].billType}
          ownerName={route.user.slice(0, route.user.length - 20)}
          foundUser={found}
          foundRule={foundRule}
          sumDue={sumDue}
          sumTax={sumTax}
          sumTaxable={sumTaxable}
          foundSale={foundUserSales}
        />
      </div>
    </div>
  )
}

export default InventorySaleBill