import { Route, Routes } from "react-router-dom";
import LoginBox from "./login/LoginBox";
import SignupBox from "./login/SignupBox";
import Forgot from "./login/Forgot";
import Sign from "./login/Sign";
import Hello from "./Hello";



function App() {
  return (
    <div className="App">
      <Routes>
        <Route element={<Sign />} path="/" />
        <Route element={<LoginBox />} path="/login" />
        <Route element={<Forgot />} path="/forgot" />
        <Route element={<SignupBox />} path="/signup" />
        <Route element={<Hello />} path="/hello" />
      </Routes>
    </div>
  );
}

export default App;
