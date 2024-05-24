import { signInWithEmailAndPassword } from "firebase/auth";
import React, { useState, useEffect } from "react";
import { auth } from "./firebase";
import { Link, useNavigate } from "react-router-dom";
import loginVideo from "./assets/login.mp4";
import "./login.css";
import alanBtn from "@alan-ai/alan-sdk-web";
import { Button } from "@mui/material";
const LogIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const logIn = (e) => {
    e.preventDefault();
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        console.log(userCredential);
        navigate("/Erza");
        window.location.reload();
      })
      .catch((error) => {
        console.log(error);
        alert(error);
      });
  };
  function home() {
    navigate("/");
  }
  useEffect(() => {
    alanBtn({
      key: "83eb635ee400cf5d444e5c61aef43c8f2e956eca572e1d8b807a3e2338fdd0dc/stage",
      onCommand: (commandData) => {
        if (commandData.command === "signup") {
          navigate("/SignUp");
          window.location.reload();
        }
        if (commandData.command === "home") {
          navigate("/");
          window.location.reload();
        }
        if (commandData.command === "email") {
          setEmail(`${commandData.value}@gmail.com`);
        }
        if (commandData.command === "password") {
          setPassword(`${commandData.value}`);
          logIn({ preventDefault: () => {} });
        }
      },
    });
  }, []);
  return (
    <div className="hero1">
      <video autoPlay loop muted id="video1">
        <source src={loginVideo} type="video/mp4" />
      </video>
      <div className="overlay1"></div>
      <form onSubmit={logIn} className="form">
        <div
          className="gradient1"
          style={{
            backgroundImage: "linear-gradient(50deg, #ff0000,transparent)",
          }}
        ></div>
        <div className="title1">Log In to your Account</div>

        <div className="email1">
          <label htmlFor="email">Email</label>
          <input
            className="inputbox"
            id="email"
            name="email"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          ></input>
        </div>
        <div className="password1">
          <label htmlFor="password">Password</label>
          <input
            className="inputbox"
            type="password"
            id="password"
            name="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          ></input>
        </div>
        <div>
          <Button
            color="error"
            size="lg"
            variant="contained"
            type="submit"
            sx={{ mr: 3 }}
          >
            Log In
          </Button>
          <Button color="error" size="lg" variant="contained" onClick={home}>
            Home
          </Button>
        </div>
      </form>
    </div>
  );
};

export default LogIn;
