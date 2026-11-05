import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { LEVELS, TOPICS } from '../data';

const QuestionBank = ({ questions = [] }) => {
  const [selectedTopic, setSelectedTopic] = useState('Tất cả');
  const [searchTerm, setSearchTerm] = useState('');

  const handleTopicChange = (e) => {
    setSelectedTopic(e.target.value);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredQuestions = questions.filter((q) => {
    const matchTopic = selectedTopic === 'Tất cả' || q.topic === selectedTopic;
    const matchSearch = q.question.toLowerCase().includes(searchTerm.trim().toLowerCase());
    return matchTopic && matchSearch;
  });

  return (
    <div className="question-bank-page">
      <h2>Ngân hàng câu hỏi</h2>

      <div className="filters-container" style={{ display: 'flex', gap: '15px', alignItems: 'center', marginBottom: '15px' }}>
        <div>
          <label htmlFor="topic-select" style={{ marginRight: '8px' }}>Chủ đề:</label>
          <select
            id="topic-select"
            value={selectedTopic}
            onChange={handleTopicChange}
          >
            <option value="Tất cả">Tất cả</option>
            {TOPICS.map((topic) => (
              <option key={topic} value={topic}>
                {topic}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="search-input" style={{ marginRight: '8px' }}>Tìm kiếm:</label>
          <input
            id="search-input"
            type="text"
            placeholder="Tìm theo nội dung..."
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
      </div>

      <p className="question-count">{`Có ${filteredQuestions.length} câu hỏi`}</p>

      <table className="question-table" border="1" cellPadding="8" style={{ borderCollapse: 'collapse', width: '100%' }}>
        <thead>
          <tr style={{ backgroundColor: '#f2f2f2' }}>
            <th style={{ width: '60px' }}>STT</th>
            <th style={{ width: '120px' }}>Chủ đề</th>
            <th style={{ width: '120px' }}>Mức độ</th>
            <th>Câu hỏi</th>
          </tr>
        </thead>
        <tbody>
          {filteredQuestions.map((q, index) => (
            <tr key={q.id}>
              <td style={{ textAlign: 'center' }}>{index + 1}</td>
              <td>{q.topic}</td>
              <td>{LEVELS[q.level]}</td>
              <td>
                <Link to={`/questions/${q.id}`}>{q.question}</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default QuestionBank;

