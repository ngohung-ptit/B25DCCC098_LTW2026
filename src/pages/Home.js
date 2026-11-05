import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home = ({ playerName, setPlayerName, history = [] }) => {
  const navigate = useNavigate();

  const handleNameChange = (e) => {
    setPlayerName(e.target.value);
  };

  const handleStart = (e) => {
    e.preventDefault();
    if (playerName && playerName.trim()) {
      navigate('/play');
    }
  };

  const isButtonDisabled = !playerName || !playerName.trim();

  // Kỷ lục ở trang chủ: lượt có điểm cao nhất (chưa có lượt nào thì không hiện)
  const topRecord = history && history.length > 0
    ? [...history].sort((a, b) => b.score - a.score)[0]
    : null;

  return (
    <div className="home-page">
      <h2>Rung chuông vàng</h2>

      {topRecord && (
        <div
          className="high-score-record"
          style={{
            backgroundColor: '#fef3c7',
            border: '1px solid #fde68a',
            color: '#92400e',
            padding: '10px 16px',
            borderRadius: '6px',
            fontWeight: '600',
            fontSize: '15px',
            marginBottom: '18px',
            maxWidth: '400px',
          }}
        >
          {`Kỷ lục: ${topRecord.score} điểm - ${topRecord.name}`}
        </div>
      )}

      <div className="card-box">
        <h3>Luật chơi:</h3>
        <ul className="rules-list">
          <li>Trả lời lần lượt 15 câu hỏi về HTML, CSS, JavaScript và React.</li>
          <li>Mỗi câu hỏi có thời gian suy nghĩ là 20 giây.</li>
          <li>Thang điểm: Câu dễ 10 điểm, câu trung bình 20 điểm, câu khó 30 điểm.</li>
          <li>Trả lời sai hoặc hết giờ sẽ bị loại ngay lập tức và giữ nguyên số điểm đã đạt.</li>
          <li>Vượt qua cả 15 câu hỏi để rung chuông vàng với 300 điểm!</li>
        </ul>
      </div>

      <div className="card-box" style={{ maxWidth: '400px' }}>
        <form onSubmit={handleStart} className="player-form" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <label htmlFor="player-name-input" style={{ fontWeight: '600', fontSize: '15px' }}>
            Tên người chơi:
          </label>
          <input
            id="player-name-input"
            type="text"
            placeholder="Nhập tên của bạn..."
            value={playerName}
            onChange={handleNameChange}
          />
          <button
            type="submit"
            disabled={isButtonDisabled}
            className="primary-btn"
          >
            Vào thi
          </button>
        </form>
      </div>
    </div>
  );
};

export default Home;
