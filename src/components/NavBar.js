import React from 'react';
import { NavLink } from 'react-router-dom';

const NavBar = () => {
  const getLinkStyle = ({ isActive }) => ({
    color: isActive ? 'blue' : '#333',
    textDecoration: isActive ? 'underline' : 'none',
    fontWeight: isActive ? '600' : 'normal',
  });

  return (
    <nav className="navbar">
      <NavLink to="/" end style={getLinkStyle} className="nav-item">
        Trang chủ
      </NavLink>
      <NavLink to="/questions" style={getLinkStyle} className="nav-item">
        Ngân hàng câu hỏi
      </NavLink>
      <NavLink to="/history" style={getLinkStyle} className="nav-item">
        Lịch sử
      </NavLink>
    </nav>
  );
};

export default NavBar;

