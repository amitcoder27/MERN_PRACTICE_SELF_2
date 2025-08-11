import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';

const Layout = () => {
  return (
    <div>
      <nav style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginBottom: '1rem' }}>
        <NavLink to="/" style={{ color: 'purple' }}>
          Home
        </NavLink>
        <NavLink to="/register" style={{ color: 'purple' }}>
          Register
        </NavLink>
        <NavLink to="/login" style={{ color: 'purple' }}>
          Login
        </NavLink>
         <NavLink to="/details" style={{ color: 'purple' }}>
          Details
        </NavLink>
      </nav>

      <p style={{ textAlign: 'center', color: 'white' }}>Welcome to Mern Series</p>

      {/* Render the page-specific content */}
      <Outlet />
    </div>
  );
};

export default Layout;
