import { Navigate, Outlet, Link, useLocation } from 'react-router-dom';
import { useStore } from '../../store';
import { LayoutDashboard, Users, FolderKanban, Settings, LogOut } from 'lucide-react';
import { cn } from '../../utils/cn';

export default function AdminLayout() {
  const isAdminAuth = useStore(state => state.isAdminAuth);
  const logout = useStore(state => state.logout);
  const location = useLocation();

  if (!isAdminAuth) {
    return <Navigate to="/admin/login" />;
  }

  const links = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { name: 'Return to Site', path: '/', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-dark-950 flex">
      {/* Sidebar */}
      <aside className="w-64 border-r border-white/5 bg-dark-900 p-6 flex flex-col">
        <div className="mb-12">
          <h2 className="font-display text-2xl text-gradient-gold">JPN Admin</h2>
        </div>
        
        <nav className="flex-1 space-y-2">
          {links.map((link) => {
            const Icon = link.icon;
            const active = location.pathname === link.path;
            return (
              <Link
                key={link.name}
                to={link.path}
                className={cn(
                  "flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors",
                  active ? "bg-gold-600/10 text-gold-500" : "text-gray-400 hover:bg-white/5 hover:text-white"
                )}
              >
                <Icon size={20} />
                <span>{link.name}</span>
              </Link>
            )
          })}
        </nav>

        <button 
          onClick={logout}
          className="flex items-center space-x-3 px-4 py-3 text-red-400 hover:bg-red-400/10 rounded-lg transition-colors mt-auto"
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="p-10">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
