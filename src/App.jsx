import React, { useState } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FolderOpen, 
  ClipboardList, 
  Settings, 
  LogOut,
  ChevronLeft,
  ChevronRight,
  User,
  Bell,
  Search,
  Menu
} from 'lucide-react';
import Dashboard from './components/Dashboard';
import Categories from './components/Categories';
import Biomarkers from './components/Biomarkers';
import Login from './components/Login';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const location = useLocation();

  // if (!isAuthenticated) {
  //   return <Login onLogin={() => setIsAuthenticated(true)} />;
  // }

  const navItems = [
    { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/categories', icon: FolderOpen, label: 'Categories' },
    { path: '/biomarkers', icon: ClipboardList, label: 'Biomarkers' },
    { path: '/settings', icon: Settings, label: 'Settings' }
  ];

  const closeMobileSidebar = () => setIsMobileSidebarOpen(false);

  return (
    <div className="h-screen flex bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Mobile Sidebar Overlay */}
      {isMobileSidebarOpen && (
        <div 
          className="fixed inset-0 bg-gray-800/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={closeMobileSidebar}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`fixed lg:static inset-y-0 left-0 z-50 glass flex flex-col
          transition-all duration-300 
          ${isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          ${isSidebarCollapsed ? 'w-20' : 'w-72'} 
          border-r border-white/20`}
      >
        <div className="h-20 flex items-center px-6">
          <div className="icon-wrapper">
            <Menu className="h-6 w-6" />
          </div>
          {!isSidebarCollapsed && (
            <span className="ml-3 text-xl font-semibold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
              ChronoKey
            </span>
          )}
          <button 
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className="ml-auto btn btn-light p-2 !rounded-lg hidden lg:block"
          >
            {isSidebarCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>
          <button
            onClick={closeMobileSidebar}
            className="ml-auto btn btn-light p-2 !rounded-lg lg:hidden"
          >
            <ChevronLeft size={18} />
          </button>
        </div>

        <nav className="flex-1 px-4 py-6">
          {navItems.map(({ path, icon: Icon, label }) => (
            <Link
              key={path}
              to={path}
              onClick={closeMobileSidebar}
              className={`w-full flex items-center p-3 mb-3 nav-item ${
                location.pathname === path ? 'active' : ''
              }`}
            >
              <Icon size={20} />
              {!isSidebarCollapsed && (
                <span className="ml-3 font-medium">{label}</span>
              )}
            </Link>
          ))}
        </nav>

        <div className="p-4 mt-auto">
          <button 
            onClick={() => setIsAuthenticated(false)}
            className="w-full btn btn-light flex items-center justify-center gap-2"
          >
            <LogOut size={18} />
            {!isSidebarCollapsed && <span>Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navigation */}
        <header className="h-20 glass border-b border-white/20">
          <div className="h-full px-4 md:px-8 flex items-center justify-between">
            <div className="flex items-center gap-4 md:gap-8 flex-1">
              <button
                onClick={() => setIsMobileSidebarOpen(true)}
                className="btn btn-light !p-2.5 lg:hidden"
              >
                <Menu size={20} />
              </button>
              <h1 className="text-xl md:text-2xl font-semibold text-gray-800">
                {navItems.find(item => item.path === location.pathname)?.label || 'Dashboard'}
              </h1>
              {/* <div className="hidden md:block max-w-md w-full relative">
                <Search className="search-icon" size={20} />
                <input
                  type="text"
                  placeholder="Search..."
                  className="search-input"
                />
              </div> */}
            </div>
            <div className="flex items-center gap-4 md:gap-6">
              <button className="btn btn-light !p-2.5">
                <Bell size={20} />
              </button>
              <div className="relative">
                <button 
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-3 p-2 rounded-xl hover:bg-gray-50/80 transition-colors"
                >
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-100 to-blue-50 flex items-center justify-center border border-blue-200/50">
                    <User size={20} className="text-blue-600" />
                  </div>
                  <div className="hidden md:block text-left">
                    <p className="text-sm font-medium text-gray-700">Admin User</p>
                    <p className="text-xs text-gray-500">admin@chronokey.com</p>
                  </div>
                </button>
                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-56 glass rounded-xl py-2 z-10 animate-fade-in">
                    <button 
                      onClick={() => setIsAuthenticated(false)}
                      className="w-full flex items-center px-4 py-2.5 text-gray-700 hover:bg-gray-50/80 transition-colors"
                    >
                      <LogOut size={18} className="mr-3" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto">
          <div className="animate-slide-in p-6">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/categories" element={<Categories />} />
              <Route path="/biomarkers" element={<Biomarkers />} />
              <Route path="/settings" element={<div>Settings Page</div>} />
            </Routes>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
