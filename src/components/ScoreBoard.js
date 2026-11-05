import React from 'react';

const ScoreBoard = ({ score = 0, currentIndex = 0, answers = [], totalQuestions = 15 }) => {
  const slots = Array.from({ length: totalQuestions }, (_, i) => i + 1);

  return (
    <div className="scoreboard" style={{ marginBottom: '20px' }}>
      <div className="score-text" style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '10px' }}>
        {`Điểm: ${score}`}
      </div>
      <div
        className="score-slots"
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '8px',
          alignItems: 'center',
        }}
      >
        {slots.map((num, i) => {
          const answer = answers[i];
          const isCorrect = answer && answer.correct;
          const isCurrent = i === currentIndex;

          let backgroundColor = '#e9ecef';
          let textColor = '#495057';
          let border = '1px solid #ced4da';

          if (isCorrect) {
            backgroundColor = '#28a745';
            textColor = '#ffffff';
            border = '1px solid #1e7e34';
          }

          if (isCurrent) {
            border = '3px solid #212529';
          }

          return (
            <div
              key={num}
              className={`slot-item ${isCurrent ? 'current' : ''} ${isCorrect ? 'correct' : ''}`}
              style={{
                width: '36px',
                height: '36px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '4px',
                fontWeight: 'bold',
                fontSize: '14px',
                backgroundColor: backgroundColor,
                color: textColor,
                border: border,
                boxSizing: 'border-box',
              }}
            >
              {num}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ScoreBoard;

