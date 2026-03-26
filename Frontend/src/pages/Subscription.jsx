import { useState } from "react";
import useAuthStore from "../store/useAuthStore";
import api from "../services/api";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Star, CreditCard, ArrowRight } from "lucide-react";

const Subscription = () => {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const setSubscriptionGlobal = useAuthStore((state) => state.setSubscription);
  const currentPlan = useAuthStore((state) => state.subscription);

  const plans = [
    {
      id: "monthly",
      name: "Hero Monthly",
      price: "₹499",
      period: "/month",
      desc: "Perfect for testing the waters. Cancel anytime.",
      features: [
        "Track unlimited rounds",
        "Entry to monthly draws",
        "Support 1 charity",
        "Basic analytics"
      ],
      popular: false,
    },
    {
      id: "yearly",
      name: "Legend Yearly",
      price: "₹4,999",
      period: "/year",
      desc: "Save 20% and unlock all premium features.",
      features: [
        "Everything in Monthly",
        "Advanced handicap insights",
        "Support up to 3 charities",
        "Priority draw entries",
        "Exclusive Hero Merch"
      ],
      popular: true,
    },
  ];

  const handleSubscribe = async () => {
    if (!selectedPlan) return;

    setLoading(true);
    try {
      const selectedPlanName = selectedPlan === "monthly" ? "Monthly" : "Yearly";
      const res = await api.post("/subscription/set", {
        plan: selectedPlanName,
      });

      setSubscriptionGlobal(res.data.subscription);
      setMessage(`Successfully subscribed to ${selectedPlanName} plan! 🎉`);
      setSelectedPlan(null);
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      console.error(error);
      setMessage("Error processing subscription");
      setTimeout(() => setMessage(""), 3000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto pb-20 mt-4 relative">
      {/* Background glow */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-3/4 h-64 bg-primary-600/20 blur-[100px] rounded-full pointer-events-none"></div>

      <div className="text-center mb-16 relative z-10">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
          Upgrade Your <span className="gradient-text">Experience</span>
        </h1>
        <p className="text-xl text-gray-400 max-w-2xl mx-auto">
          Choose a plan that fits your game. Support a cause you care about.
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-8 justify-center items-stretch relative z-10">
        {plans.map((plan, index) => {
          const isSelected = selectedPlan === plan.id;
          const isCurrent = currentPlan?.toLowerCase() === plan.id;

          return (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              key={plan.id}
              onClick={() => setSelectedPlan(plan.id)}
              className={`relative flex-1 p-8 rounded-3xl cursor-pointer transition-all duration-300 flex flex-col ${
                isSelected 
                  ? "bg-dark-800 scale-105 border-primary-500 shadow-[0_0_40px_rgba(124,58,237,0.3)] z-20" 
                  : "glass-card hover:-translate-y-2 border-transparent z-10"
              } border-2 ${plan.popular ? (isSelected ? 'border-primary-500' : 'border-secondary-500/50') : 'border-transparent'}`}
            >
              {isCurrent && (
                <div className="absolute top-4 right-4 bg-emerald-500/20 text-emerald-400 text-xs font-bold px-3 py-1 rounded-full border border-emerald-500/30">
                  Current Plan
                </div>
              )}
              
              {plan.popular && !isCurrent && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-secondary-600 to-primary-600 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg flex items-center gap-1">
                  <Star size={12} className="fill-white" /> Most Popular
                </div>
              )}

              <h2 className="text-2xl font-bold mb-2 text-white">{plan.name}</h2>
              <p className="text-gray-400 text-sm mb-6 min-h-[40px]">{plan.desc}</p>
              
              <div className="mb-8">
                <span className="text-5xl font-extrabold text-white">{plan.price}</span>
                <span className="text-gray-400 font-medium">{plan.period}</span>
              </div>

              <div className="flex-grow">
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3 text-gray-300">
                      <CheckCircle2 size={20} className="text-primary-400 shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className={`w-full py-4 rounded-xl font-bold text-center transition-all ${
                isSelected 
                  ? "bg-primary-600 text-white shadow-lg shadow-primary-500/30" 
                  : "bg-white/5 text-gray-300 hover:bg-white/10"
              }`}>
                {isSelected ? "Selected" : "Select Plan"}
              </div>
            </motion.div>
          );
        })}
      </div>

      <AnimatePresence>
        {selectedPlan && selectedPlan !== currentPlan?.toLowerCase() && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 w-full max-w-lg z-50 px-4"
          >
            <div className="glass-card bg-dark-800/95 border-primary-500/50 p-4 shadow-2xl rounded-2xl flex items-center justify-between gap-4 backdrop-blur-xl">
              <div className="flex-1 flex items-center gap-3">
                <div className="p-2 bg-primary-500/20 rounded-lg text-primary-400">
                  <CreditCard size={24} />
                </div>
                <div>
                  <p className="text-sm text-gray-400">Proceed to checkout</p>
                  <p className="font-bold text-lg text-white capitalize">{selectedPlan} Plan</p>
                </div>
              </div>
              <button
                onClick={handleSubscribe}
                disabled={loading}
                className="bg-primary-600 hover:bg-primary-500 px-6 py-3 rounded-xl font-bold transition-all shadow-lg flex items-center gap-2 whitespace-nowrap disabled:opacity-50"
              >
                {loading ? "Processing..." : "Subscribe"} <ArrowRight size={18} />
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

export default Subscription;