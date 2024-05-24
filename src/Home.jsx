import React from "react";
import video from "./assets/video.mp4";
import "./Home.css";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import alanBtn from "@alan-ai/alan-sdk-web";

import { useEffect, useState } from "react";
export default function Home() {
  const navigate = useNavigate();

  function logIn() {
    navigate("/LogIn");
  }
  function signUp() {
    navigate("/SignUp");
  }
  let greetingWasSaid = false;
  let alanBtnInstance = null;

  const initAlanBtn = () => {
    if (!alanBtnInstance) {
      alanBtnInstance = alanBtn({
        key: "83eb635ee400cf5d444e5c61aef43c8f2e956eca572e1d8b807a3e2338fdd0dc/stage",
        onButtonState: async function (status) {
          if (status === "ONLINE") {
            if (!greetingWasSaid) {
              await alanBtnInstance.activate();
              alanBtnInstance.playText(
                "Hello and welcome! I'm Erza, your AI assistant here to assist you. How can I make your day a little brighter?"
              );
              greetingWasSaid = true;
            }
          }
        },
        onCommand: (commandData) => {
          if (commandData.command === "login") {
            navigate("/LogIn");
            window.location.reload();
          }
          if (commandData.command === "signup") {
            navigate("/SignUp");
            window.location.reload();
          }
          if (commandData.command === "home") {
            navigate("/");
            window.location.reload();
          }
        },
        rootEl: document.getElementById("alan-btn"),
      });
    }
  };

  useEffect(() => {
    initAlanBtn();
  }, []);

  return (
    <div className="hero">
      <video autoPlay loop muted id="video">
        <source src={video} type="video/mp4" />
      </video>
      <div className="overlay"></div>

      <div className="card">
        <div
          className="gradient"
          style={{
            backgroundImage: "linear-gradient(0deg, #000000,transparent)",
          }}
        ></div>
        <div className="content">
          <div className="title">Erza</div>
          <p className="context">
            Meet Erza, the AI chatbot designed to be your virtual assistant and
            companion. She is equipped with advanced natural language processing
            capabilities, allowing her to understand and respond to user input
            in a human-like manner. With Erza, users can ask questions, get
            recommendations, and perform tasks with ease. Her friendly
            personality and helpful nature make her a reliable virtual assistant
            for any task.
          </p>
          <div className="btn">
            <Button
              variant="contained"
              size="lg"
              onClick={logIn}
              sx={{ mr: 4 }}
            >
              Log In
            </Button>
            <Button variant="contained" size="lg" onClick={signUp}>
              Sign Up
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
