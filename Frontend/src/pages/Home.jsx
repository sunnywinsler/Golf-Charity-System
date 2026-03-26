import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Trophy, Heart, Target } from "lucide-react";

const Home = () => {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center text-center py-12">
      
      {/* Badge */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8 px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm"
      >
        <span className="text-sm font-medium text-gray-300 flex items-center justify-center gap-2">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-primary-500"></span>
          </span>
          The leading platform for golf and charity
        </span>
      </motion.div>

      {/* Hero Headline */}
      <motion.h1 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight max-w-4xl"
      >
        Play Your Best. <br />
        <span className="gradient-text">Give Back Bigger.</span>
      </motion.h1>

      {/* Subheadline */}
      <motion.p 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="text-lg md:text-xl text-gray-400 mb-10 max-w-2xl"
      >
        Track your golf scores, enter monthly draws, and support your favorite charities — all in one premium platform built for heroes.
      </motion.p>

      {/* CTA Buttons */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="flex flex-col sm:flex-row gap-4 mb-20"
      >
        <Link to="/subscription">
          <button className="px-8 py-4 rounded-xl bg-primary-600 hover:bg-primary-500 text-white font-bold text-lg transition-all transform hover:scale-105 shadow-[0_0_20px_rgba(124,58,237,0.4)] flex items-center justify-center gap-2">
            Get Started <ArrowRight size={20} />
          </button>
        </Link>
        <Link to="/dashboard">
          <button className="glass-button px-8 py-4 font-bold text-lg">
            View Dashboard
          </button>
        </Link>
      </motion.div>

      {/* Feature highlight cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl">
        <FeatureCard 
          delay={0.4}
          icon={<Target className="text-primary-400" size={32} />}
          title="Track Scores"
          desc="Log your golf scores and monitor your handicap over time."
        />
        <FeatureCard 
          delay={0.5}
          icon={<Trophy className="text-yellow-400" size={32} />}
          title="Win Prizes"
          desc="Enter our monthly draws to win exclusive gaming and golf gear."
        />
        <FeatureCard 
          delay={0.6}
          icon={<Heart className="text-secondary-400" size={32} />}
          title="Support Charity"
          desc="A portion of every subscription goes directly to a charity of your choice."
        />
      </div>

    </div>
  );
};

const FeatureCard = ({ icon, title, desc, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
    className="glass-card p-6 flex flex-col items-center text-center hover:-translate-y-2 transition-transform duration-300"
  >
    <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-4 shadow-inner border border-white/10">
      {icon}
    </div>
    <h3 className="text-xl font-bold mb-2 text-white">{title}</h3>
    <p className="text-gray-400">{desc}</p>
  </motion.div>
);

export default Home;