import React from 'react';
import AnswerButton from './AnswerButton';
import { LEVELS } from '../data';

const QuestionCard = ({
  question,
  currentIndex,
  totalQuestions = 15,
  selectedAnswer,
  status,
  onSelectAnswer,
}) => {
  if (!question) return null;

  const headerInfo = `Câu ${currentIndex + 1}/${totalQuestions} · ${question.topic} · ${LEVELS[question.level]}`;

  return (
    <div className="question-card" style={{ marginBottom: '24px' }}>
      <div
        className="question-card-header"
        style={{ fontSize: '15px', color: '#6c757d', fontWeight: '600', marginBottom: '10px' }}
      >
        {headerInfo}
      </div>

      <div
        className="question-text"
        style={{ fontSize: '18px', fontWeight: 'bold', color: '#212529', marginBottom: '20px' }}
      >
        {question.question}
      </div>

      <div
        className="answer-grid"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '12px',
        }}
      >
        {question.options.map((option, index) => (
          <AnswerButton
            key={index}
            index={index}
            option={option}
            isSelected={selectedAnswer === index}
            isCorrectAnswer={index === question.answer}
            status={status}
            onClick={onSelectAnswer}
          />
        ))}
      </div>
    </div>
  );
};

export default QuestionCard;

