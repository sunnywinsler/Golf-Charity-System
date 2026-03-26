import { useState } from "react";
import api from "../services/api";
import useAuthStore from "../store/useAuthStore";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, User, ArrowRight, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const navigate = useNavigate();
  const setAuth = useAuthStore(state => state.setAuth);

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isLogin) {
        const res = await api.post("/auth/login", { email, password });
        setAuth(res.data, res.data.token);
        navigate("/dashboard");
      } else {
        const res = await api.post("/auth/signup", { 
          email, 
          password, 
          full_name: fullName 
        });
        // Auto-login after signup
        setAuth(res.data, res.data.token);
        navigate("/dashboard");
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto mt-20 relative px-4">
      {/* Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary-600/20 blur-[100px] rounded-full pointer-events-none"></div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-8 rounded-3xl relative z-10"
      >
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">
            {isLogin ? "Welcome Back" : "Join the Club"}
          </h2>
          <p className="text-gray-400 text-sm">
            {isLogin ? "Sign in to track your scores and win." : "Start tracking your handicap and supporting charities today."}
          </p>
        </div>

        <AnimatePresence mode="wait">
          {error && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm p-3 rounded-xl mb-6 text-center"
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleAuth} className="space-y-4">
          <AnimatePresence>
            {!isLogin && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
              >
                <div className="relative">
                  <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input 
                    type="text" 
                    placeholder="Full Name" 
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full bg-dark-900 border border-white/10 p-3 pl-11 rounded-xl text-white outline-none focus:border-primary-500 transition"
                    required={!isLogin}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="relative">
            <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="email" 
              placeholder="Email Address" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-dark-900 border border-white/10 p-3 pl-11 rounded-xl text-white outline-none focus:border-primary-500 transition"
              required 
            />
          </div>

          <div className="relative">
            <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="password" 
              placeholder="Password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-dark-900 border border-white/10 p-3 pl-11 rounded-xl text-white outline-none focus:border-primary-500 transition"
              required 
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-gradient-to-r from-primary-600 to-secondary-600 p-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:opacity-90 transition shadow-lg shadow-primary-600/20 disabled:opacity-50 mt-4 text-white"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : (
              <>
                {isLogin ? "Sign In" : "Create Account"}
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        <div className="mt-6 text-center text-gray-400 text-sm">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button 
            type="button" 
            onClick={() => { setIsLogin(!isLogin); setError(null); }}
            className="text-primary-400 font-bold hover:underline"
          >
            {isLogin ? "Sign Up" : "Log In"}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default Auth;
