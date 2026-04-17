import React, { useState } from "react";
import "./Login.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Navbar from "../../Components/Navbar/Navbar";
import { motion, AnimatePresence } from "framer-motion";

const avatars = [
  "https://api.dicebear.com/9.x/avataaars/svg?seed=Christopher",
  "https://api.dicebear.com/9.x/avataaars/svg?seed=Jameson",
  "https://api.dicebear.com/9.x/avataaars/svg?seed=Jessica",
  "https://api.dicebear.com/9.x/avataaars/svg?seed=Jack",
  "https://api.dicebear.com/7.x/bottts/svg?seed=neura1",
];

function Login() {
  const [isSignup, setIsSignup] = useState(false);
  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState(avatars[0]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const backend = import.meta.env.VITE_BACKEND_URL;
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password || (isSignup && !name)) {
      setError("Please fill all required fields.");
      return;
    }

    const endpoint = isSignup ? "signup" : "login";
    const payload = isSignup
      ? { name, email, password, avatar }
      : { email, password };

    try {
      console.log("BACKEND URL:", import.meta.env.VITE_BACKEND_URL);

      const res = await axios.post(`${backend}api/user/${endpoint}`, payload);

      if (res.data.success) {
        toast.success(res.data.message);
        if (!isSignup) {
          localStorage.setItem("token", res.data.token);
          localStorage.setItem("user", JSON.stringify(res.data.user));
          navigate("/dashboard");
        } else {
          setIsSignup(false);
        }
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      toast.error("Something went wrong");
    }
  };

  return (
    <>
      <Navbar minimal />

      <div className="auth-wrapper">
        <motion.div 
          className="auth-glass-card"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
          layout
        >
          <div className="auth-brand">
            <span className="brand-icon">🧠</span>
            <h1>NeuraLearn AI</h1>
            <p>
              {isSignup
                ? "Create your intelligent learning profile"
                : "Welcome back, let’s continue learning"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            <AnimatePresence mode="popLayout">
              {isSignup && (
                <motion.div 
                  className="field"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <label>Name</label>
                  <input
                    type="text"
                    placeholder="Your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            <div className="field">
              <label>Email</label>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="field">
              <label>Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <AnimatePresence mode="popLayout">
              {isSignup && (
                <motion.div 
                  className="field"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <label>Choose Avatar</label>
                  <div className="avatar-row">
                    {avatars.map((url) => (
                      <motion.img
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        key={url}
                        src={url}
                        alt="avatar"
                        className={`avatar ${
                          avatar === url ? "selected" : ""
                        }`}
                        onClick={() => setAvatar(url)}
                      />
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {error && <div className="error">{error}</div>}

            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="primary-btn"
            >
              {isSignup ? "Create Account" : "Sign In"}
            </motion.button>
          </form>

          <div className="switch-auth">
            {isSignup ? "Already have an account?" : "New to NeuraLearn?"}
            <span onClick={() => { setError(""); setIsSignup(!isSignup); }}>
              {isSignup ? " Sign In" : " Sign Up"}
            </span>
          </div>
        </motion.div>

        <footer className="auth-footer">
          <p>
            Email:
            <a href="mailto:niharkanchamreddy@gmail.com">
              {" "}
              niharkanchamreddy@gmail.com
            </a>
          </p>
          <p>
            Instagram:
            <a
              href="https://www.instagram.com/nihar_reddy.k"
              target="_blank"
              rel="noreferrer"
            >
              {" "}
              @nihar_reddy.k
            </a>
          </p>
          <small>Contact for bug reporting</small>
        </footer>
      </div>
    </>
  );
}

export default Login;
