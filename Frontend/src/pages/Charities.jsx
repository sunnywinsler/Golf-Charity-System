import { useState } from "react";
import useAuthStore from "../store/useAuthStore";
import api from "../services/api";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Globe, Stethoscope, Droplet, ArrowRight, CheckCircle2 } from "lucide-react";

const Charities = () => {
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const setCharityGlobal = useAuthStore((state) => state.setCharity);
  const currentCharity = useAuthStore((state) => state.charity);

  const charities = [
    { 
      id: 1, 
      name: "Kids Global", 
      desc: "Providing education and healthcare for children in developing nations.",
      icon: <Globe size={32} /> ,
      color: "from-blue-500 to-cyan-400"
    },
    { 
      id: 2, 
      name: "Cancer Research Center", 
      desc: "Funding breakthrough treatments and supporting patients worldwide.",
      icon: <Stethoscope size={32} />,
      color: "from-pink-500 to-rose-400"
    },
    { 
      id: 3, 
      name: "Clean Water Initiative", 
      desc: "Building sustainable water systems for communities in need.",
      icon: <Droplet size={32} />,
      color: "from-teal-400 to-emerald-500"
    },
  ];

  const handleSelect = async () => {
    if (!selected) return;
    
    setLoading(true);
    try {
      const res = await api.post("/charity/set", {
        name: selected.name,
      });

      setCharityGlobal(res.data.charity);
      setMessage("Thank you! Your impact has been updated.");
      setSelected(null);
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      console.error(error);
      setMessage("Error selecting charity");
      setTimeout(() => setMessage(""), 3000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto pb-20 mt-4">
      <div className="mb-12 text-center max-w-2xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-16 h-16 mx-auto bg-primary-500/20 rounded-2xl flex items-center justify-center mb-6 text-primary-400"
        >
          <Heart size={32} className="animate-pulse" />
        </motion.div>
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
          Choose Your <span className="gradient-text">Impact</span>
        </h1>
        <p className="text-gray-400 text-lg">
          A portion of your subscription goes directly to a charity of your choice. 
          Currently supporting: <strong className="text-white">{currentCharity || "None selected yet"}</strong>.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {charities.map((charity, index) => {
          const isSelected = selected?.id === charity.id;
          const isCurrent = currentCharity === charity.name;
          
          return (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              key={charity.id}
              onClick={() => setSelected(charity)}
              className={`relative p-8 rounded-3xl cursor-pointer transition-all duration-300 transform ${
                isSelected 
                  ? "bg-dark-800 border-primary-500 shadow-[0_0_30px_rgba(124,58,237,0.3)] scale-[1.02]" 
                  : "glass-card hover:-translate-y-2 hover:bg-white/10"
              } border-2 ${isSelected ? 'border-primary-500' : 'border-transparent'}`}
            >
              {isCurrent && (
                <div className="absolute -top-3 -right-3 bg-secondary-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg flex items-center gap-1">
                  <CheckCircle2 size={12} /> Active
                </div>
              )}
              
              <div className={`w-14 h-14 rounded-2xl mb-6 flex items-center justify-center text-white bg-gradient-to-br ${charity.color} shadow-lg`}>
                {charity.icon}
              </div>
              
              <h2 className="text-2xl font-bold mb-3 text-white">{charity.name}</h2>
              <p className="text-gray-400 leading-relaxed mb-6">{charity.desc}</p>
              
              <div className="w-full h-1 bg-white/10 rounded-full mt-auto">
                {isSelected && (
                  <motion.div 
                    layoutId="activeIndicator"
                    className="w-full h-full bg-primary-500 rounded-full"
                  />
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      <AnimatePresence>
        {selected && selected.name !== currentCharity && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 w-full max-w-lg z-50 px-4"
          >
            <div className="glass-card bg-dark-800/90 border-primary-500/50 p-4 shadow-2xl rounded-2xl flex items-center justify-between gap-4 backdrop-blur-xl">
              <div className="flex-1">
                <p className="text-sm text-gray-400">Confirm new charity</p>
                <p className="font-bold text-lg text-white truncate">{selected.name}</p>
              </div>
              <button
                onClick={handleSelect}
                disabled={loading}
                className="bg-primary-600 hover:bg-primary-500 px-6 py-3 rounded-xl font-bold transition-all shadow-lg flex items-center gap-2 whitespace-nowrap disabled:opacity-50"
              >
                {loading ? "Saving..." : "Confirm Impact"} <ArrowRight size={18} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {message && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed top-24 left-1/2 -translate-x-1/2 z-50 text-white px-6 py-3 rounded-full shadow-lg backdrop-blur-md font-medium flex items-center gap-2 ${
              message.includes("Error") ? "bg-red-500/90" : "bg-green-500/90"
            }`}
          >
            {message.includes("Error") ? null : <CheckCircle2 size={18} />} {message}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Charities;