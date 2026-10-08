import React from 'react';

const StudentItem = ({ student, onDelete }) => {
  const { id, name, score, class: studentClass } = student;
  const isExcellent = score >= 8;
  const isFailed = score < 5;

  const rank = isExcellent ? 'Giỏi' : isFailed ? 'Trượt môn' : 'Đạt';
  const badgeClass = `status-badge ${isExcellent ? 'badge-excellent' : isFailed ? 'badge-failed' : 'badge-pass'}`;

  return (
    <tr>
      <td>{id}</td>
      <td>{name}</td>
      <td>{studentClass}</td>
      <td>{score}</td>
      <td>
        <span className={badgeClass}>{rank}</span>
      </td>
      <td>
        <button
          type="button"
          className="btn-delete"
          onClick={() => onDelete(id)}
        >
          Xóa
        </button>
      </td>
    </tr>
  );
};

export default StudentItem;
