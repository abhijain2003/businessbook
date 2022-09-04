import React from "react";
import { getUser, getRule } from './utils/User';
import { getSales } from "./utils/Sales";
import { getInventory } from './utils/Inventory';
import { getPur } from "./utils/Purchase";
import Slider from "react-slick";
import { useNavigate } from "react-router-dom";
import mainLogo from './assets/main_logo.png';
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getLedger, getLedgerEntry } from "./utils/Ledger";
import { getFinal } from './utils/Final';
import { getReciept } from "./utils/Reciept";


function Hello() {

  const param = useParams()

  const [data, setdata] = useState([]);
  const [rule, setrule] = useState([]);
  const [sale, setsale] = useState([]);
  const [purchase, setpurchase] = useState([]);
  const [inventory, setinventory] = useState([]);
  const [ledger, setledger] = useState([]);
  const [ledgerEntry, setledgerEntry] = useState([]);
  const [final, setfinal] = useState([]);
  const [receipt, setreceipt] = useState([]);
  useEffect(() => {
    async function userData() {
      await getUser().then((res) => {
        setdata(res);
      });
    }

    async function ruleData() {
      await getRule().then((res) => {
        setrule(res);
      });
    }

    async function saleData() {
      await getSales().then((res) => {
        setsale(res);
      });
    }

    async function stockData() {
      await getInventory().then((res) => {
        setinventory(res);
      });
    }

    async function purData() {
      await getPur().then((res) => {
        setpurchase(res)
      })
    }

    async function ledgerData() {
      await getLedger().then((res) => {
        setledger(res);
      });
    }

    async function ledgerEntryData() {
      await getLedgerEntry().then((res) => {
        setledgerEntry(res);
      });
    }

    async function finalData() {
      await getFinal().then((res) => {
        setfinal(res)
      })
    }

    async function receiptData() {
      await getReciept().then((res) => {
        setreceipt(res)
      })
    }


    userData()
    ruleData()
    saleData()
    stockData()
    purData()
    ledgerData()
    ledgerEntryData()
    finalData()
    receiptData()
  }, [])


  const navigate = useNavigate();

  const found = data.filter((com) => com.companyName === param.user);

  const items = [
    { id: 1, name: "Sales Invoice", routing: `/user/${param.user}/salesinvoice` },
    { id: 2, name: "Sales Book", routing: `/user/${param.user}/salesbook` },
    { id: 3, name: "Sales Tax Return", routing: `/user/${param.user}/salestaxreturn` },
    { id: 4, name: "Purchase Invoice", routing: `/user/${param.user}/purchaseinvoice` },
    { id: 5, name: "Purchase Book", routing: `/user/${param.user}/purchasebook` },
    { id: 6, name: "Purchase Tax Return", routing: `/user/${param.user}/purchasetaxreturn` },
    { id: 7, name: "Ledger", routing: `/user/${param.user}/ledger` },
    { id: 8, name: "Ledger Entries", routing: `/user/${param.user}/ledegerrecord` },
    { id: 9, name: "Trial Balance", routing: `/user/${param.user}/trialbalance` },
    { id: 10, name: "Reciept Invoice", routing: `/user/${param.user}/recieptinvoice` },
    { id: 11, name: "Reciept Book", routing: `/user/${param.user}/recieptbook` },
    { id: 12, name: "Final Account", routing: `/user/${param.user}/final` },
  ];

  const settings = {
    infinite: true,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 4,
    initialSlide: 0,
    responsive: [
      {
        breakpoint: 800,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 2,
          initialSlide: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };


  if (found.length !== 0) {
    return (
      <div className="bg-[#D3CEDF] h-[100vh] w-full flex items-center">
        <div className="w-[90%] h-[90vh] mx-auto bg-white">
          {/* navbar */}
          <div className="flex h-[10vh] justify-between px-2 items-center">
            <p></p>
            <img
              width={300}
              alt=""
              src={mainLogo}
              className="cursor-pointer"
              onClick={() => navigate(`/user/${param.user}`)}
            />
            <img
              className="rounded-[50%] w-[50px] h-[50px] cursor-pointer"
              alt=""
              onClick={() =>
                navigate(`/user/${param.user}/profile`)
              }
              src={found[0].businessLogo}
            />
          </div>
          {/* multiple menus */}
          <div
            className="h-[10vh]"
            style={{ boxShadow: "rgba(17, 12, 46, 0.15) 0px 48px 100px 0px" }}
          >
            <Slider {...settings}>
              {items.map((val, i) => (
                <pre
                  key={i}
                  onClick={() =>
                    navigate(val.routing, { state: { user: found, sale: sale, rule: rule, inventory: inventory, purchase: purchase, ledger: ledger, ledgerEntry: ledgerEntry, final: final, receipt: receipt } })
                  }
                  className="p-2 font-bold text-center cursor-pointer"
                >
                  {val.name}
                </pre>
              ))}
            </Slider>
          </div>
          {/* main page */}
          <div className="w-full h-[70vh] flex flex-col justify-evenly lg:grid lg:grid-cols-3 lg:gap-x-4 p-12">
            <div
              style={{ boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px", transition: '0.4s ease-in-out' }}
              className="h-[60%] hover:bg-blue-100 hover:scale-105 cursor-pointer w-[100%] flex flex-col items-center justify-center mt-4 self-center"
            >

              <h1 className="uppercase font-bold " >Client Analytics</h1>
            </div>

            <div
              style={{ boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px", transition: '0.4s ease-in-out' }}
              className="h-[60%] hover:bg-blue-100 hover:scale-105 cursor-pointer w-[100%] flex flex-col items-center justify-center mt-4 self-center"
            >

              <h1 className="uppercase font-bold " >Inventory Management</h1>
            </div>

            <div
              style={{ boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px", transition: '0.4s ease-in-out' }}
              className="h-[60%] hover:bg-blue-100 hover:scale-105 cursor-pointer w-[100%] flex flex-col items-center justify-center mt-4 self-center"
            >

              <h1 className="uppercase font-bold " >Growth Data</h1>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Hello;

