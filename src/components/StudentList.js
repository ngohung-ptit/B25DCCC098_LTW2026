import React from 'react';
import StudentItem from './StudentItem';

const StudentList = ({ students, onDelete }) => {
  return (
    <div className="table-wrapper">
      <table className="student-table">
        <thead>
          <tr>
            <th>Mã SV</th>
            <th>Họ và Tên</th>
            <th>Lớp</th>
            <th>Điểm số</th>
            <th>Xếp loại</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {students.length === 0 ? (
            <tr>
              <td colSpan="6" className="empty-message">
                Không có sinh viên nào phù hợp.
              </td>
            </tr>
          ) : (
            students.map((student) => (
              <StudentItem
                key={student.id}
                student={student}
                onDelete={onDelete}
              />
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default StudentList;
