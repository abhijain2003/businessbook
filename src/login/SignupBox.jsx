
import React, { useState } from 'react'; // import React and useState
import { getUser, addUser } from "../utils/User"; //import user data;
import bcrypt from 'bcryptjs'  // import bcrypt for hashing and salting
import { setCookie } from "cookies-next"; // import setcookie for login persistance
import { ToastContainer, toast } from 'react-toastify'; // import taost notifier for message alert
import 'react-toastify/dist/ReactToastify.css'; // css for message alerts
import {
    ref,
    uploadBytes,
    getDownloadURL
} from "firebase/storage"; //importing functions for saving image to firebase
import getIFSC from 'node-ifsc' //importing for fetching bank details
import { storage } from "../utils/firebase"; //import storage for saving images to firebase
import { addRule } from "../utils/User"; // import addRule method for sales rule adding
import { addLedgerAccount } from "../utils/Ledger"
import { useNavigate } from 'react-router-dom';


//fetching user data
export async function getServerSideProps(context) {
    let data = await getUser().then((res) => { return res });
    return {
        props: { data }, // will be passed to the page component as props
    }
}

function SignupBox({ data }) {

    const navigate = useNavigate();

    //setting all values of user data
    const [Name, setName] = useState("");
    const [Address, setAddress] = useState("");
    const [number, setnumber] = useState(0);
    const [Mail, setMail] = useState("");
    const [LoginId, setLoginId] = useState("");
    const [GST, setGST] = useState("");
    const [bankName, setbankName] = useState("");
    const [accountNumber, setaccountNumber] = useState(0);
    const [branchName, setbranchName] = useState("");
    const [ifscCode, setifscCode] = useState("");
    const [showBankDetail, setshowBankDetail] = useState(false);

    //logic for image saving to firebase
    const imageListRef = ref(storage, "userImages/");
    const [image, setimage] = useState(null);
    const [imageArr, setimageArr] = useState([]);

    //notifications
    const successNotify = () => toast.success("Successfully added", { autoClose: 1000 }); //success notification
    const errorNotify = () => toast.error("Error occurred", { autoClose: 1000 }); //error notification
    const infoNotify = ({ text }) => toast.info(text, { autoClose: 1000 }); // information notification for login id not available

    function uploadImage1(e) {
        e.preventDefault();
        if (image === null) return;
        const imageRef = ref(storage, `userImages/${image.name}`);
        uploadBytes(imageRef, image).then((snapshot) => {
            successNotify();
            getDownloadURL(snapshot.ref).then((url) => {
                setimageArr((prev) => [...prev, url]);
            });
        }).catch((err) => {
            errorNotify();
            console.log(err);
        })
    }

    //handle sign-up
    async function handleUserSign() {
        var found = data.filter((com) => com.companyNumber === Number(number));
        var foundId = data.filter((com) => com.loginId === LoginId);

        if (found.length === 0 && foundId.length !== 0) {
            infoNotify("loginId is not available")
        }

        let date = new Date();

        if (Name !== '' && Address !== "" && Mail !== "" && number !== 0 && GST !== "" && accountNumber !== 0 && LoginId !== "") {
            if (LoginId.length < 6) {
                infoNotify("Your password must be at least 6 characters");
                window.location.reload()
            } else if (LoginId.search(/[a-z]/) < 0) {
                
                window.location.reload()
            } else if (LoginId.search(/[A-Z]/) < 0) {
                
                window.location.reload()
            } else if (LoginId.search(/[0-9]/) < 0) {
                infoNotify("Your password must contain at least one digit.");
                window.location.reload()
            } else if (found.length === 0 && foundId.length === 0) {
                bcrypt.genSalt(process.env.APP_SALT, function (err, salt) {
                    bcrypt.hash(LoginId, salt, function (err, hash) {
                        addUser(
                            Name,
                            Number(number),
                            Mail,
                            Address,
                            hash,
                            GST,
                            bankName.toLowerCase().replace(/ /g, "-"),
                            accountNumber,
                            branchName,
                            ifscCode,
                            imageArr[imageArr.length - 1],
                            date.toLocaleDateString()
                        );

                        addLedgerAccount(bankName, 'asset', Name)
                    })

                    if (err) {
                        errorNotify();
                    }
                });
                setCookie("User", Name, { maxAge: 3600 * 60 * 24 * 10000 });
                setCookie("isLoggedIn", true, { maxAge: 3600 * 60 * 24 * 10000 });
                
            } else {
                infoNotify("company is already registered. please login");
            }
        } else {
            infoNotify("please fill all fields")
        }
    }

    // storing sales rules in useState
    const [rule1, setrule1] = useState("");
    const [rule2, setrule2] = useState("");
    const [rule3, setrule3] = useState("");
    const [rule4, setrule4] = useState("");
    const [rule5, setrule5] = useState("");


    // adding rules to database
    async function handleRuleAdd(e) {
        e.preventDefault();
        await addRule(rule1, rule2, rule3, rule4, rule5, Name).then((res) => { successNotify() }).catch((err) => { errorNotify(); console.log(err) });
    }



    //setting bank details from ifsc code 
    async function handleBank(e) {
        e.preventDefault();
        if (ifscCode === "") {
            infoNotify("Please enter ifsc code.");
        } else {
            try {
                const data = await getIFSC(ifscCode);
                setbankName(data.BANK);
                setbranchName(data.BRANCH);
                setshowBankDetail(true);
            } catch {
                infoNotify("please write correct ifsc code")
            }
        }
    }

    return (
        <div><ToastContainer />
        <form className="px-8 pt-6 pb-8 mb-4 rounded">
            <div className="mb-4 md:flex md:justify-evenly">
                <div className="mb-4 md:mr-2 md:mb-0">
                    <label
                        className="block mb-2 text-sm font-bold text-gray-700"
                        htmlFor="companyName"
                    >
                        Company Name
                    </label>
                    <input
                        className="w-full px-3 py-2 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                        id="companyName"
                        type="text"
                        onChange={(e) =>
                            setName(e.target.value.toLowerCase().replace(/ /g, "-"))
                        }
                        placeholder="Company Name"
                    />
                </div>
                <div className="md:ml-2">
                    <label
                        className="block; mb-2 text-sm font-bold text-gray-700"
                        htmlFor="companyNumber"
                    >
                        Company Contact Number
                    </label>
                    <input
                        className="w-full px-3 py-2 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                        id="companyNumber"
                        type="text"
                        onChange={(e) => setnumber(e.target.value)}
                        placeholder="company Number"
                    />
                </div>
                <div className="">
                    <label className="w-32 text-gray-800 block font-bold text-sm uppercase tracking-wide">
                        Upload Company Logo
                    </label>
                    <div className="flex">
                        <div className="w-32 h-20 mb-1 border rounded-md border-dotted bg-gray-100 items-center flex justify-center">
                            <label htmlFor="imageUpload" className="btn btn-large">
                               ---
                            </label>
                            <input
                                name="photo"
                                id="imageUpload"
                                type="file"
                                className="overflow-hidden"
                                style={{ display: "none" }}
                                onChange={(e) => setimage(e.target.files[0])}
                            />
                        </div>
                        <div className="flex flex-col justify-between ml-4">
                            <button
                                className="w-32 h-10 mb-1 border rounded-md bg-gray-200"
                                onClick={(e) => uploadImage1(e)}
                            >
                                Add
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="mb-4 md:flex md:justify-evenly" >
                <div className="mb-4">
                    <label
                        className="block mb-2 text-sm font-bold text-gray-700"
                        htmlFor="email"
                    >
                        Company Email
                    </label>
                    <input
                        className="w-full px-3 py-2 mb-3 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                        id="email"
                        type="email"
                        onChange={(e) => setMail(e.target.value)}
                        placeholder="Email"
                    />
                </div>
                <div className="mb-4 md:mr-2 md:mb-0">
                    <label
                        className="block mb-2 text-sm font-bold text-gray-700"
                        htmlFor="companyAddress"
                    >
                        Company Address
                    </label>
                    <input
                        className="w-full px-3 py-2 mb-3 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                        id="companyAddress"
                        type="text"
                        onChange={(e) =>
                            setAddress(e.target.value.toLowerCase().replace(/ /g, "-"))
                        }
                        placeholder="company Address"
                    />
                </div>
                <div className="md:ml-2">
                    <label
                        className="block mb-2 text-sm font-bold text-gray-700"
                        htmlFor="loginId"
                    >
                        Login Id
                        <ul className='text-[12px]' style={{ listStyleType: 'revert' }} >
                            <li>id should have atleast 6 characters</li>
                            <li>id should have minimum 1 capital letter</li>
                            <li>id should have minimum 1 number.</li>
                            <li>id should have minimum 1 special characters</li>
                        </ul>
                    </label>
                    <input
                        className="w-full px-3 py-2 mb-3 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                        id="loginId"
                        type="password"
                        onChange={(e) => setLoginId(e.target.value)}
                        placeholder="Login Id"
                    />
                </div>
            </div>

            <div className="mb-4 md:flex md:justify-evenly">
                <div className="md:ml-2">
                    <label
                        className="block mb-2 text-sm font-bold text-gray-700"
                        htmlFor="gst"
                    >
                        GST NUMBER
                    </label>
                    <input
                        className="w-full px-3 py-2 mb-3 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                        id="gst"
                        type="text"
                        onChange={(e) => setGST(e.target.value)}
                        placeholder="GST number"
                    />
                </div>
                <div className="md:ml-2">
                    <label
                        className="block mb-2 text-sm font-bold text-gray-700"
                        htmlFor="IFSC"
                    >
                        IFSC Code
                    </label>
                    <input
                        className="w-full px-3 py-2 mb-3 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                        id="IFSC"
                        type="text"
                        onChange={(e) => setifscCode(e.target.value)}
                        placeholder="IFSC Code"
                    />
                </div>
                <div className="md:ml-2">
                    <label
                        className="block mb-2 text-sm font-bold text-gray-700"
                        htmlFor="IFSC"
                    >
                        Fetch Bank Details
                    </label>
                    <button onClick={(e) => handleBank(e)} className="w-full p-2 font-bold text-white bg-blue-500 rounded-full hover:bg-blue-700 focus:outline-none focus:shadow-outline" id="IFSC" >Click</button>
                </div>
            </div>
            {showBankDetail ? <div className="mb-4 md:flex md:justify-between">
                <div className="md:ml-2">
                    <label
                        className="block mb-2 text-sm font-medium text-gray-700"
                    >
                        bank Name
                    </label>
                    <p
                        className="block mb-2 text-sm font-bold text-gray-700"
                    >
                        {bankName}
                    </p>
                </div>
                <div className="md:ml-2">
                    <label
                        className="block mb-2 text-sm font-medium text-gray-700"
                        htmlFor="IFSC"
                    >
                        branch Name
                    </label>
                    <p
                        className="block mb-2 text-sm font-bold text-gray-700"
                    >
                        {branchName}
                    </p>
                </div>
                <div className="md:ml-2">
                    <label
                        className="block mb-2 text-sm font-bold text-gray-700"
                        htmlFor="IFSC"
                    >
                        Account Number
                    </label>
                    <input
                        className="w-full px-3 py-2 mb-3 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                        id="Account Number"
                        type="text"
                        onChange={(e) => setaccountNumber(e.target.value)}
                        placeholder="Account Number"
                    />
                </div>
            </div> : null}
            {/* invoice rule book */}
            <div className="text-center" >
                <h1 className="mx-auto font-medium" >Invoice Bill Terms and Conditions</h1>
                <div className="mb-4 md:flex md:justify-evenly">
                    <div className="md:ml-2">
                        <label
                            className="block mb-2 text-sm font-bold text-gray-700"
                            htmlFor="rule1"
                        >
                            Rule 1
                        </label>
                        <input
                            className="w-full px-3 py-2 mb-3 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                            id="rule1"
                            type="text"
                            onChange={(e) => setrule1(e.target.value)}
                            placeholder="Rule 1"
                        />
                    </div>
                    <div className="md:ml-2">
                        <label
                            className="block mb-2 text-sm font-bold text-gray-700"
                            htmlFor="rule2"
                        >
                            Rule 2
                        </label>
                        <input
                            className="w-full px-3 py-2 mb-3 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                            id="rule2"
                            type="text"
                            onChange={(e) => setrule2(e.target.value)}
                            placeholder="Rule 2"
                        />
                    </div>
                    <div className="md:ml-2">
                        <label
                            className="block mb-2 text-sm font-bold text-gray-700"
                            htmlFor="Rule 3"
                        >
                            Rule 3
                        </label>
                        <input
                            className="w-full px-3 py-2 mb-3 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                            id="rule3"
                            type="text"
                            onChange={(e) => setrule3(e.target.value)}
                            placeholder="Rule 3"
                        />
                    </div>
                </div>
                <div className="mb-4 md:flex md:justify-evenly">
                    <div className="md:ml-2">
                        <label
                            className="block mb-2 text-sm font-bold text-gray-700"
                            htmlFor="rule1"
                        >
                            Rule 4
                        </label>
                        <input
                            className="w-full px-3 py-2 mb-3 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                            id="rule4"
                            type="text"
                            onChange={(e) => setrule4(e.target.value)}
                            placeholder="Rule 4"
                        />
                    </div>
                    <div className="md:ml-2">
                        <label
                            className="block mb-2 text-sm font-bold text-gray-700"
                            htmlFor="rule5"
                        >
                            Rule 5
                        </label>
                        <input
                            className="w-full px-3 py-2 mb-3 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                            id="rule5"
                            type="text"
                            onChange={(e) => setrule5(e.target.value)}
                            placeholder="Rule 5"
                        />
                    </div>
                    <div className="md:ml-2">
                        <label
                            className="block mb-2 text-sm font-bold text-gray-700"
                            htmlFor="IFSC"
                        >
                            Submit Invoice T&C
                        </label>
                        <button onClick={handleRuleAdd} className="w-full p-2 font-bold text-white bg-blue-500 rounded-full hover:bg-blue-700 focus:outline-none focus:shadow-outline" id="IFSC" >Submit Rule</button>
                    </div>
                </div>
            </div>


            <div className="mb-6 text-center">
                <button
                    className="w-full px-4 py-2 font-bold text-white bg-blue-500 rounded-full hover:bg-blue-700 focus:outline-none focus:shadow-outline"
                    type="button"
                    onClick={handleUserSign}
                >
                    Register Account
                </button>
            </div>
        </form></div>
    )
}

export default SignupBox