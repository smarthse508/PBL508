import { createContext, useState, useEffect } from "react";

// Buat Context
export const AppContext = createContext();

const AppContextProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Simpan data user login
  const [loading, setLoading] = useState(true);

  // Cek apakah user masih login (misal lewat cookie)
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("http://localhost:5454/api/user/me", {
          credentials: "include",
        });
        const data = await res.json();
        if (data.success) setUser(data.user);
      } catch (err) {
        console.log("Not logged in");
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  const logout = async () => {
    await fetch("http://localhost:5454/api/auth/logout", {
      method: "POST",
      credentials: "include",
    });
    setUser(null);
  };

  return (
    <AppContext.Provider value={{ user, setUser, logout, loading }}>
      {children}
    </AppContext.Provider>
  );
};

export default AppContextProvider;
