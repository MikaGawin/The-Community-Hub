import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import "./App.css";
import Home from "./Components/Home";
import HeaderBar from "./Components/Header/HeaderBar";
import UserLogin from "./Components/UserDetails/UserLogin";
import UserCreateForm from "./Components/UserDetails/userCreateForm";
import { AuthProvider } from "./Components/Authentication/AuthContext";
import { ProtectedRoute } from "./Components/Authentication/ProtectedRoute";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <>
      <header>
        <HeaderBar />
      </header>
      <main>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Home isLoggedIn={isLoggedIn} />} />
            <Route path="/login" element={<UserLogin />} />
            <Route path="/signup" element={<UserCreateForm />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <UserCreateForm />
                </ProtectedRoute>
              }
            />
          </Routes>
        </AuthProvider>
      </main>
    </>
  );
}

export default App;
