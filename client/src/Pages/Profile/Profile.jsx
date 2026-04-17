import React from 'react'
import Navbar from '../../Components/Navbar/Navbar'
import './Profile.css'
import { useState, useEffect } from 'react'
import axios from 'axios'
import { motion } from 'framer-motion'

const Profile = () => {
  const user = JSON.parse(localStorage.getItem('user')) || {}
  const [badges, setBadge] = useState([]);
  const backend = import.meta.env.VITE_BACKEND_URL;
  const [xp, setXp] = useState(0)

  useEffect(() => {
    const fetchXP = async () => {
      try {
        const response = await axios.post(backend + "api/user/getXP", {
          id: user.id
        });
        if (response.data.success) {
          setXp(response.data.XP);
          setBadge(response.data.badges);
        }

      } catch (error) {
        console.error("Failed to fetch XP:", error)
      }
    }

    if (user.id) {
      fetchXP()
    }
  }, [user.id])

  const level = 1 + Math.floor(xp / 100)
  const progress = xp % 100

  return (
    <>
      <Navbar />
      <div className="profile-bg">
        <motion.div 
          className="profile-card"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <motion.div 
            className="profile-avatar-glow"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
          >
            <img src={user.avatar || "https://api.dicebear.com/7.x/bottts/svg?seed=neura1"} alt="avatar" />
          </motion.div>
          <h2 className="profile-name">{user.name || "User"}</h2>
          <div className="profile-divider"></div>
          <p className="profile-email">{user.email || "user@email.com"}</p>

          {/* XP and Level Section */}
          <div className="profile-xp-section">
            <p><strong>Level:</strong> {level}</p>
            <p><strong>Total XP:</strong> {xp}</p>
            <div className="progress-bar-container">
              <motion.div
                className="progress-bar-fill"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ delay: 0.8, duration: 1, ease: "easeInOut" }}
              ></motion.div>
            </div>
            <p>{100 - progress}XP More to next level</p>
          </div>

          {badges && badges.length > 0 && (
            <div className="profile-badges-section">
              <h3>Badges</h3>
              <div className="badges-container">
                {badges.map((badge, index) => (
                  <motion.div 
                    key={index} 
                    className="badge"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1.2 + (index * 0.1) }}
                  >
                    <span className="badge-name">{badge}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

        </motion.div>
      </div>
    </>
  )
}

export default Profile
