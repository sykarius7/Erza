import React from "react";
import ReactDOM from "react-dom/client";
import { Route, Routes } from "react-router-dom";
import alanBtn from "@alan-ai/alan-sdk-web";
import Erza from "./Erza";
import SignUp from "./SignUp";
import LogIn from "./LogIn";

import Home from "./Home";
export default function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Erza" element={<Erza />} />
        <Route path="/LogIn" element={<LogIn />} />
        <Route
          path="/SignUp"
          element={
            <div>
              <SignUp />
            </div>
          }
        />
      </Routes>
    </>
  );
}
