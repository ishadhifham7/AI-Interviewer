import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext'; 

const RegisterForm: React.FC = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  
  // Initialize useAuth hook
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // We log the data to satisfy the linter until you add your fetch/axios call
    console.log("Registering user:", formData.name, formData.email);
    
    // TODO: Add API call here
    // const { login } = useAuth();
    // login(response.data.token, response.data.user);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#09090b] text-white p-4 overflow-hidden relative">
      {/* Background Glow */}
      <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="relative z-10 w-full max-w-md p-8 bg-white/5 border border-white/10 backdrop-blur-2xl rounded-3xl shadow-2xl">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold bg-gradient-to-b from-white to-gray-500 bg-clip-text text-transparent">
            Create Account
          </h2>
          <p className="text-gray-400 mt-2">Start your journey with Gemma 4</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs uppercase tracking-widest text-gray-500 font-semibold mb-2 ml-1">Full Name</label>
            <input 
              type="text" 
              required
              className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500/50 outline-none transition-all"
              placeholder="John Doe"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-widest text-gray-500 font-semibold mb-2 ml-1">Email</label>
            <input 
              type="email" 
              required
              className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500/50 outline-none transition-all"
              placeholder="name@example.com"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-widest text-gray-500 font-semibold mb-2 ml-1">Password</label>
            <input 
              type="password" 
              required
              className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500/50 outline-none transition-all"
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
            />
          </div>

          <button 
            type="submit"
            className="w-full bg-white text-black font-bold py-3 rounded-xl hover:bg-gray-200 transition-all active:scale-95 mt-4 shadow-lg shadow-white/5"
          >
            Get Started
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-500">
          Already have an account? <a href="/login" className="text-indigo-400 hover:underline">Sign in</a>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;
