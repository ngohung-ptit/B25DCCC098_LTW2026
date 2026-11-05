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

      <div className="filters-container">
        <div>
          <label htmlFor="topic-select" style={{ marginRight: '8px', fontSize: '14.5px', fontWeight: '500' }}>
            Chủ đề:
          </label>
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
          <label htmlFor="search-input" style={{ marginRight: '8px', fontSize: '14.5px', fontWeight: '500' }}>
            Tìm kiếm:
          </label>
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

      <div className="table-wrapper">
        <table className="question-table">
          <thead>
            <tr>
              <th style={{ width: '64px', textAlign: 'center' }}>STT</th>
              <th style={{ width: '130px' }}>Chủ đề</th>
              <th style={{ width: '130px' }}>Mức độ</th>
              <th>Câu hỏi</th>
            </tr>
          </thead>
          <tbody>
            {filteredQuestions.map((q, index) => (
              <tr key={q.id}>
                <td style={{ textAlign: 'center', color: '#64748b' }}>{index + 1}</td>
                <td style={{ fontWeight: '500' }}>{q.topic}</td>
                <td>{LEVELS[q.level]}</td>
                <td>
                  <Link to={`/questions/${q.id}`}>{q.question}</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default QuestionBank;
