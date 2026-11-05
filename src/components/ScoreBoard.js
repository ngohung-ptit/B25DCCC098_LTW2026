import React from 'react';

const ScoreBoard = ({ score = 0, currentIndex = 0, answers = [], totalQuestions = 15 }) => {
  const slots = Array.from({ length: totalQuestions }, (_, i) => i + 1);

  return (
    <div className="scoreboard">
      <div className="score-text">
        {`Điểm: ${score}`}
      </div>
      <div className="score-slots">
        {slots.map((num, i) => {
          const answer = answers[i];
          const isCorrect = answer && answer.correct;
          const isLifebuoy = answer && answer.usedLifebuoy;
          const isCurrent = i === currentIndex;

          let backgroundColor = '#f1f5f9';
          let textColor = '#64748b';
          let border = '1px solid #cbd5e1';

          if (isCorrect) {
            backgroundColor = '#22c55e';
            textColor = '#ffffff';
            border = '1px solid #16a34a';
          } else if (isLifebuoy) {
            // Ô của câu dùng phao có màu cam
            backgroundColor = '#f97316';
            textColor = '#ffffff';
            border = '1px solid #ea580c';
          }

          if (isCurrent) {
            border = '2.5px solid #0f172a';
          }

          return (
            <div
              key={num}
              className={`slot-item ${isCurrent ? 'current' : ''} ${isCorrect ? 'correct' : ''} ${isLifebuoy ? 'lifebuoy' : ''}`}
              style={{
                backgroundColor: backgroundColor,
                color: textColor,
                border: border,
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
