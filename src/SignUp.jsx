import { createUserWithEmailAndPassword } from "firebase/auth";
import React, { useState, useEffect } from "react";
import { auth } from "./firebase";
import "./signup.css";
import { Link, useNavigate } from "react-router-dom";
import signupVideo from "./assets/signup.mp4";

import { Button } from "@mui/material";
const SignUp = () => {
  useEffect(() => {
    alanBtn({
      key: "83eb635ee400cf5d444e5c61aef43c8f2e956eca572e1d8b807a3e2338fdd0dc/stage",
      onCommand: (commandData) => {
        if (commandData.command === "login") {
          navigate("/logIn");
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
          signUp({ preventDefault: () => {} });
        }
      },
    });
  }, []);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const signUp = (e) => {
    e.preventDefault();
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        console.log(userCredential);
        navigate("/LogIn");
      })
      .catch((error) => {
        console.log(error);
        alert(error);
      });
  };
  function home() {
    navigate("/");
  }

  return (
    <div className="hero2">
      <video autoPlay loop muted id="video2">
        <source src={signupVideo} type="video/mp4" />
      </video>
      <div className="overlay2"></div>
      <form onSubmit={signUp} className="form1">
        <div
          className="gradient2"
          style={{
            backgroundImage: "linear-gradient(50deg, #00ff00,transparent)",
          }}
        ></div>
        <div className="title2">Create Account</div>
        <div className="email2">
          <label htmlFor="email">Email</label>
          <input
            className="inputbox1"
            id="email"
            name="email"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          ></input>
        </div>
        <div className="password2">
          <label htmlFor="password">Password</label>
          <input
            className="inputbox1"
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
            color="success"
            size="lg"
            variant="contained"
            type="submit"
            sx={{ mr: 3 }}
            onClick={signUp}
          >
            Sign Up
          </Button>
          []
          <Button color="success" size="lg" variant="contained" onClick={home}>
            Home
          </Button>
        </div>
      </form>
    </div>
  );
};

export default SignUp;
