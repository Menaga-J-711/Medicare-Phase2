//HeartbeatDivider.js

import React from "react";

const HeartbeatDivider = () => {
  return (
    <div className="divider">
      <div className="heartbeat-container">
        <div className="pulse-ring"></div>
        <div className="pulse-ring delay"></div>
        <div className="plus">+</div>
        <div className="brand-name">Medicare</div>
      </div>
    </div>
  );
};

export default HeartbeatDivider;