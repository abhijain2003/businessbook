import { Route, Routes } from "react-router-dom";
import LoginBox from "./login/LoginBox";
import SignupBox from "./login/SignupBox";
import Forgot from "./login/Forgot";
import Home from "./landingPage/Home";
import Hello from "./Hello";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import Profile from './Profile/Profile';
import SalesBook from './Sales/SalesBook';
import SalesTaxReturn from './Sales/SalesTaxReturn';
import SalesInvoice from "./Sales/SalesInvoice";
import PurchaseInvoice from "./Purchase/PurchaseInvoice";
import PurchaseBook from './Purchase/PurchaseBook';
import PurchaseTaxReturn from './Purchase/PurchaseTaxReturn';


function App() {

  const navigate = useNavigate();

  useEffect(() => {
    let user = window.localStorage.getItem("User")
    let isLoggedIn = window.localStorage.getItem('isLoggedIn')


    if (user !== null && isLoggedIn !== null) {
      navigate(`/user/${user}`)
    } else {
      navigate("/")
    }
  }, [])


  return (
    <div className="App">
      <Routes>
        <Route element={<PurchaseTaxReturn />} path="/user/:user/purchasetaxreturn" />
        <Route element={<PurchaseInvoice />} path="/user/:user/purchaseinvoice" />
        <Route element={<PurchaseBook />} path="/user/:user/purchasebook" />
        <Route element={<SalesTaxReturn />} path="/user/:user/salestaxreturn" />
        <Route element={<SalesInvoice />} path="/user/:user/salesinvoice" />
        <Route element={<SalesBook />} path="/user/:user/salesbook" />
        <Route element={<Hello />} path='/user/:user' />
        <Route element={<Profile />} path='/user/:user/profile' />
        <Route element={<Home />} path='/' />
        <Route element={<LoginBox />} path="/login" />
        <Route element={<Forgot />} path="/forgot" />
        <Route element={<SignupBox />} path="/signup" />
        <Route element={<Hello />} path="/hello" />
      </Routes>
    </div>
  );
}

export default App;
