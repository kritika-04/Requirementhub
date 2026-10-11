import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
// import { 
//   Building2,
//   LayoutDashboard,
//   UploadCloud, 
//   Database, 
//   AlertTriangle, 
//   Plug, 
//   Search, 
//   LogOut, 
//   User, 
//   Plus 
// } from 'lucide-react';
import './dashboard.css'

export const DashboardLayout = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="dashboard-container">
      {/* Sidebar Navigation */}
      <aside className="sidebar">
        <div className="sidebar-brand">
          <div className="logo-icon">⚡</div>
          <span className="brand-name">Requirement Hub</span>
        </div>

        {/* Company Workspace Display */}
        <div className="workspace-selector">
          <label>Workspace</label>
          <div 
            className="workspace-dropdown" 
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              cursor: 'pointer',
              fontWeight: 600
            }}
            onClick={() => navigate('/company-overview')}
            title="View Company Overview"
          >
            <span style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: '#10b981',
              flexShrink: 0
            }} />
            <span style={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}>
              {user.company_name || 'My Workspace'}
            </span>
          </div>
        </div>

        {/* Main Nav Links */}
        <nav className="sidebar-nav">
          <NavLink 
            to="/company-overview" 
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          >
            {/* <Building2 size={18} /> */}
            <span>Company Overview</span>
          </NavLink>

          <NavLink 
            to="/dashboard" 
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          >
            {/* <LayoutDashboard size={18} /> */}
            <span>Dashboard</span>
          </NavLink>

          <NavLink 
            to="/ingest" 
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          >
            {/* <UploadCloud size={18} /> */}
            <span>Ingestion Hub</span>
          </NavLink>

          <NavLink 
            to="/repository" 
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          >
            {/* <Database size={18} /> */}
            <span>Repository</span>
            <span className="badge-count">142</span>
          </NavLink>

          <NavLink 
            to="/conflicts" 
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          >
            {/* <AlertTriangle size={18} /> */}
            <span>Conflicts</span>
            <span className="badge-alert">12</span>
          </NavLink>

          <NavLink 
            to="/integrations" 
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          >
            {/* <Plug size={18} /> */}
            <span>Integrations</span>
          </NavLink>
        </nav>

        {/* Sidebar Footer */}
        <div className="sidebar-footer">
          <div className="user-profile">
            {/* <User size={16} /> */}
            <span>{user.name || user.role || 'Dev Lead'}</span>
          </div>
          <button className="logout-btn" onClick={handleLogout} title="Logout">
            {/* <LogOut size={16} /> */}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="main-wrapper">
        {/* Top Header */}
        <header className="top-header">
          <div className="search-bar">
            {/* <Search size={16} className="search-icon" /> */}
            <input 
              type="text" 
              placeholder="Search requirements, transcripts, or conflicts... (Ctrl + K)" 
            />
          </div>

          <button className="btn-quick-ingest" onClick={() => navigate('/ingest')}>
            {/* <Plus size={16} /> */}
            <span>New Ingest</span>
          </button>
        </header>

        {/* Page Content Outlet */}
        <main className="page-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};