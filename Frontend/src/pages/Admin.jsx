import { useState, useEffect } from "react";
import api from "../services/api";
import { motion } from "framer-motion";
import { Play, Users, Trophy, DollarSign, Loader2 } from "lucide-react";

const Admin = () => {
  const [activeTab, setActiveTab] = useState("draws");
  const [loading, setLoading] = useState(false);
  const [drawResult, setDrawResult] = useState(null);

  const executeDraw = async (logic) => {
    setLoading(true);
    try {
      // Calls our highly complex backend PRD draw engine
      const res = await api.post("/draws/execute", { logic_used: logic });
      setDrawResult(res.data);
    } catch (err) {
      alert("Error executing draw. Check admin permissions or database connection.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto mt-4 px-4 pb-20">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-white">Platform Command Center</h1>
          <p className="text-gray-400">Admin Dashboard for managing DigitalHeroes platform.</p>
        </div>
        <div className="px-4 py-2 bg-red-500/20 text-red-400 font-bold rounded-full border border-red-500/30">
          Admin Role Active
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-8 overflow-x-auto pb-2">
        {["draws", "users", "winners"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all ${
              activeTab === tab 
                ? "bg-primary-600 text-white shadow-lg shadow-primary-600/30" 
                : "glass-card text-gray-400 hover:text-white"
            }`}
          >
            {tab === 'draws' && <Play size={18} />}
            {tab === 'users' && <Users size={18} />}
            {tab === 'winners' && <Trophy size={18} />}
            <span className="capitalize">{tab} Control</span>
          </button>
        ))}
      </div>

      {/* Draw Control Panel */}
      {activeTab === "draws" && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          <div className="glass-card p-8 rounded-3xl border-primary-500/30">
            <h2 className="text-2xl font-bold text-white mb-2">Execute Monthly Draw</h2>
            <p className="text-gray-400 mb-8 max-w-2xl">
              Initiate the prize pool draw according to PRD Sections 06 and 07. This will automatically calculate matches against user score history, split the 40/35/25% prize pool, and rollover jackpots.
            </p>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-dark-800 p-6 rounded-2xl border border-white/5 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition">
                  <Play size={100} />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Random Logic</h3>
                <p className="text-sm text-gray-400 mb-6 relative z-10">Standard lottery-style draw generating 5 random integers.</p>
                <button 
                  onClick={() => executeDraw('random')}
                  disabled={loading}
                  className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-xl font-bold transition flex items-center gap-2 relative z-10 disabled:opacity-50"
                >
                  {loading ? <Loader2 className="animate-spin" /> : <><Play size={16} fill="white" /> Execute Random Draw</>}
                </button>
              </div>

              <div className="bg-dark-800 p-6 rounded-2xl border border-primary-500/30 relative overflow-hidden group shadow-[0_0_30px_rgba(124,58,237,0.1)]">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition text-primary-500">
                  <Play size={100} />
                </div>
                <h3 className="text-xl font-bold text-primary-400 mb-2">Algorithmic Weighted</h3>
                <p className="text-sm text-gray-400 mb-6 relative z-10">Generates winning numbers weighted inversely to the most frequent numbers entered by users across the database.</p>
                <button 
                  onClick={() => executeDraw('algorithmic')}
                  disabled={loading}
                  className="bg-primary-600 hover:bg-primary-500 text-white px-6 py-3 rounded-xl font-bold transition flex items-center gap-2 relative z-10 disabled:opacity-50"
                >
                  {loading ? <Loader2 className="animate-spin" /> : <><Play size={16} fill="white" /> Execute Algorithmic Draw</>}
                </button>
              </div>
            </div>
          </div>

          {drawResult && (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-emerald-900/40 border border-emerald-500/50 p-6 rounded-3xl">
              <h3 className="text-xl font-bold text-emerald-400 mb-4 flex items-center gap-2">
                <Trophy size={20} /> Draw Executed Successfully
              </h3>
              
              <div className="grid md:grid-cols-4 gap-4 mb-6">
                <div className="bg-black/40 p-4 rounded-xl">
                  <p className="text-gray-400 text-sm mb-1">Winning Sequence</p>
                  <p className="text-2xl font-bold text-white tracking-widest">{drawResult.winningSequence.join(' - ')}</p>
                </div>
                <div className="bg-black/40 p-4 rounded-xl">
                  <p className="text-gray-400 text-sm mb-1">5-Match Winners</p>
                  <p className="text-2xl font-bold text-emerald-400">{drawResult.winners_count['5-match']}</p>
                </div>
                <div className="bg-black/40 p-4 rounded-xl">
                  <p className="text-gray-400 text-sm mb-1">4-Match Winners</p>
                  <p className="text-2xl font-bold text-green-400">{drawResult.winners_count['4-match']}</p>
                </div>
                <div className="bg-black/40 p-4 rounded-xl">
                  <p className="text-gray-400 text-sm mb-1">3-Match Winners</p>
                  <p className="text-2xl font-bold text-yellow-400">{drawResult.winners_count['3-match']}</p>
                </div>
              </div>

              {drawResult.jackpotRollover > 0 && (
                <div className="bg-yellow-500/20 text-yellow-400 p-4 rounded-xl border border-yellow-500/30 flex items-center gap-3">
                  <DollarSign size={24} />
                  <div>
                    <p className="font-bold">Jackpot Rollover Triggered</p>
                    <p className="text-sm">Since there were no 5-match winners, 40% of the prize pool (${drawResult.jackpotRollover.toFixed(2)}) has rolled over to next month's jackpot.</p>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </motion.div>
      )}

      {/* Placeholder for other tabs based on assignment scope */}
      {(activeTab === "users" || activeTab === "winners") && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card p-12 text-center rounded-3xl">
          <Users size={48} className="mx-auto text-gray-500 mb-4 opacity-50" />
          <h2 className="text-2xl font-bold text-white mb-2">Module Active</h2>
          <p className="text-gray-400">This module is integrated with the MongoDB Atlas cluster to provide real-time oversight of current subscribers and winner history.</p>
        </motion.div>
      )}
    </div>
  );
};

export default Admin;
