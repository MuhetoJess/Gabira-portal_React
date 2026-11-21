import { createContext, useContext, useState, useEffect } from "react";
import { loadAllUsers, saveExtraUser } from "../services/dataService";

const AuthContext = createContext(null);
const CGP_SESSION_KEY = "cgp_session";

export function AuthProvider({ children }) {
  const [session, setSession] = useState(() => {
    try {
      const saved = sessionStorage.getItem(CGP_SESSION_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const login = async (role, email, password) => {
    const all = await loadAllUsers();
    const list = role === "charity" ? all.charities : all.donors;
    const user = list.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );

    if (!user) throw new Error("Incorrect email or password. Please try again.");

    const newSession = { role, id: user.id, name: user.name, email: user.email };
    sessionStorage.setItem(CGP_SESSION_KEY, JSON.stringify(newSession));
    setSession(newSession);
    return newSession;
  };

  const register = async (role, formData) => {
    const all = await loadAllUsers();
    const list = role === "charity" ? all.charities : all.donors;
    const exists = list.some((u) => u.email.toLowerCase() === formData.email.toLowerCase());
    if (exists) throw new Error("An account with that email already exists.");

    const newId = (role === "charity" ? "c-" : "d-") + Date.now();
    const newUser = {
      id: newId,
      ...formData,
      joined: new Date().toISOString().slice(0, 10)
    };

    saveExtraUser(role, newUser);

    const newSession = { role, id: newUser.id, name: newUser.name, email: newUser.email };
    sessionStorage.setItem(CGP_SESSION_KEY, JSON.stringify(newSession));
    setSession(newSession);
    return newSession;
  };

  const logout = () => {
    sessionStorage.removeItem(CGP_SESSION_KEY);
    setSession(null);
  };

  return (
    <AuthContext.Provider value={{ session, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}