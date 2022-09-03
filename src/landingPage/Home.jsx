import React from "react";
import Navbar from "./Navbar";
import Product from "./Product";
import BuildBy from "./BuildBy";
import  business from "../assets/business.png";
import img from "../assets/img.png";
import price from "../assets/price.png";
import { Link } from "react-router-dom";

function Home() {

  return (
    <div>
      <Navbar />
      <div id="Home" className="w-[100%] sm:grid sm:grid-cols-2">
        <div className="text-start sm:pl-[100px] pl-[50px]">
          <h1 className="text-[50px] text-[#FF9551] font-bold capitalize">
            Create{" "}
            <span className="lowercase font-bold text-[#100720]">your</span>
          </h1>
          <h1 className="text-[50px] text-[#100720] font-bold lowercase">
            success
          </h1>
          <img style={{ width: '300px', height: '100px' , marginTop: '20px' }} src={business} />
          <p className="sm:w-[500px] text-[14px] font-semibold text-[#16213E]">
            Whether you want to generate sales bills, managing purchase, receipt
            and analysing your growth report. manage all business accounting at one place.
          </p>
          <Link to="Signup" className="uppercase bg-[#FF7F3F] text-white px-8 py-4 relative sm:top-[50px] font-semibold">{"get started ->"}</Link>
        </div>
        <div className="items-right w-[100%] flex justify-center">
          <img src={img} style={{ width: '350px', height: '450px' , marginTop: '20px' }} />
        </div>
      </div>
      <Product />
      <div id="Pricing" className='sm:flex sm:justify-evenly w-[80%] mx-auto items-center mt-24'>
        <img src={price} style={{ width: '310px', height: '300px' , marginTop: '20px' }} />
        <div className="items-center">
          <h1 className="text-[#16213E] font-semibold text-[40px] ">Features</h1>
          <ul>
            <li className="font-medium text-[16px] mt-2"><span className="font-bold text-[#0F3460] text-[20px]">{"> "}</span>From Sales to Purchase</li>
            <li className="font-medium text-[16px] mt-2"><span className="font-bold text-[#0F3460] text-[20px]">{"> "}</span>From ledger to balance Sheeets</li>
            <li className="font-medium text-[16px] mt-2"><span className="font-bold text-[#0F3460] text-[20px]">{"> "}</span>From client Analysis to Growth Charts</li>
            <li className="font-medium text-[16px] mt-2"><span className="font-bold text-[#0F3460] text-[20px]">{"> "}</span>Including Inventory Management</li>
          </ul>
          <h1 className="text-[#16213E] text-center font-semibold text-[25px] my-4" >Start with 0$/month</h1>
          <Link to="Signup" className="uppercase bg-[#7FBCD2] rounded-[12px] text-white px-8 py-4 mt-4 font-semibold">Create Account</Link>
        </div>
      </div>
      <div className="w-full h-full p-4 mt-12 bg-[#16213E] text-white">
        <BuildBy />
      </div>
    </div>
  );
}

export default Home;
