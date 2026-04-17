import React from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import './Navbar.css'
import curriculum from "../../assets/curriculum.png"
import quiz from "../../assets/quiz.png"

const Navbar = ({ minimal = false }) => {
  const nav = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    nav('/')
  }

  const handleProfile = () => {
    nav('/profile')
  }

  const handleCurriculum = () => {
    nav('/curriculum')
  }

  const handleQuiz = () => {
    nav('/quiz')
  }

  return (
    <nav className="navbar">
      <div className="navbar-logo" onClick={() => nav("/dashboard")}>
        <span role="img" aria-label="logo" style={{ fontSize: 32, verticalAlign: 'middle' }}>🧠</span>
        <span className="navbar-name">NeuraLearn AI</span>
      </div>

      {!minimal && (
        <div className="navbar-links">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="navbar-curriculum"
            onClick={handleCurriculum}
            title="Curriculum"
          >
            <img
              src={curriculum}
              alt="Curriculum"
              className="navbar-curriculum-icon"
              width={60}
              height={60}
            />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="navbar-quiz"
            onClick={handleQuiz}
            title="Quiz"
          >
            <img
              src={quiz}
              alt="Quiz"
              className="navbar-curriculum-icon"
              width={60}
              height={60}
            />
          </motion.button>
          <motion.button 
            whileHover={{ scale: 1.1, rotate: 5 }}
            whileTap={{ scale: 0.9 }}
            className="navbar-profile" 
            onClick={handleProfile} 
            title="Profile"
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="8" r="4" stroke="#3F8EFC" strokeWidth="2" />
              <path d="M4 20c0-2.5 3.5-4 8-4s8 1.5 8 4" stroke="#3F8EFC" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </motion.button>
          <motion.button 
            whileHover={{ scale: 1.05, boxShadow: "0px 5px 15px rgba(63, 142, 252, 0.3)" }}
            whileTap={{ scale: 0.95 }}
            className="navbar-logout" 
            onClick={handleLogout}
          >
            Logout
          </motion.button>
        </div>
      )}
    </nav>
  )
}

export default Navbar
