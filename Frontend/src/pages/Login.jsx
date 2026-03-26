import { useState } from "react";
import api from "../services/api";
import useAuthStore from "../store/useAuthStore";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const setAuth = useAuthStore((state) => state.setAuth);
  const navigate = useNavigate();

  const handleLogin = async () => {
    const res = await api.post("/auth/login", { email, password });
    setAuth(res.data.user, res.data.token);
    navigate("/dashboard");
  };

  return (
    <div className="flex flex-col items-center mt-20">
      <input placeholder="Email" onChange={(e) => setEmail(e.target.value)} className="border p-2 m-2"/>
      <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} className="border p-2 m-2"/>
      <button onClick={handleLogin} className="bg-black text-white px-4 py-2">Login</button>
    </div>
  );
};

export default Login;