import React, { useEffect, useState } from "react";
import icon from "../assets/icon.png";
import open from "../assets/open.png";
import { Link } from "react-router-dom";
import close from "../assets/close.png";

function Navbar() {
  const [navbar, setnavbar] = useState(false);

  useEffect(() => {
    document.getElementById("hamburger").onclick = function toggleMenu() {
      setnavbar((prev) => !prev);
      const navToggle = document.getElementsByClassName("toggle");
      for (let i = 0; i < navToggle.length; i++) {
        navToggle.item(i).classList.toggle("hidden");
      }
    };
  }, []);

  return (
    <nav className="flex flex-wrap items-center p-4 justify-between items-center bg-blue-200  relative sm:top-[0px]">
      <div className="flex items-center">
        <img
          src={icon}
          style={{ width: "75px", height: "75px", position: 'relative' }}
        />
        <h1 className="font-bold text-[20px]">Business Book</h1>
      </div>
      <div className="flex md:hidden">
        <button id="hamburger">
          {navbar ? (
            <img
              className="mx-auto"
              src={close}
              style={{ width: "40px", height: "40px", }}
            />
          ) : (
            <img
              src={open}
              className="mx-auto"
              style={{ width: "40px", height: "40px", }}
            />
          )}
        </button>
      </div>
      <div className="toggle hidden items-center w-full md:w-auto md:flex text-right text-bold  md:mt-0 border-t-2 border-blue-900 md:border-none">
        <a
          href="#Home"
          className="block no-underline md:inline-block text-blue-900 hover:text-blue-500 px-3 py-3 border-b-2 border-blue-900 md:border-none"
        >
          Home
        </a>
        <a
          href="#Product"
          className="block no-underline xmd:inline-block text-blue-900 hover:text-blue-500 px-3 py-3 border-b-2 border-blue-900 md:border-none"
        >
          Products
        </a>
        <a
          href="#About"
          className="block no-underline md:inline-block text-blue-900 hover:text-blue-500 px-3 py-3 border-b-2 border-blue-900 md:border-none"
        >
          About us
        </a>
        <a
          href="#Pricing"
          className="block no-underline md:inline-block text-blue-900 hover:text-blue-500 px-3 py-3 border-b-2 border-blue-900 md:border-none"
        >
          Pricing
        </a>
      </div>
      <div className="toggle hidden w-full md:w-auto md:flex text-right text-bold pr-4 md:mt-0 border-t-2 border-blue-900 md:border-none items-center">
        <Link to="/login" className="mr-4 no-underline text-[#16213E]">Sign in</Link>
        <Link to="/signup"  className="toggle no-underline hidden md:flex w-full md:w-auto px-4 py-2 text-right bg-blue-900 hover:bg-blue-500 text-white md:rounded">Create Account</Link>
      </div>
    </nav>
  );
}

export default Navbar;
