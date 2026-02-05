// frontend/src/pages/QueuePage.js
import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import "./QueuePage.css";

const socket = io("http://localhost:5000"); // 🔗 connect to backend WebSocket server

const QueuePage = () => {
  const [queue, setQueue] = useState([]);
  const [userPosition, setUserPosition] = useState(null);
  const [statusMessage, setStatusMessage] = useState("Connecting to queue...");

  // 🧠 Simulate patient name from previous session or appointment
  const userEmail = localStorage.getItem("email") || "user@example.com";

  useEffect(() => {
    // Join queue on mount
    socket.emit("joinQueue", { email: userEmail });

    socket.on("queueUpdate", (updatedQueue) => {
      setQueue(updatedQueue);

      const index = updatedQueue.findIndex((q) => q.email === userEmail);
      setUserPosition(index !== -1 ? index + 1 : null);
    });

    socket.on("connect", () => setStatusMessage("Connected to live queue ✅"));
    socket.on("disconnect", () => setStatusMessage("Disconnected. Reconnecting..."));

    return () => {
      socket.emit("leaveQueue", { email: userEmail });
      socket.off();
    };
  }, [userEmail]);

  return (
    <div className="queue-page-container">
      <h1>🏥 Live Queue Status</h1>
      <p className="status">{statusMessage}</p>

      {userPosition ? (
        <>
          <div className="queue-status-card">
            <h2>Your Position: {userPosition}</h2>
            <p>
              {userPosition === 1
                ? "You're next to see the doctor! 💉"
                : `There are ${userPosition - 1} people ahead of you.`}
            </p>
          </div>

          <div className="queue-list">
            <h3>Current Queue</h3>
            <ul>
              {queue.map((q, idx) => (
                <li
                  key={idx}
                  className={q.email === userEmail ? "highlight" : ""}
                >
                  {idx + 1}. {q.email}
                </li>
              ))}
            </ul>
          </div>
        </>
      ) : (
        <p className="no-queue">You are not currently in the queue.</p>
      )}
    </div>
  );
};

export default QueuePage;
