import React from "react";
import { useState, useEffect } from "react";
import bcrypt from "bcryptjs";
import { auth } from "../utils/firebase"
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { getUser, updateUser } from "../utils/User";
import logo from "../assets/logo.png";

export async function getServerSideProps(context) {
  let data = await getUser().then((res) => { return res });
  return {
    props: { data }, // will be passed to the page component as props
  }
}



function Forgot({ data }) {


  const [value, setvalue] = useState(""); //number
  const [flag, setflag] = useState(false); //show otp
  const [otp, setotp] = useState(""); //otp
  const [confirmObj, setconfirmObj] = useState(""); //response object
  const [error, seterror] = useState(""); //error in sending otp
  const [verified, setverified] = useState(false); //verified user for otp success
  const [comName, setcomName] = useState(""); //company name
  const [newid, setnewid] = useState("");//new login id
  const [foundUser, setfoundUser] = useState([]); //finding user based on company name
  const [errorUser, seterrorUser] = useState(""); //error message when no user is found
  const [successUser, setsuccessUser] = useState(""); //success message when user is found
  const [showmessgae, setshowmessgae] = useState(false); //show message of error or success


  function setUpRecaptcha(number) {
    const recaptchaVerifier = new RecaptchaVerifier('recaptcha-container', {}, auth);
    recaptchaVerifier.render();

    return signInWithPhoneNumber(auth, number, recaptchaVerifier);
  }

  async function getOTP(e) {
    e.preventDefault();

    if (value === "" || value === undefined) {
      console.log("Error");
    } else {
      await setUpRecaptcha('+91' + value).then((res) => {
        setflag(true);
        setconfirmObj(res);
        console.log(res);
      }).catch((err) => {
        seterror(err.message);
      })
    }
  }

  async function verfiyOTP(e) {
    e.preventDefault();
    if (otp === "" || otp === null) {
      return
    } else {
      await confirmObj.confirm(otp).then((res) => {
        setverified(true);
        console.log(res);
      }).catch((err) => {
        seterror(err.message);
      })
    }
  }


  function verifyCompany(e) {
    e.preventDefault();
    let found = data.filter((com) => com.companyName === comName.toLowerCase().replace(/ /g, "-"));
    if (found.length !== 0) {
      setfoundUser(found);
      setshowmessgae(true);
      setsuccessUser("User is found, set your new id");
    } else {
      seterrorUser("No user is found. please write a valid company name.");
    }
  }

  const handleUpdate = async (e) => {
    e.preventDefault();
    bcrypt.genSalt(10, function (err, salt) {
      bcrypt.hash(newid, salt, function (err, hash) {
        updateUser(foundUser[0].id, hash);
      });
    });
    // router.push("/")
  }

  return (
    <div className="w-full h-full flex justify-center" >
      <div className="w-[300px] h-[400px] mx-auto border-2 border-black" >
        {verified ? <form
          className="px-8 pt-6 pb-8 h-full grid grid-rows-2 w-full mb-4 bg-white rounded"
        >
          <div className="flex flex-col justify-evenly" >
            <img src={logo} className='mx-auto' style={{ width: '200px', height: '200px', }} />
            <div className="w-full px-3 py-2 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline" style={{ border: showmessgae ? '1px solid green' : '1px solid red' }} >{showmessgae ? successUser : errorUser}</div>
            <input
              placeholder="Enter Your Company Name"
              value={comName}
              className="w-full px-3 py-2 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
              onChange={(e) => setcomName(e.target.value)}
            />
            <button onClick={verifyCompany} className="w-full px-4 py-2 font-bold text-white bg-orange-500 rounded-full hover:bg-orange-700 focus:outline-none focus:shadow-outline">
              verify yourself
            </button>
          </div>
          <div className="flex flex-col justify-evenly" >
            <input
              placeholder="Enter New LoginId"
              value={newid}
              type="password"
              className="w-full px-3 py-2 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
              onChange={(e) => setnewid(e.target.value)}
            />
            <button onClick={handleUpdate} className="w-full px-4 py-2 font-bold text-white bg-orange-500 rounded-full hover:bg-orange-700 focus:outline-none focus:shadow-outline">
              Update
            </button>
          </div>
        </form> : flag ? <form onSubmit={verfiyOTP}
          className="px-8 pt-6 pb-8 h-full flex flex-col justify-evenly w-full mb-4 bg-white rounded"
        >
          <img src={logo} className='mx-auto' style={{ width: '200px', height: '200px', }} />
          <div className="w-full px-3 py-2 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline" >{error}</div>
          <input
            placeholder="Enter OTP"
            value={otp}
            className="w-full px-3 py-2 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
            onChange={(e) => setotp(e.target.value)}
          />
          <button className="w-full px-4 py-2 font-bold text-white bg-orange-500 rounded-full hover:bg-orange-700 focus:outline-none focus:shadow-outline">
            Verify OTP
          </button>
        </form> : <form onSubmit={getOTP}
          className="px-8 pt-6 pb-8 h-full flex flex-col justify-evenly w-full mb-4 bg-white rounded"
        >
          <img src={logo} className='mx-auto' style={{ width: '200px', height: '200px', }} />
          <div id="recaptcha-container"></div>
          <input
            placeholder="+91 Enter Phone Number"
            value={value}
            className="w-full px-3 py-2 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
            onChange={(e) => setvalue(e.target.value)}
          />
          <button className="w-full px-4 py-2 font-bold text-white bg-orange-500 rounded-full hover:bg-orange-700 focus:outline-none focus:shadow-outline">
            Request OTP
          </button>
        </form>}
      </div>
    </div>
  );
}

export default Forgot;
