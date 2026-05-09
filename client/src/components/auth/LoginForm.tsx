import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext'; 
import api from '../../lib/axios';
import { useNavigate } from 'react-router-dom';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [error, setError] = useState<string | null>(null);
  
  // This is where the error usually hides. 
  // By using the Capitalized 'LoginForm' above, this becomes valid.
  const { login } = useAuth(); 
  const navigate = useNavigate();


 const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); 
    
    try {
  const response = await api.post('/auth/login', { email, password });
  login(response.data.token, response.data.user);

  navigate('/dashboard'); // This sends the user to the dashboard!
} catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Login failed.";
      setError(message);
    }
  };
return (
  <div className="min-h-screen flex items-center justify-center bg-[#09090b] text-white p-4">
    {/* The main card with a subtle border and shadow */}
    <form 
      onSubmit={handleSubmit} 
      className="p-8 bg-[#18181b] rounded-2xl border border-white/10 w-full max-w-md shadow-2xl transition-all"
    >
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold tracking-tight">Welcome Back</h2>
        <p className="text-gray-400 mt-2 text-sm">Enter your credentials to access the AI Interviewer</p>
      </div>

      {/* Error Message with a 'soft' red background */}
      {error && (
        <div className="mb-6 p-3 bg-red-500/10 border border-red-500/50 text-red-500 rounded-lg text-xs text-center animate-pulse">
          {error}
        </div>
      )}

      <div className="space-y-5">
        <div>
          <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">Email Address</label>
          <input 
            type="email" 
            placeholder="name@company.com" 
            className="w-full p-3 bg-black/50 rounded-xl border border-white/10 focus:border-white/30 focus:ring-1 focus:ring-white/30 transition-all outline-none text-sm placeholder:text-gray-600"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">Password</label>
          <input 
            type="password" 
            placeholder="••••••••" 
            className="w-full p-3 bg-black/50 rounded-xl border border-white/10 focus:border-white/30 focus:ring-1 focus:ring-white/30 transition-all outline-none text-sm placeholder:text-gray-600"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button 
          type="submit"
          className="w-full bg-white text-black font-bold py-3 rounded-xl hover:bg-gray-200 active:scale-[0.98] transition-all shadow-lg mt-4"
        >
          Sign In
        </button>

        <p className="text-center text-gray-500 text-xs mt-6">
          Don't have an account? <span className="text-white cursor-pointer hover:underline">Request Access</span>
        </p>
      </div>
    </form>
  </div>
);
};
export default LoginForm;