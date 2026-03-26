import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Trophy, LayoutDashboard, Target, Heart, CreditCard, LogOut } from "lucide-react";
import useAuthStore from "../store/useAuthStore";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate("/auth");
  };

  const navLinks = [
    { name: "Home", path: "/", icon: <Trophy size={18} /> },
    { name: "Dashboard", path: "/dashboard", icon: <LayoutDashboard size={18} /> },
    { name: "Scores", path: "/scores", icon: <Target size={18} /> },
    { name: "Charity", path: "/charities", icon: <Heart size={18} /> },
    { name: "Plan", path: "/subscription", icon: <CreditCard size={18} /> },
  ];

  return (
    <header className="fixed top-0 w-full z-50 px-4 sm:px-6 py-4 flex justify-between items-center glass-panel">
      <Link to="/" className="flex items-center gap-3 group">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center text-white font-bold text-xl shadow-lg group-hover:shadow-primary-500/50 transition-all duration-300">
          H
        </div>
        <h1 className="text-xl font-extrabold tracking-tight text-white hidden md:block">
          Digital<span className="text-primary-400">Heros</span>
        </h1>
      </Link>

      <nav className="flex gap-1 sm:gap-2 bg-dark-800/80 p-1.5 rounded-2xl border border-white/10 backdrop-blur-xl shadow-lg">
        {navLinks.map((link) => {
          const isActive = location.pathname === link.path;
          return (
            <Link
              key={link.name}
              to={link.path}
              className={`relative flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl transition-colors duration-300 ${
                isActive ? "text-white" : "text-gray-400 hover:text-white"
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="nav-pill"
                  className="absolute inset-0 bg-white/10 rounded-xl border border-white/5"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              <span className="relative z-10 flex items-center gap-2">
                {link.icon}
                <span className="hidden lg:block text-sm font-semibold">{link.name}</span>
              </span>
            </Link>
          );
        })}
      </nav>
      
      <div className="flex items-center gap-3">
        {user ? (
          <div className="flex items-center gap-3">
            <span className="hidden md:block text-white text-sm font-medium">{user.full_name || user.email}</span>
            <div className="w-10 h-10 rounded-full bg-dark-700 border border-white/10 overflow-hidden hover:scale-105 transition-transform cursor-pointer">
              <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`} alt="Avatar" className="w-full h-full object-cover" />
            </div>
            <button 
              onClick={handleLogout}
              className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition group"
              title="Logout"
            >
              <LogOut size={18} />
            </button>
          </div>
        ) : (
          <Link 
            to="/auth" 
            className="px-6 py-2 bg-primary-600 text-white rounded-xl font-bold hover:bg-primary-500 transition shadow-lg shadow-primary-600/20"
          >
            Login
          </Link>
        )}
      </div>
    </header>
  );
};

export default Navbar;