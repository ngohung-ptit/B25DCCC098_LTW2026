import React from 'react';

const History = ({ history = [], onClearHistory }) => {
  if (!history || history.length === 0) {
    return (
      <div className="history-page">
        <h2>Lịch sử các lượt chơi</h2>
        <div className="card-box" style={{ maxWidth: '500px' }}>
          <p style={{ margin: 0, color: '#64748b', fontSize: '15px' }}>Chưa có lượt chơi nào.</p>
        </div>
      </div>
    );
  }

  const sortedHistory = [...history].sort((a, b) => b.score - a.score);

  const totalGames = history.length;
  const maxScore = Math.max(...history.map((h) => h.score));
  const avgScore = Math.round(history.reduce((sum, h) => sum + h.score, 0) / totalGames);

  return (
    <div className="history-page">
      <h2>Lịch sử các lượt chơi</h2>

      <div className="card-box" style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
          <div className="history-stats" style={{ lineHeight: '1.8', fontSize: '15px', color: '#334155' }}>
            <div>{`Số lượt chơi: ${totalGames}`}</div>
            <div>{`Điểm cao nhất: ${maxScore}`}</div>
            <div>{`Điểm trung bình: ${avgScore}`}</div>
          </div>

          <button
            type="button"
            className="btn-secondary"
            onClick={onClearHistory}
            style={{ color: '#dc2626' }}
          >
            Xóa lịch sử
          </button>
        </div>
      </div>

      <div className="table-wrapper">
        <table className="question-table">
          <thead>
            <tr>
              <th>Người chơi</th>
              <th style={{ width: '130px', textAlign: 'center' }}>Số câu đúng</th>
              <th style={{ width: '100px', textAlign: 'center' }}>Điểm</th>
              <th style={{ width: '160px' }}>Danh hiệu</th>
              <th style={{ width: '190px' }}>Thời gian</th>
            </tr>
          </thead>
          <tbody>
            {sortedHistory.map((item) => (
              <tr key={item.id}>
                <td style={{ fontWeight: '500' }}>{item.name}</td>
                <td style={{ textAlign: 'center' }}>{item.correctCount}</td>
                <td style={{ textAlign: 'center', fontWeight: '600' }}>{item.score}</td>
                <td>{item.rank}</td>
                <td style={{ color: '#64748b', fontSize: '13.5px' }}>{item.playedAt}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default History;
