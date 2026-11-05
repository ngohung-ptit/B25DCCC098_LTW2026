import React from 'react';

const Helpers = ({
  usedHelp5050,
  onUse5050,
  usedHelpTime,
  onUseTime,
  usedHelpLifebuoy,
  isLifebuoyActive,
  onUseLifebuoy,
  status,
}) => {
  const isAnswering = status === 'answering';

  return (
    <div className="helpers-container" style={{ display: 'flex', gap: '10px', marginBottom: '18px' }}>
      <button
        type="button"
        className="btn-secondary"
        onClick={onUse5050}
        disabled={usedHelp5050 || !isAnswering}
        style={{
          padding: '8px 14px',
          fontSize: '14px',
          fontWeight: '500',
          cursor: usedHelp5050 || !isAnswering ? 'not-allowed' : 'pointer',
          opacity: usedHelp5050 ? 0.6 : 1,
        }}
      >
        Loại 1 đáp án
      </button>

      <button
        type="button"
        className="btn-secondary"
        onClick={onUseTime}
        disabled={usedHelpTime || !isAnswering}
        style={{
          padding: '8px 14px',
          fontSize: '14px',
          fontWeight: '500',
          cursor: usedHelpTime || !isAnswering ? 'not-allowed' : 'pointer',
          opacity: usedHelpTime ? 0.6 : 1,
        }}
      >
        Thêm 15 giây
      </button>

      <button
        type="button"
        className="btn-secondary"
        onClick={onUseLifebuoy}
        disabled={usedHelpLifebuoy || !isAnswering}
        style={{
          padding: '8px 14px',
          fontSize: '14px',
          fontWeight: '500',
          cursor: usedHelpLifebuoy || !isAnswering ? 'not-allowed' : 'pointer',
          opacity: usedHelpLifebuoy && !isLifebuoyActive ? 0.6 : 1,
          backgroundColor: isLifebuoyActive ? '#fef3c7' : undefined,
          borderColor: isLifebuoyActive ? '#f59e0b' : undefined,
          color: isLifebuoyActive ? '#b45309' : undefined,
        }}
      >
        {isLifebuoyActive ? 'Phao đang bật' : 'Phao cứu sinh'}
      </button>
    </div>
  );
};

export default Helpers;

