import React, { useEffect, useState } from "react";
import Navbar from "../../Components/Navbar/Navbar";
import "./Dashboard.css";
import { toast } from "react-toastify";
import axios from "axios";
import { resolvePath, useNavigate } from "react-router-dom";
import BarChartComponent from "../../Components/Charts/BarChartComponent";
import AskAIChat from "../../Components/AskAIChat/AskAIChat";
import DonutChart from "../../Components/Charts/DonutChart";
import Loading from "../../Components/Loading/Loading";
import { motion } from "framer-motion";

const Dashboard = () => {
  const user = JSON.parse(localStorage.getItem('user')) || {};
  const name = user.name || "User";
  const [users, setUsers] = useState([]);
  const nav = useNavigate();
  const [curr, allcurr] = useState([]);
  const backend = import.meta.env.VITE_BACKEND_URL;
  const python = import.meta.env.VITE_PYTHON_URL;
  const [bar, setbar] = useState({});
  const [donut, Setdonut] = useState({
    completed: 0,
    total: 0
  });
  const [classificationMsg, setClassificationMsg] = useState("");
  const [loading, setLoading] = useState(true);
  const [serverXp, setServerXp] = useState(0);

  const getUserId = () => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return user.id;
  };
  const classifyUser = async () => {
    try {
      const token = localStorage.getItem("token");
      const resp = await axios.post(python + "classify", {
        user_id: getUserId()
      },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
      if (!resp.data.success) {
        toast.error("Unable to classify");
      } else {
        setClassificationMsg(resp.data.data || "");
      }
    } catch (e) {
      console.error("Classification error:", e);
      setClassificationMsg("");
    }
  };

  const calculateDonut = (dataList) => {
    let total = 0;

    dataList.forEach(item => {
      const start = new Date(item.startdate);
      const now = new Date();
      const diffTime = now - start;
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      const day = 1 + diffDays;
      
      // Only count topics if today is between start and end date
      if (day >= 1 && day <= parseInt(item.duration)) {
        let currData = item.curriculum;
        if (currData && Object.keys(currData).length === 1 && !Object.keys(currData)[0].startsWith("Day")) {
          currData = currData[Object.keys(currData)[0]];
        }
        
        if (currData && currData[`Day ${day}`] && currData[`Day ${day}`]?.Subtopics) {
          total += currData[`Day ${day}`].Subtopics.length;
        }
      }
    });

    Setdonut({
      total,
      completed: 0
    });
  };


  const getCurriculum = async (e) => {
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const email = user.email;
      const user_id = user.id;
      const token = localStorage.getItem("token");

      const resp = await axios.post(
        backend + "api/curriculum/getcurriculum",
        {
          email: email,
          userId: user_id
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (!resp.data.success) {
        toast.success("Unable to get Curriculum!");
      } else {
        allcurr(resp.data.data);
        setbar(resp.data.bar);
        setUsers(resp.data.leaderboard);
        setServerXp(resp.data.userXP || 0);
        calculateDonut(resp.data.data);
        Setdonut(prev => ({
          ...prev,
          completed: resp.data.donut
        }));
      }
    } catch (e) {
      console.log(e);
    }
  };


  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      await Promise.all([getCurriculum(), classifyUser()]);
      setLoading(false);
    };
    fetchAll();

  }, []);

  if (loading) {
    return (
      <div className="dashboard-container">
        <Navbar />
        <div className="dashboard-main" style={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: "3rem" }}>
          <Loading />
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <Navbar />
      <motion.div 
        initial="hidden" 
        animate="visible" 
        variants={containerVariants}
        className="dashboard-animated-content"
      >
        <div className="dashboard-main" style={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: "3rem" }}>
          <motion.div variants={itemVariants} className="dashboard-welcome-row">
           <h1 className="dashboard-title">Welcome, {name}!</h1>
           <motion.div whileHover={{ scale: 1.05 }} className="xp-badge">
             <span className="xp-star">⭐</span>
             <span>{serverXp} XP</span>
           </motion.div>
        </motion.div>
        {classificationMsg && classificationMsg.length > 0 && (
          <motion.div variants={itemVariants} className="classification-message">
            {classificationMsg}
          </motion.div>
        )}
        {curr.length > 0 ? <motion.div variants={itemVariants} className="curriculums">
          {curr
            .filter(item => {
              const now = new Date();
              const start = new Date(item.startdate);
              const end = new Date(start.getTime() + item.duration * 24 * 60 * 60 * 1000);
              return start <= now && now <= end;
            })
            .map((item, index) => (
              <motion.div 
                key={index} 
                className="day-card"
                whileHover={{ scale: 1.03, translateY: -5 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => nav(`/study-curriculum/${item.id}`)}
                style={{ cursor: "pointer" }}
              >
                <h4>
                  Day {1 + Math.floor((new Date() - new Date(item.startdate)) / (1000 * 60 * 60 * 24))} of {item.topic}
                </h4>
              </motion.div>
            ))}
        </motion.div> : ""}
        {donut.total > 0 || bar.length > 0 ? <motion.div variants={itemVariants} className="dashboard-charts-row">
          {donut.total > 0 ? <motion.div whileHover={{ scale: 1.02 }} className="dashboard-chart-card">
            <DonutChart completed={donut.completed > donut.total ? donut.total : donut.completed} total={donut.total} title={"Today Progress"} ct={"Completed"} rt={"Remaining"} />
          </motion.div> : ""}
          {bar.length > 0 ?

            <motion.div whileHover={{ scale: 1.02 }} className="dashboard-chart-card">
              <BarChartComponent data={bar} title={"Last 7 Days Progress"} col={"date"} row={"count_of_completed"} rowname={"Completed"} />
            </motion.div> : ""}
        </motion.div>
          : ""}

      </div>

      {users && users.length > 0 ? <motion.div variants={itemVariants} className="leaderboard-container">
        <h2 className="leaderboard-title">🏆 Leaderboard – Top 20 by XP</h2>
        <div className="leaderboard-table-container">
          <table className="leaderboard-table">
            <thead>
              <tr>
                <th>Rank</th>
                <th>Name</th>
                <th>XP</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{user.name}</td>
                  <td>{user.xp}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div> : ""}

      <motion.div variants={itemVariants} className="daily-tasks">
        <h3 className="tasks-heading">🎯 Daily XP Tasks</h3>

        <motion.div whileHover={{ x: 5 }} className="task-item completed">
          <span className="task-title">✅ Read your first topic of the day</span>
          <span className="task-reward">+10 XP</span>
        </motion.div>

        <motion.div whileHover={{ x: 5 }} className="task-item">
          <span className="task-title">📊 Score more than 60% in quiz</span>
          <span className="task-reward">+20 XP</span>
        </motion.div>

        <motion.div whileHover={{ x: 5 }} className="task-item">
          <span className="task-title">🏆 Score 100% in quiz</span>
          <span className="task-reward">+30 XP</span>
        </motion.div>
      </motion.div>

      <AskAIChat />
      </motion.div>
    </div>
  );
};

export default Dashboard;