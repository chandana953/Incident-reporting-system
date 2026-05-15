import React from 'react';
import Sidebar from './Sidebar';
import Widgets from './Widgets';
import MobileNav from './MobileNav';

const MainLayout = ({ children }) => {
  return (
    <div className="feed-container pb-24 lg:pb-0">
      <aside className="left-sidebar">
        <Sidebar />
      </aside>
      
      <main className="main-content">
        {children}
      </main>
      
      <aside className="right-sidebar">
        <Widgets />
      </aside>

      <MobileNav />
    </div>
  );
};

export default MainLayout;
