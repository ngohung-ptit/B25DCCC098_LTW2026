import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { LEVELS, POINTS, LETTERS } from '../data';

const QuestionDetail = ({ questions = [] }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const questionId = Number(id);
  const question = questions.find((q) => q.id === questionId);

  const handleBack = () => {
    navigate(-1);
  };

  if (!question) {
    return (
      <div className="card-box" style={{ maxWidth: '500px' }}>
        <h2>Không tìm thấy câu hỏi</h2>
        <button
          type="button"
          onClick={handleBack}
          className="btn-secondary"
        >
          Quay lại
        </button>
      </div>
    );
  }

  const titleText = `Câu hỏi số ${question.id} - ${question.topic} (${LEVELS[question.level]}, ${POINTS[question.level]} điểm)`;

  return (
    <div className="question-detail-page">
      <div className="card-box" style={{ maxWidth: '680px' }}>
        <h2>{titleText}</h2>
        <p style={{ fontSize: '17px', fontWeight: '500', color: '#1e293b', margin: '20px 0' }}>
          {question.question}
        </p>

        <div className="detail-options-list">
          {question.options.map((option, index) => {
            const isCorrect = index === question.answer;
            return (
              <div
                key={index}
                className={`detail-option-box ${isCorrect ? 'correct' : ''}`}
              >
                {LETTERS[index]}. {option}
                {isCorrect}
              </div>
            );
          })}
        </div>

        <div style={{ marginTop: '24px' }}>
          <button
            type="button"
            onClick={handleBack}
            className="btn-secondary"
          >
            Quay lại
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuestionDetail;
