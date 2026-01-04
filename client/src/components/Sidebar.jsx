import React, { useState, useRef, useEffect } from "react";

export default function Sidebar({
  sidebarOpen,
  setSidebarOpen,
  activePage,
  setActivePage,
}) {
  const backendURL = import.meta.env.VITE_BACKEND_URL;

  const sidebarRef = useRef(null);
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (sidebarRef.current && !sidebarRef.current.contains(e.target)) {
        // sidebar cuma auto close di mode mobile
        if (sidebarOpen) setSidebarOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [sidebarOpen]);

  const handleLogout = async () => {
    try {
      const res = await fetch(`${backendURL}/api/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) {
        localStorage.clear();
        window.location.href = "/login";
      } else {
        alert("Logout gagal: " + data.message);
      }
    } catch (err) {
      console.error("Logout error:", err);
      alert("Terjadi kesalahan saat logout.");
    }
  };

  const navItems = [
    {name: "Dasbor", icon: <i class="bi bi-house-fill"></i>},
    {name: "Isi Asesmen", icon: <i class="bi bi-pencil-square"></i>},
    {name: "Rekapitulasi Asesmen", icon: <i class="bi bi-file-earmark-text-fill"></i>,},
    {name: "Isi Laporan Kecelakaan", icon: <i class="bi bi-exclamation-diamond-fill"></i>,},
    {name: "Rekapitulasi Laporan Kecelakaan", icon: <i class="bi bi-file-text-fill"></i>,},
    {name: "Denah", icon: <i class="bi bi-map-fill"></i> },
    {name: "Kelola Workspace", icon: <i class="bi bi-person-workspace"></i> },
  ];

  return (
    <aside
      ref={sidebarRef}
      className={`fixed z-20 bg-green-800 w-72 h-screen shadow-lg transform transition-transform duration-300
        ${sidebarOpen ? "translate-x-0" : "-translate-x-72"} 
        lg:translate-x-0 lg:static flex flex-col justify-between`}
    >
      {/* Sidebar Header */}
      <div>
        <div className="p-4 flex justify-between items-center border-b border-gray-200">
          <h1 className="text-xl font-bold text-white">KAVES</h1>
        </div>

        {/* Navigation Items */}
        <nav className="p-4 space-y-2">
          {navItems.map((item) => (
            <div
              key={item.name}
              onClick={() => setActivePage(item.name)}
              className={`flex items-center gap-4 p-4 rounded-md cursor-pointer text-green-900 font-bold transition-all duration-200
                ${
                  activePage === item.name
                    ? "bg-white shadow-md"
                    : "hover:bg-green-900 text-white"
                }`}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="text-lg">{item.name}</span>
            </div>
          ))}
        </nav>
      </div>

      {/* Logout Button */}
      <div className="p-4">
        <button
          onClick={() => {
            localStorage.clear();
            window.location.href = "/login";
          }}
          className="w-full flex items-center gap-4 justify-center p-2 rounded-md bg-red-500 text-white hover:bg-red-700 cursor-pointer"
        >
          <i class="bi bi-box-arrow-left"></i>
          Logout
        </button>
      </div>
    </aside>
  );
}
