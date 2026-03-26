import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import useAuthStore from "./store/useAuthStore";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Scores from "./pages/Scores";
import Charities from "./pages/Charities";
import Subscription from "./pages/Subscription";
import Auth from "./pages/Auth";
import Admin from "./pages/Admin";
import Navbar from "./components/Navbar";

// Protected Route Wrapper
const ProtectedRoute = ({ children }) => {
  const token = useAuthStore(state => state.token);
  if (!token) return <Navigate to="/auth" />;
  return children;
};

function App() {
  // session is managed by useAuthStore natively via localStorage now
  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-screen relative overflow-hidden bg-dark-900">
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-primary-600/20 rounded-full blur-[100px] animate-blob pointer-events-none"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-secondary-600/20 rounded-full blur-[100px] animate-blob animation-delay-2000 pointer-events-none"></div>
        
        <Navbar />

        <main className="flex-grow pt-28 pb-12 px-4 sm:px-6 lg:px-8 relative z-10 w-full max-w-7xl mx-auto">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/scores" element={<ProtectedRoute><Scores /></ProtectedRoute>} />
            <Route path="/charities" element={<ProtectedRoute><Charities /></ProtectedRoute>} />
            <Route path="/subscription" element={<ProtectedRoute><Subscription /></ProtectedRoute>} />
            <Route path="/admin" element={<ProtectedRoute><Admin /></ProtectedRoute>} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;