import * as React from "react";
import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import "react-toastify/dist/ReactToastify.css";

import "./App.css";

import { AuthProvider } from "./Components/Authentication/AuthContext";
import { ProtectedRoute } from "./Components/Authentication/ProtectedRoute";
import { StaffRoute } from "./Components/Authentication/StaffRoute";

import Events from "./Components/Events/Events";
import HeaderBar from "./Components/Header/HeaderBar";
import UserLogin from "./Components/UserDetails/UserLogin";
import UserCreateForm from "./Components/UserDetails/userCreateForm";
import AddStaff from "./Components/Staff/AddStaff";
import CreateEvent from "./Components/Staff/CreateEvent";
import Account from "./Components/User/Account";
import MyEvents from "./Components/MyEvents/MyEvents";
import NotFoundPage from "./Components/ErrorFeedback/NotFoundPage";

function App() {
  return (
    <>
      <AuthProvider>
        <header>
          <Box
            sx={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100%",
              zIndex: 1100,
              bgcolor: "white",
              boxShadow: 2,
            }}
          >
            <HeaderBar />
          </Box>
        </header>
        <ToastContainer />
        <React.Fragment>
          <CssBaseline />
          <Container
            maxWidth="xl"
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              height: "calc(100vh - 64px)",
              marginTop: "64px",
              minWidth: "250px",
            }}
          >
            <Box
              sx={{
                bgcolor: "#cfe8fc",
                width: "100%",
                display: "flex",
                flexDirection: "column",
                flexGrow: 1,
                padding: "25px",
              }}
            >
              <main style={{ flexGrow: 1 }}>
                <Routes>
                  <Route path="/" element={<Events />} />
                  <Route path="/search/:search" element={<Events />} />
                  <Route path="/login" element={<UserLogin />} />
                  <Route path="/signup" element={<UserCreateForm />} />
                  <Route
                    path="/account/:userid"
                    element={
                      <ProtectedRoute>
                        <Account />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/account/subscribed/:userid"
                    element={
                      <ProtectedRoute>
                        <MyEvents />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/staff/addStaff"
                    element={
                      <StaffRoute>
                        <AddStaff />
                      </StaffRoute>
                    }
                  />
                  <Route
                    path="/staff/createEvent"
                    element={
                      <StaffRoute>
                        <CreateEvent />
                      </StaffRoute>
                    }
                  />
                  <Route path="*" element={<NotFoundPage />} />
                </Routes>
              </main>
            </Box>
          </Container>
        </React.Fragment>
      </AuthProvider>
    </>
  );
}

export default App;
