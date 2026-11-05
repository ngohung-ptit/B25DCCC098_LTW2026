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
  hiddenAnswerIndex = null,
}) => {
  if (!question) return null;

  const headerInfo = `Câu ${currentIndex + 1}/${totalQuestions} · ${question.topic} · ${LEVELS[question.level]}`;

  return (
    <div className="question-card">
      <div className="question-card-header">
        {headerInfo}
      </div>

      <div className="question-text">
        {question.question}
      </div>

      <div className="answer-grid">
        {question.options.map((option, index) => (
          <AnswerButton
            key={index}
            index={index}
            option={option}
            isSelected={selectedAnswer === index}
            isCorrectAnswer={index === question.answer}
            status={status}
            onClick={onSelectAnswer}
            isHidden={hiddenAnswerIndex === index}
          />
        ))}
      </div>
    </div>
  );
};

export default QuestionCard;
