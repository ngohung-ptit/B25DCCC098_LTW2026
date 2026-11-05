import React from 'react';

const Timer = ({ timeLeft, maxTime = 20 }) => {
  const isRed = timeLeft <= 5;
  const progressPercent = Math.min(100, Math.max(0, (timeLeft / maxTime) * 100));

  return (
    <div className="timer-container" style={{ marginBottom: '16px' }}>
      <div
        className="timer"
        style={{
          color: isRed ? '#dc2626' : '#334155',
        }}
      >
        {`Còn ${timeLeft} giây`}
      </div>
      <div className="timer-progress-bg">
        <div
          className="timer-progress-fill"
          style={{
            width: `${progressPercent}%`,
            backgroundColor: isRed ? '#ef4444' : '#3b82f6',
          }}
        />
      </div>
    </div>
  );
};

export default Timer;
