import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home = ({ playerName, setPlayerName }) => {
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

  return (
    <div className="home-page">
      <h2>Rung chuông vàng</h2>

      <div className="rules-summary" style={{ backgroundColor: '#f8f9fa', padding: '16px', borderRadius: '8px', marginBottom: '20px' }}>
        <h3>Luật chơi:</h3>
        <ul>
          <li>Trả lời lần lượt 15 câu hỏi về HTML, CSS, JavaScript và React.</li>
          <li>Mỗi câu hỏi có thời gian suy nghĩ là 20 giây.</li>
          <li>Thang điểm: Câu dễ 10 điểm, câu trung bình 20 điểm, câu khó 30 điểm.</li>
          <li>Trả lời sai hoặc hết giờ sẽ bị loại ngay lập tức và giữ nguyên số điểm đã đạt.</li>
          <li>Vượt qua cả 15 câu hỏi để rung chuông vàng với 300 điểm!</li>
        </ul>
      </div>

      <form onSubmit={handleStart} className="player-form" style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxWidth: '360px' }}>
        <label htmlFor="player-name-input" style={{ fontWeight: '600' }}>
          Tên người chơi:
        </label>
        <input
          id="player-name-input"
          type="text"
          placeholder="Nhập tên của bạn..."
          value={playerName}
          onChange={handleNameChange}
          style={{ padding: '8px 12px', fontSize: '15px', borderRadius: '4px', border: '1px solid #ccc' }}
        />
        <button
          type="submit"
          disabled={isButtonDisabled}
          style={{
            padding: '10px 16px',
            fontSize: '16px',
            fontWeight: 'bold',
            color: '#fff',
            backgroundColor: isButtonDisabled ? '#cccccc' : '#28a745',
            border: 'none',
            borderRadius: '4px',
            cursor: isButtonDisabled ? 'not-allowed' : 'pointer',
          }}
        >
          Vào thi
        </button>
      </form>
    </div>
  );
};

export default Home;
