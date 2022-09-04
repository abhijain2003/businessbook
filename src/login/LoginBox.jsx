
import React, { useState } from 'react'; // import React and useState
import { getUser } from "../utils/User"; //import user data;
import bcrypt from "bcryptjs" // import bcrypt for hashing and salting
import { ToastContainer, toast } from 'react-toastify'; // import taost notifier for message alert
import 'react-toastify/dist/ReactToastify.css'; // css for message alerts
import logo from "../assets/logo.png";
import { useNavigate } from 'react-router-dom';




function LoginBox() {

    const navigate = useNavigate();

    // login id that user enter
    const [loginId, setloginId] = useState("");
    //calling useRouter method


    const successNotify = () => toast.success("Successfully login", { autoClose: 1000 }); //success notification
    const errorNotify = () => toast.error("Error occurred", { autoClose: 1000 }); //error notification
    const infoNotify = () => toast.info("invalid login id.", { autoClose: 1000 }); // information notification

    // function for handling user login 
    async function handleUserLogin() {
        //fetching user data
        let data = await getUser().then((res) => {
            return res;
        });
        // creating an empty array for storing the found user data
        let foundUserId = [];
        data.map((com) => {
            bcrypt.compare(loginId, com.loginId, function (err, res) {
                // if user is found using loginid
                if (res === true) {
                    foundUserId.push(com);
                }
                //if user is not found
                if (foundUserId.length !== 0) {
                    successNotify();
                    window.localStorage.setItem("User", com.companyName)
                    window.localStorage.setItem("isLoggedIn", true)
                    // router.push(`/user/${com.companyName}`); //redirecting to main page
                    navigate(`/user/${com.companyName}`)
                } else {
                    infoNotify();
                }

                //handling error
                if (err) {
                    errorNotify()
                }
            });
        });
    }

    return (
        <div className="text-center sm:w-[60%] mx-auto">
            <ToastContainer />
            <div className="flex" >
                <img src={logo} className='mx-auto' style={{ width: '200px', height: '200px', }} />
            </div>
            <div className="md:ml-2 ">
                <label
                    className="block mb-2 text-sm font-bold text-gray-700"
                    htmlFor="loginId"
                >
                    Enter Your Login Id
                </label>
                <div className="justify-evenly h-[40px] flex flex-col mx-auto w-full my-8 items-center" >
                    <input
                        className="w-[40%] h-full px-3 py-2 mb-3 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                        id="loginId"
                        onChange={(e) => setloginId(e.target.value)}
                        type="password"
                        placeholder="Login Id"
                    />
                    <button
                        className="w-[40%] h-full p-2 font-bold text-white bg-orange-500 rounded-full hover:bg-orange-700 focus:outline-none focus:shadow-outline"
                        type="button"
                        onClick={handleUserLogin}
                    >
                        login
                    </button>
                </div>
                <div className="mt-4" >
                    <label
                        className="block mb-2 text-sm font-bold text-gray-700"
                        htmlFor="loginId"
                    >
                        forgot Your Login Id
                    </label>
                    <p onClick={() => { navigate("/forgot") }}
                        className="text-orange-500 underline cursor-pointer">Do not Worry reset it</p>
                </div>
            </div>
            {/* signup content */}
        </div>
    )
}

export default LoginBox