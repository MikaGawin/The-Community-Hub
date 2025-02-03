import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import "./App.css";
import Events from "./Components/Events/Events";
import HeaderBar from "./Components/Header/HeaderBar";
import UserLogin from "./Components/UserDetails/UserLogin";
import UserCreateForm from "./Components/UserDetails/userCreateForm";
import { AuthProvider } from "./Components/Authentication/AuthContext";
import { ProtectedRoute } from "./Components/Authentication/ProtectedRoute";
import Account from "./Components/User/Account";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <>
      <AuthProvider>
        <header>
          <HeaderBar />
        </header>
        <ToastContainer />
        <main>
          <Routes>
            <Route path="/" element={<Events />} />
            <Route path="/search/:search" element={<Events />} />
            <Route path="/login" element={<UserLogin />} />
            <Route path="/signup" element={<UserCreateForm />} />
            <Route
              path="/account/:userid"
              element={
                <ProtectedRoute>
                  <Account isLoggedIn={isLoggedIn} />
                </ProtectedRoute>
              }
            />
          </Routes>
        </main>
      </AuthProvider>
    </>
  );
}

export default App;
