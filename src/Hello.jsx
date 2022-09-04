import React from "react";
import { getUser } from './utils/User';
import Slider from "react-slick";
import { useNavigate } from "react-router-dom";
import mainLogo from './assets/main_logo.png';
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";


function Hello() {

  const param = useParams()

  const [data, setdata] = useState([]);
  useEffect(() => {
    async function userData() {
      await getUser().then((res) => {
        setdata(res);
      });
    }

    userData()
  }, [])


  const navigate = useNavigate();

  const found = data.filter((com) => com.companyName === param.user);

  const items = [
    { id: 1, name: "Sales Invoice", folder: "Sales" },
    { id: 2, name: "Sales Book", folder: "Sales" },
    { id: 3, name: "Sales Tax Return", folder: "Sales" },
    { id: 4, name: "Purchase Invoice", folder: "Purchase" },
    { id: 5, name: "Purchase Book", folder: "Purchase" },
    { id: 6, name: "Purchase Tax Return", folder: "Purchase" },
    { id: 7, name: "Reciept Invoice", folder: "Reciept" },
    { id: 8, name: "Reciept Book", folder: "Reciept" },
    { id: 9, name: "Ledger", folder: "Ledger" },
    { id: 10, name: "Ledger Record", folder: "Ledger" },
    { id: 11, name: "Trial Balance", folder: "Ledger" },
    { id: 12, name: "Final Account", folder: "FinalAccounts" },
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
                    alert("heloo")
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

