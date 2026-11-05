import React from 'react';
import { useLocation, useNavigate, Navigate } from 'react-router-dom';

const Result = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state;

  // Mở /result trực tiếp (không có state) -> chuyển về /
  if (!state) {
    return <Navigate to="/" replace />;
  }

  const { name, score, rank, correctCount, reason } = state;

  let reasonTitle = '';
  if (reason === 'win' || reason === 'Chúc mừng! Bạn đã rung chuông vàng') {
    reasonTitle = 'Chúc mừng! Bạn đã rung chuông vàng';
  } else if (reason === 'wrong' || reason === 'Bạn đã bị loại') {
    reasonTitle = 'Bạn đã bị loại';
  } else if (reason === 'timeout' || reason === 'Hết giờ!') {
    reasonTitle = 'Hết giờ!';
  } else if (reason === 'completed' || reason === 'Bạn đã hoàn thành 15 câu') {
    reasonTitle = 'Bạn đã hoàn thành 15 câu';
  } else {
    reasonTitle = reason || 'Kết quả lượt chơi';
  }

  return (
    <div className="result-page" style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
      <h2 style={{ color: reason === 'win' ? '#28a745' : '#dc3545', marginBottom: '24px' }}>
        {reasonTitle}
      </h2>

      <div
        className="result-details"
        style={{
          backgroundColor: '#f8f9fa',
          padding: '24px',
          borderRadius: '8px',
          textAlign: 'left',
          marginBottom: '24px',
          fontSize: '16px',
          lineHeight: '1.8',
        }}
      >
        <p style={{ margin: '6px 0' }}>{`Người chơi: ${name}`}</p>
        <p style={{ margin: '6px 0' }}>{`Số câu trả lời đúng: ${correctCount}`}</p>
        <p style={{ margin: '6px 0' }}>{`Điểm: ${score}`}</p>
        <p style={{ margin: '6px 0' }}>{`Danh hiệu: ${rank}`}</p>
      </div>

      <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
        <button
          type="button"
          onClick={() => navigate('/play')}
          style={{
            padding: '10px 20px',
            fontSize: '16px',
            fontWeight: '600',
            backgroundColor: '#007bff',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Chơi lại
        </button>

        <button
          type="button"
          onClick={() => navigate('/')}
          style={{
            padding: '10px 20px',
            fontSize: '16px',
            fontWeight: '600',
            backgroundColor: '#6c757d',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Về trang chủ
        </button>
      </div>
    </div>
  );
};

export default Result;
