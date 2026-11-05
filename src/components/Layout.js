import React from 'react';
import { Outlet } from 'react-router-dom';
import NavBar from './NavBar';

const Layout = ({ loading, error }) => {
  return (
    <div className="layout">
      <NavBar />
      <main className="main-content">
        {loading ? (
          <div>Đang tải câu hỏi...</div>
        ) : error ? (
          <div>{error}</div>
        ) : (
          <Outlet />
        )}
      </main>
    </div>
  );
};

export default Layout;

