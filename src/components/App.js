import Login from "./Login";
import Header from "./Header";
import Register from "./Register";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import ForgotPassword from "./ForgotPassword";

function App() {
  return (
      <BrowserRouter>
          <Routes>
              <Route path="/" element={<Login />} />
              <Route path="forgot-password" element={<ForgotPassword />} />
              <Route path="create-account" element={<Register />} />
          </Routes>
      </BrowserRouter>
  );
}

export default App;
