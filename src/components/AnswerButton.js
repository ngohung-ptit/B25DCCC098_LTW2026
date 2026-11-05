import React from 'react';
import { LETTERS } from '../data';

const AnswerButton = ({
  index,
  option,
  isSelected,
  isCorrectAnswer,
  status,
  onClick,
  disabled,
}) => {
  let backgroundColor = '#f8f9fa';
  let color = '#212529';
  let borderColor = '#ced4da';

  if (status === 'locked' && isSelected) {
    backgroundColor = '#ffc107'; // Vàng khi đang chốt
    color = '#212529';
    borderColor = '#e0a800';
  } else if (status === 'revealed') {
    if (isCorrectAnswer) {
      backgroundColor = '#28a745'; // Xanh lá khi đáp án đúng
      color = '#ffffff';
      borderColor = '#1e7e34';
    } else if (isSelected) {
      backgroundColor = '#dc3545'; // Đỏ khi chọn sai
      color = '#ffffff';
      borderColor = '#bd2130';
    }
  }

  const isButtonDisabled = disabled || status !== 'answering';

  return (
    <button
      type="button"
      className="answer-btn"
      onClick={() => onClick(index)}
      disabled={isButtonDisabled}
      style={{
        padding: '16px',
        fontSize: '16px',
        fontWeight: '500',
        borderRadius: '6px',
        border: `2px solid ${borderColor}`,
        backgroundColor: backgroundColor,
        color: color,
        cursor: isButtonDisabled ? 'not-allowed' : 'pointer',
        textAlign: 'left',
        transition: 'background-color 0.2s, border-color 0.2s',
      }}
    >
      {`${LETTERS[index]}. `}{option}
    </button>
  );
};

export default AnswerButton;

