import { useState } from "react";
import useAuthStore from "../store/useAuthStore";
import api from "../services/api";
import { motion } from "framer-motion";
import { Target, Trophy, Clock, CheckCircle2, AlertCircle } from "lucide-react";

const Scores = () => {
  const [newScore, setNewScore] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const scores = useAuthStore((state) => state.scores);
  const setScoresGlobal = useAuthStore((state) => state.setScores);

  const addScore = async (e) => {
    e.preventDefault();
    const scoreValue = Number(newScore);

    if (!scoreValue) return;

    if (scoreValue < 1 || scoreValue > 150) {
      setMessage({ type: "error", text: "Score must be between 1 and 150 (Stableford/Gross)." });
      return;
    }

    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const res = await api.post("/scores/add", {
        value: scoreValue,
      });

      setScoresGlobal(res.data);
      setNewScore("");
      setMessage({ type: "success", text: "Score successfully added!" });
      
      setTimeout(() => setMessage({ type: "", text: "" }), 3000);
    } catch (error) {
      console.error(error);
      setMessage({ type: "error", text: "Error saving score. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-extrabold mb-2 flex items-center gap-3">
          <Target className="text-primary-400" size={36} /> Log a <span className="gradient-text">Score</span>
        </h1>
        <p className="text-gray-400">Record your latest round to update your handicap and enter the monthly draw.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Entry Form */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="glass-card p-6 md:p-8 relative overflow-hidden h-fit"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/10 rounded-full blur-3xl"></div>
          
          <h2 className="text-2xl font-bold mb-6 text-white relative z-10">New Round</h2>
          
          <form onSubmit={addScore} className="relative z-10 flex flex-col gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Total Score (Stableford/Points)</label>
              <div className="relative">
                <input
                  type="number"
                  value={newScore}
                  onChange={(e) => setNewScore(e.target.value)}
                  placeholder="e.g. 36"
                  className="w-full bg-dark-800/50 border border-white/10 rounded-xl px-4 py-4 text-white placeholder-gray-600 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all text-xl"
                />
                <Trophy className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
              </div>
            </div>

            {message.text && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                className={`flex items-center gap-2 p-3 rounded-lg text-sm font-medium ${
                  message.type === 'error' ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-green-500/10 text-green-400 border border-green-500/20'
                }`}
              >
                {message.type === 'error' ? <AlertCircle size={16} /> : <CheckCircle2 size={16} />}
                {message.text}
              </motion.div>
            )}

            <button 
              type="submit" 
              disabled={loading || !newScore}
              className="w-full bg-primary-600 hover:bg-primary-500 disabled:bg-primary-600/50 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl transition-all shadow-[0_4px_14px_0_rgba(124,58,237,0.39)] hover:shadow-[0_6px_20px_rgba(124,58,237,0.23)] hover:-translate-y-0.5"
            >
              {loading ? "Saving..." : "Submit Score"}
            </button>
          </form>
        </motion.div>

        {/* History */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="glass-card p-6 md:p-8"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Clock className="text-secondary-400" /> Score History
            </h2>
            <span className="text-sm text-gray-400">{scores.length} total</span>
          </div>

          <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
            {scores.length === 0 ? (
              <div className="text-center py-10 text-gray-500 flex flex-col items-center">
                <Target size={40} className="mb-3 opacity-20" />
                <p>No scores yet. <br/> Your history will appear here.</p>
              </div>
            ) : (
              scores
                .slice()
                .reverse()
                .map((score, i) => (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    key={i} 
                    className="flex justify-between items-center p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-dark-700 flex items-center justify-center font-bold text-lg text-white">
                        {score.value}
                      </div>
                      <div>
                        <p className="font-semibold text-white">Points/Score</p>
                        <p className="text-xs text-gray-400">{score.date || "Just now"}</p>
                      </div>
                    </div>
                    {i === 0 && <span className="text-xs bg-primary-500/20 text-primary-400 px-2 py-1 rounded">Latest</span>}
                  </motion.div>
                ))
            )}
          </div>
        </motion.div>

      </div>
    </div>
  );
};

export default Scores;