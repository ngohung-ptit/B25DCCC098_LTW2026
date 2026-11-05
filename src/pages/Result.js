import React from 'react';
import { useLocation, useNavigate, Navigate } from 'react-router-dom';

const Result = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state;

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

  const isWin = reason === 'win' || reason === 'Chúc mừng! Bạn đã rung chuông vàng';

  return (
    <div className="result-page">
      <div className="result-card">
        {isWin && (
          <div>
            <div className="golden-bell" role="img" aria-label="Chiếc chuông vàng">
              🔔
            </div>
          </div>
        )}

        <h2 className="result-title" style={{ color: isWin ? '#16a34a' : '#dc2626' }}>
          {reasonTitle}
        </h2>

        <div className="result-details">
          <p>{`Người chơi: ${name}`}</p>
          <p>{`Số câu trả lời đúng: ${correctCount}`}</p>
          <p>{`Điểm: ${score}`}</p>
          <p>{`Danh hiệu: ${rank}`}</p>
        </div>

        <div className="result-actions">
          <button
            type="button"
            className="btn-primary-blue"
            onClick={() => navigate('/play')}
          >
            Chơi lại
          </button>

          <button
            type="button"
            className="btn-secondary"
            onClick={() => navigate('/')}
          >
            Về trang chủ
          </button>
        </div>
      </div>
    </div>
  );
};

export default Result;
