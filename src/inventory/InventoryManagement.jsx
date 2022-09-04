import React, { useState, useEffect } from "react";
import AddNewProduct from "./AddNewProduct"
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useParams } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useMemo } from "react";
import { Link } from "react-router-dom";


function InventoryManagement() {
  const route = useParams();
  const location = useLocation();
  const Pdata = location.state.purchase;
  const Idata = location.state.inventory;
  const Sdata = location.state.sale;
  const Rdata = location.state.returnRecord;
  const user = location.state.user;
  const rule = location.state.rule;
  //founding supplier list
  const foundSupplier = Pdata.filter((val) => val.user === route.user);
  let supplierArray = [];

  //pushing all supplier's value
  foundSupplier.map((val) => {
    supplierArray.push(val.Supplier);
  });

  //founding user inventory
  const foundUserStocks = Idata.filter((val) => val.user === route.user);


  //founding sales and purchase return record
  const foundReturnRecord = Rdata.filter((val) => val.user === route.user);



  //founding sales and pushing sold product
  const foundUserSales = Sdata.filter((val) => val.user === route.user)
  const [SoldProductArray, setSoldProductArray] = useState([]);
  const products = useMemo(() => [], []);
  foundUserSales.map((val) => {
    products.push(...val.product);
  })
  useEffect(() => {
    setSoldProductArray(products);
  }, [products])


  //checking that user is creating new product entry of new entry with existing product
  const [addNewProduct, setaddNewProduct] = useState(false);
  //search value
  const [searchVal, setsearchVal] = useState("");

  const successNotify = () =>
    toast.success("Successfully Added", { autoClose: 1000 });
  const errorNotify = () => toast.error("Error occurred", { autoClose: 1000 });
  const infoNotify = () => toast.info("Please fill all detials first");




  return (
    <div className="bg-[#D3CEDF] h-[100vh] grid">
      <ToastContainer />
      <div
        style={{
          transform: addNewProduct ? "translateY(0%)" : "translateY(-110%)",
          transition: "0.5s ease-in",
          gridArea: "1/1",
        }}
      >
        <AddNewProduct
          supplierArray={supplierArray}
          setaddNewProduct={setaddNewProduct}
          successNotify={successNotify}
          errorNotify={errorNotify}
          infoNotify={infoNotify}
          foundUserStocks={foundUserStocks}
        />
      </div>

      <div
        style={{ gridArea: "1/1", overflowY: 'auto' }}
        className="h-[90vh] p-4 sm:w-[90%] w-[300px] bg-white mx-auto self-center"
      >
        {/* filters */}
        <div className="w-full grid grid-row-3 gap-y-2 gap-x-2 items-center justify-center sm:grid sm:grid-cols-[20%_60%_20%]">
          <pre>
            <Link to={`/user/${route.user}/returnentry`} state={{ Pdata: Pdata, Sdata: Sdata, Rdata: Rdata, Idata: Idata }} className="cursor-pointer text-center font-bold bg-blue-500 text-white rounded-[10px] p-2" >Add Return Entry</Link>
          </pre>
          <input
            onChange={(e) => setsearchVal(e.target.value)}
            placeholder="Search by Product Name"
            className="p-2 w-full rounded-[12px] w-full pl-8 bg-slate-200"
          />
          <pre>
            <button onClick={() => setaddNewProduct(true)} className="cursor-pointer ml-4 text-center font-bold bg-blue-500 text-white rounded-[10px] p-2" >Add New Product</button>
          </pre>
        </div>
        {/* main page */}

        <div className="w-full mt-8 font-bold uppercase text-center bg-[#92A9BD] grid text-[12px] md:text-[16px]" style={{ gridTemplateColumns: '10% 20% 25% 15% 15% 15%' }} >
          <p className="border-2 border-black sm:border-0" style={{ fontWeight: 'bold', textTransform: 'uppercase', width: '100%', wordBreak: 'break-word', padding: '4px' }} >SNO.</p>
          <p className="border-2 border-black sm:border-0" style={{ fontWeight: 'bold', textTransform: 'uppercase', width: '100%', wordBreak: 'break-word', padding: '4px' }} >Product Name</p>
          <p className="border-2 border-black sm:border-0" style={{ fontWeight: 'bold', textTransform: 'uppercase', width: '100%', wordBreak: 'break-word', padding: '4px' }} >Closing Stock On Current Date</p>
          <p className="border-2 border-black sm:border-0" style={{ fontWeight: 'bold', textTransform: 'uppercase', width: '100%', wordBreak: 'break-word', padding: '4px' }} >Purchase History</p>
          <p className="border-2 border-black sm:border-0" style={{ fontWeight: 'bold', textTransform: 'uppercase', width: '100%', wordBreak: 'break-word', padding: '4px' }} >Return History</p>
          <p className="border-2 border-black sm:border-0" style={{ fontWeight: 'bold', textTransform: 'uppercase', width: '100%', wordBreak: 'break-word', padding: '4px' }} >Sales History</p>
        </div>
        {
          foundUserStocks.filter((stock) => {
            if (searchVal === "") {
              return stock;
            } else if (stock.productName.split("-").join(" ").toLowerCase().includes(searchVal.toLowerCase())) {
              return stock
            }
          }).map((val, i) => {
            //purchased stock quantity addition
            const purchasedStockQtn = val.totalQtnPurchasedArray.reduce((acc, curr) => acc + curr);
            
            

            //calculating sold product quantity
            const soldStocks = SoldProductArray.filter((item) => {
              if (item.descrip === val.productName) {
                return item;
              }
            });

            
            const sumOfSoldStock = soldStocks.length !== 0 && soldStocks.reduce((acc, curr) => { return acc + Number(curr.qtn) }, 0);
            

            //sales return
            const salesReturn = foundReturnRecord.filter((item) => {
              if (item.productName === val.productName && item.note === "credit") {
                return item
              }
            })

            //purchase return
            const purchaseReturn = foundReturnRecord.filter((item) => {
              if (item.productName === val.productName && item.note === "debit") {
                return item
              }
            })

            const sumSalesReturn = salesReturn.length !== 0 ? salesReturn[0].totalQtnReturnArray.reduce((acc, curr) => { return acc + curr }, 0) : 0;
            const sumPurchaseReturn = purchaseReturn.length !== 0 ? purchaseReturn[0].totalQtnReturnArray.reduce((acc, curr) => { return acc + curr }, 0) : 0;

            return (
              <div key={i} className="w-full font-medium uppercase text-center bg-slate-200 grid text-[12px] md:text-[16px]" style={{ gridTemplateColumns: '10% 20% 25% 15% 15% 15%' }} >
                <p className="border-2 border-black sm:border-0" style={{ textTransform: 'uppercase', width: '100%', wordBreak: 'break-word', padding: '4px' }} >{i + 1}</p>
                <p className="border-2 border-black sm:border-0" style={{ textTransform: 'uppercase', width: '100%', wordBreak: 'break-word', padding: '4px' }} >{val.productName.split("-").join(" ")}</p>
                <p className="border-2 border-black sm:border-0" style={{ textTransform: 'uppercase', width: '100%', wordBreak: 'break-word', padding: '4px' }} >{(purchasedStockQtn - (sumOfSoldStock)/2 - sumPurchaseReturn + sumSalesReturn) + " " + val.qtnType}</p>
                <Link to={`/user/${route.user + val.id}/inventorypurchase`} state={{ Idata: Idata }} ><p className="border-2 border-black sm:border-0 text-blue-800 underline cursor-pointer" style={{ textTransform: 'uppercase', width: '100%', wordBreak: 'break-word', padding: '4px' }} >Purchase History</p></Link>
                <Link to={`/user/${route.user + "$" + val.productName}/inventoryreturn`} state={{ Rdata: Rdata }} ><p className="border-2 border-black sm:border-0 text-blue-800 underline cursor-pointer" style={{ textTransform: 'uppercase', width: '100%', wordBreak: 'break-word', padding: '4px' }} >Return History</p></Link>
                <Link to={`/user/${route.user + "$" + val.productName}/inventorysale`} state={{ Sdata: Sdata, user: user, rule: rule }} ><p className="border-2 border-black sm:border-0 text-blue-800 underline cursor-pointer" style={{ textTransform: 'uppercase', width: '100%', wordBreak: 'break-word', padding: '4px' }} >Sales History</p></Link>
              </div>
            )

          })}
      </div>
    </div>
  );
}

export default InventoryManagement;


