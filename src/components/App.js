import Login from "./Login";
import Register from "./Register";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import ForgotPassword from "./ForgotPassword";
import Navbar from "./Navbar";
import Homepage from "./HomePage";
import ChatbotPage from "./ChatbotPage";

function App() {
  return (
      <BrowserRouter>
          <Navbar />
          <Routes>
              <Route path="/" element={<Homepage />} />
              <Route path="sign-in" element={<Login />} />
              <Route path="forgot-password" element={<ForgotPassword />} />
              <Route path="create-account" element={<Register />} />
              <Route path="chat-page" element={<ChatbotPage />} />
          </Routes>
      </BrowserRouter>
  );
}

export default App;
