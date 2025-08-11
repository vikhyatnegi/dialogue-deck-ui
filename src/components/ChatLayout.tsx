import { useState } from "react";
import { Sidebar } from "./Sidebar";
import { ChatInterface } from "./ChatInterface";

export const ChatLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="h-screen flex bg-background overflow-hidden">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:ml-0">
        <ChatInterface onMenuClick={toggleSidebar} />
      </div>
    </div>
  );
};