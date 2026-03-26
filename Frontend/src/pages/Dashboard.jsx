import { Link } from "react-router-dom";
import useAuthStore from "../store/useAuthStore";
import { motion } from "framer-motion";
import { 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart 
} from "recharts";
import { Trophy, Target, Heart, CreditCard, Activity, ArrowUpRight } from "lucide-react";

const Dashboard = () => {
  const { subscription, scores, charity } = useAuthStore();

  const chartData = scores.map((s, index) => ({
    name: s.date || `Round ${index + 1}`,
    score: parseInt(s.value, 10) || 0,
  }));

  const containerVars = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  return (
    <div className="w-full">
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold mb-2">
            Welcome back, <span className="gradient-text">Hero</span>
          </h1>
          <p className="text-gray-400">Here's what's happening with your account today.</p>
        </div>
        
        <div className="flex gap-3">
          <Link to="/scores" className="glass-button px-4 py-2 text-sm font-semibold bg-primary-600/20 text-primary-400 border-primary-500/30 hover:bg-primary-600/40">
            <Target size={16} /> Add Score
          </Link>
          <Link to="/charities" className="glass-button px-4 py-2 text-sm font-semibold">
            <Heart size={16} className="text-secondary-400" /> Impact
          </Link>
        </div>
      </div>

      <motion.div 
        variants={containerVars}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
      >
        <StatCard 
          icon={<CreditCard className="text-primary-400" size={24} />}
          label="Active Plan"
          value={subscription || "Free Tier"}
          trend="+ Premium Features"
        />
        <StatCard 
          icon={<Heart className="text-secondary-400" size={24} />}
          label="Supported Charity"
          value={charity || "None Selected"}
          trend="Make an impact"
        />
        <StatCard 
          icon={<Target className="text-blue-400" size={24} />}
          label="Total Rounds"
          value={scores.length}
          trend="+1 this week"
        />
        <StatCard 
          icon={<Trophy className="text-yellow-400" size={24} />}
          label="Avg Score"
          value={
            scores.length > 0
              ? Math.round(scores.reduce((a, b) => a + (parseInt(b.value, 10) || 0), 0) / scores.length)
              : "--"
          }
          trend="-2 strokes"
        />
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Chart */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="lg:col-span-2 glass-card p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Activity className="text-primary-400" /> Score History
            </h2>
          </div>
          
          <div className="h-[300px] w-full">
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                  <XAxis dataKey="name" stroke="#ffffff50" tick={{ fill: '#ffffff50', fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis stroke="#ffffff50" tick={{ fill: '#ffffff50', fontSize: 12 }} axisLine={false} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0a0a0a', borderColor: '#ffffff20', borderRadius: '12px' }}
                    itemStyle={{ color: '#fff' }}
                  />
                  <Area type="monotone" dataKey="score" stroke="#8b5cf6" strokeWidth={3} fillOpacity={1} fill="url(#colorScore)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-gray-500">
                <Target size={48} className="mb-4 opacity-20" />
                <p>No scores logged yet. Start playing!</p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Recent Activity / Scores List */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="glass-card p-6 flex flex-col"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Trophy className="text-yellow-400" /> Recent Rounds
            </h2>
            <Link to="/scores" className="text-sm text-primary-400 hover:text-primary-300 flex items-center">
              View All <ArrowUpRight size={16} />
            </Link>
          </div>

          <div className="flex-grow overflow-y-auto pr-2 space-y-4">
            {scores.length === 0 ? (
              <p className="text-gray-500 text-center mt-10">No recent activity.</p>
            ) : (
              scores
                .slice()
                .reverse()
                .slice(0, 5)
                .map((score, i) => (
                  <div
                    key={i}
                    className="flex justify-between items-center p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors"
                  >
                    <div>
                      <p className="font-bold text-lg">{score.value}</p>
                      <p className="text-xs text-gray-400">{score.date || "Just now"}</p>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-primary-500/20 text-primary-400 flex items-center justify-center font-bold text-sm">
                      {String(score.value).slice(0, 1) || "T"}
                    </div>
                  </div>
                ))
            )}
          </div>
        </motion.div>

      </div>
    </div>
  );
};

const StatCard = ({ icon, label, value, trend }) => (
  <motion.div 
    variants={{
      hidden: { opacity: 0, y: 20 },
      show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
    }}
    className="glass-card p-5 relative overflow-hidden group hover:border-primary-500/50 transition-colors duration-500"
  >
    <div className="absolute -right-6 -top-6 w-24 h-24 bg-white/5 rounded-full blur-2xl group-hover:bg-primary-500/20 transition-colors duration-500"></div>
    <div className="flex justify-between items-start mb-4 relative z-10">
      <div className="p-2 rounded-xl bg-white/5 backdrop-blur-md border border-white/10">
        {icon}
      </div>
      <span className="text-xs font-medium text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-md">
        {trend}
      </span>
    </div>
    <div className="relative z-10">
      <h3 className="text-sm font-medium text-gray-400 mb-1">{label}</h3>
      <p className="text-2xl font-bold text-white truncate">{value}</p>
    </div>
  </motion.div>
);

export default Dashboard;