import React, { useState, useEffect } from "react";
import {
    getUser,
    updateUserInfo,
    getRule,
    updateRule,
} from "../utils/User";
import bcrypt from 'bcryptjs';
import UpdateProfile from "./UpdateProfile";
import RuleBook from "./RuleBook";
import Button from "./Button";
import UserInfo from "./UserInfo";
import Slider from "react-slick";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";



function Profile() {
    const route = useParams();
    const navigate = useNavigate();
    const name = route.user;

    const [data, setdata] = useState([]);
    const [RuleData, setRuleData] = useState([]);
    useEffect(() => {
        async function userData() {
            await getUser().then((res) => {
                setdata(res);
            });
        }

        async function ruleData() {
            await getRule().then((res) => {
                setRuleData(res);
            });
        }

        userData()
        ruleData()
    }, [])


    var found = data.filter((com) => com.companyName === name);
    var foundRule = RuleData.filter((com) => com.user === name);


    const successNotify = (text) =>
        toast.success(text, { autoClose: 1000 });
    const errorNotify = (text) => toast.error(text, { autoClose: 1000 });
    const infoNotify = (text) => toast.info(text, { autoClose: 1000 });



    function handleSignOut() {
        window.localStorage.removeItem('User')
        window.localStorage.removeItem('isLoggedIn')
        navigate('/');
    }


    const [newComNumber, setnewComNumber] = useState("");
    const [newComMail, setnewComMail] = useState("");
    const [newComAddress, setnewComAddress] = useState("");



    async function handleNumber() {
        let typeId = prompt("Enter your login id");
        bcrypt.compare(typeId, found[0].loginId, function (err, res) {
            if (res === true) {
                updateUserInfo(found[0].id, { companyNumber: newComNumber })
                    .then((res) => {
                        successNotify("successfully updated")
                        console.log(res);
                    })
                    .catch((err) => {
                        errorNotify("error occured try later")
                        console.log(err);
                    });
            } else {
                infoNotify("LoginId is not found. Please write correct loginId");
            }
        });

    }

    async function handleMail() {
        let typeId = prompt("Enter your login id");
        bcrypt.compare(typeId, found[0].loginId, function (err, res) {
            if (res === true) {
                updateUserInfo(found[0].id, { companyMail: newComMail })
                    .then((res) => {
                        successNotify("successfully updated")
                        console.log(res);
                    })
                    .catch((err) => {
                        errorNotify("error occured try later")
                        console.log(err);
                    });
            } else {
                infoNotify("LoginId is not found. Please write correct loginId");
            }
        });
    }

    async function handleAddress() {
        let typeId = prompt("Enter your login id");
        bcrypt.compare(typeId, found[0].loginId, function (err, res) {
            if (res === true) {
                updateUserInfo(found[0].id, {
                    companyAddress: newComAddress.toLowerCase().replace(/ /g, "-"),
                })
                    .then((res) => {
                        successNotify("successfully updated")
                        console.log(res);
                    })
                    .catch((err) => {
                        errorNotify("error occured try later")
                        console.log(err);
                    });
            } else {
                infoNotify("LoginId is not found. Please write correct loginId");
            }
        });
    }

    // rule update
    async function handleRule1() {
        let typeId = prompt("Enter your login id");
        bcrypt.compare(typeId, found[0].loginId, function (err, res) {
            if (res === true) {
                let rule1 = prompt("Enter rule 1");
                if (rule1.length !== 0) {
                    updateRule(foundRule[0].id, { rule1: rule1 });
                    window.location.reload();
                }
            } else {
                infoNotify("LoginId is not found. Please write correct loginId");
            }
        });
    }

    async function handleRule2() {
        let typeId = prompt("Enter your login id");
        bcrypt.compare(typeId, found[0].loginId, function (err, res) {
            if (res === true) {
                let rule2 = prompt("Enter rule 2");
                if (rule2.length !== 0) {
                    updateRule(foundRule[0].id, { rule2: rule2 });
                    window.location.reload();
                }
            } else {
                infoNotify("LoginId is not found. Please write correct loginId");
            }
        });
    }

    async function handleRule3() {
        let typeId = prompt("Enter your login id");
        bcrypt.compare(typeId, found[0].loginId, function (err, res) {
            if (res === true) {
                let rule3 = prompt("Enter rule 3");
                if (rule3.length !== 0) {
                    updateRule(foundRule[0].id, { rule3: rule3 });
                    window.location.reload();
                }
            } else {
                infoNotify("LoginId is not found. Please write correct loginId");
            }
        });
    }

    async function handleRule4() {
        let typeId = prompt("Enter your login id");
        bcrypt.compare(typeId, found[0].loginId, function (err, res) {
            if (res === true) {
                let rule4 = prompt("Enter rule 4");
                if (rule4.length !== 0) {
                    updateRule(foundRule[0].id, { rule4: rule4 });
                    window.location.reload();
                }
            } else {
                infoNotify("LoginId is not found. Please write correct loginId");
            }
        });
    }

    async function handleRule5() {
        let typeId = prompt("Enter your login id");
        bcrypt.compare(typeId, found[0].loginId, function (err, res) {
            if (res === true) {
                let rule5 = prompt("Enter rule 5");
                if (rule5.length !== 0) {
                    updateRule(foundRule[0].id, { rule5: rule5 });
                    window.location.reload();
                }
            } else {
                infoNotify("LoginId is not found. Please write correct loginId");
            }
        });
    }

    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1
    }


    if (found.length !== 0 && foundRule.length !== 0) {
        return (
            <div className="bg-[#D3CEDF] h-[100vh] w-full flex items-center">
                <ToastContainer />
                <div className="w-[90%] h-[90%] m-auto bg-white flex flex-col">
                    {/* logo */}
                    <div className="flex justify-between px-2 items-center">
                        <Button
                            handleSignOut={handleSignOut}
                        />
                    </div>
                    <div>
                        <Slider {...settings} >
                            <div className="flex flex-col">
                                <UserInfo found={found} />
                            </div>
                            <div>
                                <UpdateProfile
                                    setnewComAddress={setnewComAddress}
                                    setnewComMail={setnewComMail}
                                    setnewComNumber={setnewComNumber}
                                    handleAddress={handleAddress}
                                    handleMail={handleMail}
                                    handleNumber={handleNumber}
                                />
                            </div>
                            <div >
                                <RuleBook
                                    foundRule={foundRule}
                                    handleRule1={handleRule1}
                                    handleRule2={handleRule2}
                                    handleRule3={handleRule3}
                                    handleRule4={handleRule4}
                                    handleRule5={handleRule5}
                                />
                            </div>
                        </Slider>
                    </div>
                </div>
            </div>
        );
    }

}

export default Profile;


