import { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import "./Erza.css";
import "regenerator-runtime/runtime";
import { faMicrophone } from "@fortawesome/free-solid-svg-icons";
import { faPowerOff } from "@fortawesome/free-solid-svg-icons";
import { faStop } from "@fortawesome/free-solid-svg-icons";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { AppBar, Button } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPause } from "@fortawesome/free-solid-svg-icons";
import { faReact } from "@fortawesome/free-brands-svg-icons";
import { faMusic } from "@fortawesome/free-solid-svg-icons";
import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import {
  MainContainer,
  ChatContainer,
  MessageList,
  Message,
  TypingIndicator,
  Avatar,
} from "@chatscope/chat-ui-kit-react";
import { Howl } from "howler";
import song from "./assets/song.mp3";
import { useNavigate } from "react-router-dom";
import { auth } from "./firebase";
import { signOut } from "firebase/auth";
import AuthDetails from "./AuthDetails";
import error from "./assets/error.mp4";
//global variables

const aiName = "Erza";
const API_KEY = "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";

const systemMessage = {
  role: "system",
  content:
    " Your are a personal assitant named Erza, Explain things like you're talking to a college student. you are developed by Ahobilesha",
};

//start of component
function Erza() {
  //alan ai
  useEffect(() => {
    alanBtn({
      key: "83eb635ee400cf5d444e5c61aef43c8f2e956eca572e1d8b807a3e2338fdd0dc/stage",
      onCommand: (commandData) => {
        if (commandData.command === "close") {
          const logoutBtn = document.getElementById("logout");
          logoutBtn.click();
          // window.location.reload();
        }
        if (commandData.command === "play music") {
          play();
        }
        if (commandData.command === "stop music") {
          const btn = document.getElementById("stop");
          btn.click();
        }
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
  //enter key
  const handleKeyDown = (e) => {
    if (e && e.key === "Enter" && !e.shiftKey) {
      const sendBtn = document.getElementById("send");
      sendBtn.click();
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  //used for routing
  const navigate = useNavigate();

  //state to store whether music is on or off
  const [isPlaying, setIsPlaying] = useState(false);

  //speech to text functionality
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  if (!browserSupportsSpeechRecognition) {
    return <span>Browser doesn't support speech recognition.</span>;
  }
  //end

  //input stores the sent text
  const [input, setInput] = useState("");

  //state to store all the messages,these messages r stored in messages array
  //each message is an object
  const [messages, setMessages] = useState([]);

  //state to store whether Erza is thinking or not ..basically waits for info to be returned from open ai...if true then we r waiting for the info to come
  const [isTyping, setIsTyping] = useState(false);

  //time
  const time = new Date().toLocaleTimeString();

  //function is called when user clicks submit and sends the text
  const handleSend = (e) => {
    e.preventDefault();
    const newMessage = {
      message: input + transcript,
      direction: "outgoing",
      sender: "user",
    };

    const newMessages = [...messages, newMessage];

    setMessages(newMessages);

    // Initial system message to determine ChatGPT functionality
    // How it responds, how it talks, etc.
    setIsTyping(true);
    processMessageToChatGPT(newMessages);
    setInput("");
    resetTranscript();
  };

  //function which turns users message to chatgpts message format in order to send it to chatgpt
  async function processMessageToChatGPT(chatMessages) {
    // messages is an array of messages
    // Format messages for chatGPT API
    // API is expecting objects in format of { role: "user" or "assistant", "content": "message here"}
    // So we need to reformat

    let apiMessages = chatMessages.map((messageObject) => {
      let role = "";
      if (messageObject.sender === aiName) {
        role = "assistant";
      } else {
        role = "user";
      }
      return { role: role, content: messageObject.message };
    });

    // Get the request body set up with the model we plan to use
    // and the messages which we formatted above. We add a system message in the front to'
    // determine how we want chatGPT to act.
    const apiRequestBody = {
      model: "gpt-3.5-turbo",
      messages: [
        systemMessage, // The system message DEFINES the logic of our chatGPT
        ...apiMessages, // The messages from our chat with ChatGPT
      ],
    };

    await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(apiRequestBody),
    })
      .then((data) => {
        return data.json();
      })
      .then((data) => {
        console.log(data);
        setMessages([
          ...chatMessages,
          {
            message: data.choices[0].message.content,
            sender: aiName,
          },
        ]);
        setIsTyping(false);
      });
  }

  //disable button when no input is provided
  const isDisabled = !(input || transcript);
  //end

  //music start
  const [sound, setSound] = useState(null);

  const play = () => {
    if (!sound) {
      const newSound = new Howl({
        src: [song],
      });
      setSound(newSound);
      newSound.play();
      setIsPlaying(true);
    } else {
      sound.play();
      setIsPlaying(true);
    }
  };

  const stop = () => {
    if (sound) {
      sound.pause();
      setIsPlaying(false);
    }
  };
  //music end

  //sign out functionality
  const signout = () => {
    signOut(auth)
      .then(() => {
        console.log("sign out successful");
      })
      .catch((error) => console.log(error));
    navigate("/");
  };
  const [authUser, setAuthUser] = useState(null);

  useEffect(() => {
    const listen = onAuthStateChanged(auth, (user) => {
      if (user) {
        setAuthUser(user);
      } else {
        setAuthUser(null);
      }
    });

    return () => {
      listen();
    };
  }, []);

  return (
    <div>
      {authUser ? (
        <div className="App">
          <AppBar sx={{ height: 78 }}>
            <div className="header-text">
              <FontAwesomeIcon icon={faReact} spin />
              <span>Erza</span>
              {!isPlaying ? (
                <Button
                  size="large"
                  variant="contained"
                  onClick={play}
                  color="secondary"
                  sx={{ position: "fixed", left: "3%", top: "20px" }}
                >
                  <FontAwesomeIcon icon={faMusic} size="lg" />
                </Button>
              ) : (
                <Button
                  disableFocusRipple
                  size="large"
                  variant="contained"
                  onClick={stop}
                  id="stop"
                  color="secondary"
                  sx={{ position: "fixed", left: "3%", top: "20px" }}
                >
                  <FontAwesomeIcon icon={faPause} size="lg" />
                </Button>
              )}

              <Button
                onClick={signout}
                variant="contained"
                id="logout"
                color="error"
                size="large"
                sx={{ position: "fixed", right: "3%", top: "20px", p: "10px" }}
              >
                <FontAwesomeIcon icon={faPowerOff} size="lg" />
              </Button>
            </div>
          </AppBar>
          <div className="intro-message">
            Hello, I'm your personal AI assistant Erza Ask me anything!
          </div>
          <div
            style={{
              position: "fixed",
              height: "74vh",
              width: "100vw",
              top: "10vh",
            }}
          >
            <MainContainer>
              <ChatContainer>
                <MessageList
                  scrollBehavior="smooth"
                  typingIndicator={
                    isTyping ? (
                      <TypingIndicator content="Erza is thinking" />
                    ) : null
                  }
                >
                  {messages.map((message, i) => {
                    return (
                      <div className="custom">
                        <Message key={i + 1} model={message}>
                          <Avatar
                            src={
                              message.sender == aiName
                                ? "https://i.pinimg.com/736x/ef/fc/9b/effc9ba200161241fb3d1c709aa4b4f6.jpg"
                                : "https://picfiles.alphacoders.com/478/478908.jpg"
                            }
                            name="User"
                          />
                          <Message.Header
                            className="hi"
                            sender={message.sender}
                            sentTime={time}
                          />
                        </Message>
                      </div>
                    );
                  })}
                </MessageList>
              </ChatContainer>
            </MainContainer>

            <div className="input-bar">
              <input
                type="text"
                className="text-box"
                placeholder="Type message here"
                value={input + transcript}
                onChange={(e) => setInput(e.target.value)}
              />
              <button
                className="send-btn"
                onClick={handleSend}
                disabled={isDisabled}
                id="send"
              >
                {isDisabled ? (
                  <FontAwesomeIcon icon={faPaperPlane} />
                ) : (
                  <FontAwesomeIcon icon={faPaperPlane} bounce />
                )}
              </button>
            </div>
            <div className="microphone">
              <p className="text">Microphone: {listening ? "on" : "off"}</p>
              <Button
                variant="contained"
                color="success"
                size="large"
                onClick={SpeechRecognition.startListening}
                sx={{ mr: 2 }}
              >
                <FontAwesomeIcon icon={faMicrophone} size="lg" />
              </Button>
              <Button
                variant="contained"
                color="error"
                size="large"
                onClick={SpeechRecognition.stopListening}
                sx={{ mr: 2 }}
              >
                <FontAwesomeIcon icon={faStop} size="lg" />
              </Button>
              <Button
                variant="contained"
                size="large"
                sx={{ mr: 2 }}
                onClick={resetTranscript}
              >
                <FontAwesomeIcon icon={faTrash} size="lg" />
              </Button>
            </div>
          </div>
          <AuthDetails />
        </div>
      ) : (
        <video
          autoPlay
          loop
          muted
          id="video3"
          onLoadedData={(e) => {
            e.target.playbackRate = 2;
          }}
        >
          <source src={error} type="video/mp4" />
        </video>
      )}
    </div>
  );
}

export default Erza;
