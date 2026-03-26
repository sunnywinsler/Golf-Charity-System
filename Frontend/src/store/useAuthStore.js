import { create } from "zustand";

const useAuthStore = create((set) => ({
  user: JSON.parse(localStorage.getItem("user")) || null,
  token: localStorage.getItem("token") || null,

  subscription: null,
  scores: [],
  charity: null,

  setAuth: (user, token) => {
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("token", token);
    set({ user, token });
  },

  setUser: (user) => {
    localStorage.setItem("user", JSON.stringify(user));
    set({ user });
  },

  setSubscription: (plan) => set({ subscription: plan }),
  setScores: (scores) => set({ scores }),
  setCharity: (charity) => set({ charity }),

  logout: () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    set({
      user: null,
      token: null,
      subscription: null,
      scores: [],
      charity: null,
    });
  },
}));

export default useAuthStore;