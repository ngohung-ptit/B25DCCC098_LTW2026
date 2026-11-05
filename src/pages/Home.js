import React from 'react';
import { useNavigate } from 'react-router-dom';
import { TOPICS } from '../data';

const Home = ({
  playerName,
  setPlayerName,
  history = [],
  selectedTopic = 'Tất cả',
  setSelectedTopic,
  shuffleAnswers = false,
  setShuffleAnswers,
  speedBonusEnabled = false,
  setSpeedBonusEnabled,
}) => {
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
            maxWidth: '440px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <span>{`Kỷ lục: ${topRecord.score} điểm - ${topRecord.name}`}</span>
        </div>
      )}

      <div className="card-box">
        <h3>Luật chơi:</h3>
        <ul className="rules-list">
          <li>Trả lời lần lượt các câu hỏi về HTML, CSS, JavaScript và React.</li>
          <li>Mỗi câu hỏi có thời gian suy nghĩ là 20 giây.</li>
          <li>Thang điểm: Câu dễ 10 điểm, câu trung bình 20 điểm, câu khó 30 điểm.</li>
          <li>Trả lời sai hoặc hết giờ sẽ bị loại ngay lập tức và giữ nguyên số điểm đã đạt.</li>
          <li>Vượt qua tất cả câu hỏi để rung chuông vàng với điểm số tuyệt đối!</li>
        </ul>
      </div>

      <div className="card-box" style={{ maxWidth: '440px' }}>
        <form onSubmit={handleStart} className="player-form" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label htmlFor="player-name-input" style={{ display: 'block', fontWeight: '600', fontSize: '15px', marginBottom: '6px' }}>
              Tên người chơi:
            </label>
            <input
              id="player-name-input"
              type="text"
              placeholder="Nhập tên của bạn..."
              value={playerName}
              onChange={handleNameChange}
              style={{ width: '100%' }}
            />
          </div>

          {setSelectedTopic && (
            <div>
              <label htmlFor="topic-select-home" style={{ display: 'block', fontWeight: '600', fontSize: '14.5px', marginBottom: '6px' }}>
                Chủ đề thi (Thử thách thêm):
              </label>
              <select
                id="topic-select-home"
                value={selectedTopic}
                onChange={(e) => setSelectedTopic(e.target.value)}
                style={{ width: '100%' }}
              >
                <option value="Tất cả">Tất cả các chủ đề (15 câu)</option>
                {TOPICS.map((t) => (
                  <option key={t} value={t}>
                    {`Chỉ thi chủ đề ${t}`}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '14px', color: '#475569' }}>
            {setShuffleAnswers && (
              <label htmlFor="shuffle-checkbox" style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <input
                  id="shuffle-checkbox"
                  type="checkbox"
                  checked={shuffleAnswers}
                  onChange={(e) => setShuffleAnswers(e.target.checked)}
                />
                <span>Xáo trộn thứ tự 4 đáp án</span>
              </label>
            )}

            {setSpeedBonusEnabled && (
              <label htmlFor="speed-bonus-checkbox" style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <input
                  id="speed-bonus-checkbox"
                  type="checkbox"
                  checked={speedBonusEnabled}
                  onChange={(e) => setSpeedBonusEnabled(e.target.checked)}
                />
                <span>Thưởng tốc độ (+5đ khi trả lời đúng còn &ge; 15s)</span>
              </label>
            )}
          </div>

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
