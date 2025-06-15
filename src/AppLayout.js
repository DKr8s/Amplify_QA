import React from 'react';
import { Outlet } from 'react-router-dom';

export default function AppLayout({ user, signOut }) {
  return (
    <div style={{ padding: 20 }}>
      <h2>Xin chào, {user?.username}</h2>
      <button onClick={signOut}>Đăng xuất</button>
      <hr />
      <Outlet />
    </div>
  );
}
