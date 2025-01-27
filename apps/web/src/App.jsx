import { useState } from 'react'
import { Routes, Route } from "react-router-dom";
import './App.css'
import Home from "./Components/Home"

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  return (
    <>
      <main>
        <Routes >
          <Route path="/" element={<Home isLoggedIn={isLoggedIn}/>}/>
        </Routes>
      </main>
    </>
  );
}

export default App;
