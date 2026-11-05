import React from 'react';

const Timer = ({ timeLeft }) => {
  const isRed = timeLeft <= 5;

  return (
    <div
      className="timer"
      style={{
        fontSize: '18px',
        fontWeight: 'bold',
        color: isRed ? '#dc3545' : '#333333',
        marginBottom: '15px',
      }}
    >
      {`Còn ${timeLeft} giây`}
    </div>
  );
};

export default Timer;

