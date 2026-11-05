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
      <div className="question-not-found">
        <h2>Không tìm thấy câu hỏi</h2>
        <button onClick={handleBack}>Quay lại</button>
      </div>
    );
  }

  const titleText = `Câu hỏi số ${question.id} – ${question.topic} (${LEVELS[question.level]}, ${POINTS[question.level]} điểm)`;

  return (
    <div className="question-detail-page">
      <h2>{titleText}</h2>
      <p className="question-title" style={{ fontSize: '18px', fontWeight: '500', margin: '20px 0' }}>
        {question.question}
      </p>

      <div className="options-list" style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '600px' }}>
        {question.options.map((option, index) => {
          const isCorrect = index === question.answer;
          return (
            <div
              key={index}
              className={`option-box ${isCorrect ? 'correct' : ''}`}
              style={{
                padding: '12px 16px',
                borderRadius: '6px',
                border: isCorrect ? '2px solid #28a745' : '1px solid #ccc',
                backgroundColor: isCorrect ? '#d4edda' : '#f9f9f9',
                color: isCorrect ? '#155724' : '#333',
                fontWeight: isCorrect ? 'bold' : 'normal',
              }}
            >
              {LETTERS[index]}. {option}
              {isCorrect && ' (Đáp án đúng)'}
            </div>
          );
        })}
      </div>

      <div style={{ marginTop: '20px' }}>
        <button
          onClick={handleBack}
          style={{
            padding: '8px 16px',
            cursor: 'pointer',
            backgroundColor: '#007bff',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
          }}
        >
          Quay lại
        </button>
      </div>
    </div>
  );
};

export default QuestionDetail;

