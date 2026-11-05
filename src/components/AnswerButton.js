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
  isHidden = false,
}) => {
  // Đáp án bị ẩn vẫn giữ chỗ trong lưới nhưng không có chữ và không bấm được
  if (isHidden) {
    return (
      <button
        type="button"
        className="answer-btn answer-hidden"
        disabled
        style={{
          padding: '14px 16px',
          minHeight: '52px',
          borderRadius: '6px',
          border: '1.5px dashed #cbd5e1',
          backgroundColor: '#f8fafc',
          cursor: 'not-allowed',
        }}
      >
        {/* Rỗng không có chữ */}
      </button>
    );
  }

  let backgroundColor = '#ffffff';
  let color = '#1e293b';
  let borderColor = '#cbd5e1';

  if (status === 'locked' && isSelected) {
    backgroundColor = '#fef08a'; // Vàng khi đang chốt
    color = '#854d0e';
    borderColor = '#eab308';
  } else if (status === 'revealed') {
    if (isCorrectAnswer) {
      backgroundColor = '#dcfce7'; // Xanh lá khi đáp án đúng
      color = '#15803d';
      borderColor = '#22c55e';
    } else if (isSelected) {
      backgroundColor = '#fee2e2'; // Đỏ khi chọn sai
      color = '#b91c1c';
      borderColor = '#ef4444';
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
        padding: '14px 16px',
        fontSize: '15px',
        fontWeight: '500',
        borderRadius: '6px',
        border: `1.5px solid ${borderColor}`,
        backgroundColor: backgroundColor,
        color: color,
        cursor: isButtonDisabled ? 'not-allowed' : 'pointer',
        textAlign: 'left',
        lineHeight: '1.4',
        transition: 'background-color 0.15s, border-color 0.15s, color 0.15s',
      }}
    >
      {`${LETTERS[index]}. `}{option}
    </button>
  );
};

export default AnswerButton;
