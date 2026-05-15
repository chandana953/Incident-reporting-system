import React from 'react';
import Sidebar from './Sidebar';
import Widgets from './Widgets';

const MainLayout = ({ children }) => {
  return (
    <div className="feed-container">
      <aside className="left-sidebar">
        <Sidebar />
      </aside>
      
      <main className="main-content">
        {children}
      </main>
      
      <aside className="right-sidebar">
        <Widgets />
      </aside>
    </div>
  );
};

export default MainLayout;
