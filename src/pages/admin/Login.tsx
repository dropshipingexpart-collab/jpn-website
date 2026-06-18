import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../../store';
import { X } from 'lucide-react';

export default function AdminLogin() {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const login = useStore(state => state.login);
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (login(username, password)) {
      navigate('/admin');
    } else {
      setError(true);
    }
  };

  return (
    <div className="min-h-screen bg-dark-900 flex items-center justify-center relative overflow-hidden">
      {/* Decorative Gold Elements */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gold-600/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gold-500/5 rounded-full blur-3xl" />

      <form onSubmit={handleLogin} className="glass-panel-gold p-12 rounded-2xl relative z-10 w-full max-w-md">
        <button 
          type="button" 
          onClick={() => navigate('/')}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
        >
          <X size={24} />
        </button>
        <div className="text-center mb-8">
          <h1 className="font-display text-3xl text-gradient-gold mb-2">JPN Group Admin</h1>
          <p className="text-gray-400">Enter your credentials to access the CMS</p>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Username</label>
            <input 
              type="text" 
              value={username} 
              onChange={(e) => {
                setUsername(e.target.value);
                setError(false);
              }}
              className="w-full bg-dark-800 border border-gold-600/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-gold-500 transition-colors"
              placeholder="Enter username"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError(false);
              }}
              className="w-full bg-dark-800 border border-gold-600/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-gold-500 transition-colors"
              placeholder="Enter password"
            />
            {error && <p className="text-red-500 text-sm mt-2">Invalid username or password</p>}
          </div>

          <button 
            type="submit"
            className="w-full bg-gold-600 hover:bg-gold-500 text-dark-950 font-bold py-3 rounded-lg transition-colors"
          >
            Access Dashboard
          </button>
        </div>
      </form>
    </div>
  );
}
