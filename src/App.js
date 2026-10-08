import React, { useState } from 'react';
import './App.css';
import StudentList from './components/StudentList';

const sampleStudents = [
  { id: 1, name: 'Nguyễn Văn An', score: 8.5, class: 'D25CQCC02-B' },
  { id: 2, name: 'Trần Thị Mai', score: 4.2, class: 'D25CQCC02-B' },
  { id: 3, name: 'Lê Hoàng Long', score: 7.0, class: 'D25CQCC02-B' },
  { id: 4, name: 'Phạm Minh Đức', score: 9.2, class: 'D25CQCC02-B' },
];

const App = () => {
  const [students, setStudents] = useState(sampleStudents);
  const [filterType, setFilterType] = useState('ALL');
  const [formData, setFormData] = useState({
    name: '',
    score: '',
    className: '',
  });
  const [errorMessage, setErrorMessage] = useState('');

  const { name, score, className } = formData;

  const handleInputChange = (e) => {
    const { name: fieldName, value } = e.target;
    setFormData({
      ...formData,
      [fieldName]: value,
    });
  };

  const handleAddStudent = (e) => {
    e.preventDefault();

    if (!name.trim() || !className.trim() || score.trim() === '') {
      setErrorMessage('Vui lòng nhập đầy đủ thông tin: Họ tên, Điểm số và Lớp!');
      return;
    }

    const numericScore = Number(score);
    if (isNaN(numericScore) || numericScore < 0 || numericScore > 10) {
      setErrorMessage('Điểm số không hợp lệ! Vui lòng nhập số từ 0 đến 10.');
      return;
    }

    const newStudent = {
      id: Date.now(),
      name: name.trim(),
      score: numericScore,
      class: className.trim(),
    };

    setStudents([...students, newStudent]);
    setFormData({ name: '', score: '', className: '' });
    setErrorMessage('');
  };

  const handleDeleteStudent = (id) => {
    const updatedList = students.filter((student) => student.id !== id);
    setStudents(updatedList);
  };

  const filteredStudents = students.filter((student) => {
    if (filterType === 'EXCELLENT') {
      return student.score >= 8;
    }
    if (filterType === 'FAILED') {
      return student.score < 5;
    }
    return true;
  });

  const totalStudents = students.length;
  const totalScore = students.reduce((acc, student) => acc + student.score, 0);
  const averageScore = totalStudents > 0 ? (totalScore / totalStudents).toFixed(2) : '0.00';

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Quản Lý Điểm Sinh Viên</h1>
      </header>

      <section className="stats-grid">
        <div className="stat-card">
          <div className="stat-label">Tổng số sinh viên</div>
          <div className="stat-value">{`${totalStudents} sinh viên`}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Điểm trung bình lớp</div>
          <div className="stat-value">{`${averageScore} / 10`}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Đang hiển thị</div>
          <div className="stat-value">{`${filteredStudents.length} kết quả`}</div>
        </div>
      </section>

      <section className="card-section">
        <h2>Thêm sinh viên mới</h2>
        {errorMessage && <div className="alert-error">{errorMessage}</div>}
        <form onSubmit={handleAddStudent} className="student-form">
          <div className="form-group">
            <label htmlFor="name">Họ và tên</label>
            <input
              id="name"
              name="name"
              type="text"
              placeholder="VD: Nguyễn Văn A"
              value={name}
              onChange={handleInputChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="className">Lớp</label>
            <input
              id="className"
              name="className"
              type="text"
              placeholder="VD: D25CQCC02-B"
              value={className}
              onChange={handleInputChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="score">Điểm số</label>
            <input
              id="score"
              name="score"
              type="number"
              step="0.1"
              min="0"
              max="10"
              placeholder="0 - 10"
              value={score}
              onChange={handleInputChange}
            />
          </div>

          <div className="form-action">
            <button type="submit" className="btn-primary">
              Thêm sinh viên
            </button>
          </div>
        </form>
      </section>

      <section className="card-section">
        <div className="list-header">
          <h2>Danh sách sinh viên</h2>
          <div className="filter-group">
            <span className="filter-label">Bộ lọc:</span>
            <button
              type="button"
              className={`btn-filter ${filterType === 'ALL' ? 'active' : ''}`}
              onClick={() => setFilterType('ALL')}
            >
              Tất cả
            </button>
            <button
              type="button"
              className={`btn-filter ${filterType === 'EXCELLENT' ? 'active' : ''}`}
              onClick={() => setFilterType('EXCELLENT')}
            >
              Giỏi (≥ 8)
            </button>
            <button
              type="button"
              className={`btn-filter ${filterType === 'FAILED' ? 'active' : ''}`}
              onClick={() => setFilterType('FAILED')}
            >
              Trượt môn (&lt; 5)
            </button>
          </div>
        </div>

        <StudentList
          students={filteredStudents}
          onDelete={handleDeleteStudent}
        />
      </section>
    </div>
  );
};

export default App;
