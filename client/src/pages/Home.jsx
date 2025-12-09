// pages/home.jsx
import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Asesmen from "./Asesmen";
import RekapitulasiAsesmen from "./RekapitulasiAsesmen";
import Anggota from "./Anggota";
import Gedung from "./Gedung";
import Map from "./Map";

export default function Home() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activePage, setActivePage] = useState("Dashboard");
  const [workspaceId, setWorkspaceId] = useState(null);
  const [workspaceName, setWorkspaceName] = useState(null);
  const [anggota, setAnggota] = useState([]);
  const [loadingAnggota, setLoadingAnggota] = useState(false);

  // state untuk list ruang kerja
  const [workspaces, setWorkspaces] = useState([]);

  const backendURL = import.meta.env.VITE_BACKEND_URL;

  // Ambil workspace aktif + fetch ruang kerja pertama kali
useEffect(() => {
  const fetchWorkspaces = async () => {
    try {
      const res = await fetch(`${backendURL}/api/ruangkerja/list-ruangkerja`, {
        credentials: "include",
      });
      const data = await res.json();
      const wsList = data.data || [];
      setWorkspaces(wsList);

      // Cek workspace aktif dari localStorage dulu
      const savedWsId = localStorage.getItem("workspace_aktif");
      const savedWsName = localStorage.getItem("workspace_aktif_nama");

      if (savedWsId && savedWsName) {
        setWorkspaceId(savedWsId);
        setWorkspaceName(savedWsName);
        return; // jangan overwrite pilihan user
      }

      // Kalau belum ada workspace aktif tersimpan, tentukan default
      let defaultWs = null;
      const ownerWs = wsList.filter(
        ws => ws.pengguna_id === localStorage.getItem("user_id")
      );

      if (ownerWs.length > 0) {
        defaultWs = ownerWs.reduce((prev, curr) =>
          new Date(prev.createdAt) < new Date(curr.createdAt) ? prev : curr
        );
      } else if (wsList.length > 0) {
        defaultWs = wsList[0];
      }

      if (defaultWs) {
        setWorkspaceId(defaultWs._id);
        setWorkspaceName(defaultWs.nama);
        localStorage.setItem("workspace_aktif", defaultWs._id);
        localStorage.setItem("workspace_aktif_nama", defaultWs.nama);
      }
    } catch (err) {
      console.error("Gagal fetch ruang kerja:", err);
    }
  };

  fetchWorkspaces();
}, []);




  return (
    <div className="h-screen flex bg-gray-100 text-gray-900">
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        activePage={activePage}
        setActivePage={setActivePage}
      />

      <main className="flex-1 overflow-y-auto">
        <header className="bg-white sticky top-0 z-10 flex justify-between items-center p-4 shadow-sm">
          <button
            className="p-2 text-2xl font-bold lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            ☰
          </button>
          <h2 className="text-2xl font-semibold">{activePage}</h2>
          <div className="bg-gray-300 w-10 h-10 rounded-full"></div>
        </header>

        <section className="p-6 space-y-4">
          {/* DASHBOARD */}
          {activePage === "Dashboard" && (
            <div>
              <h3 className="text-xl font-bold mb-2">Dashboard Overview</h3>
              <p>Ini halaman Dashboard, berisi ringkasan umum.</p>
              {workspaceName && (
                <p className="text-sm text-gray-600">
                  Workspace aktif: {workspaceName}
                </p>
              )}
            </div>
          )}

          
          {/* ISI ASESMEN */}
          {activePage === "Isi Asesmen" && <Asesmen workspaceId={workspaceId} />}

          {/* REKAP ASESMEN */}
          {activePage === "Rekapitulasi Asesmen" && (
            <RekapitulasiAsesmen workspaceId={workspaceId} />
          )}

          {/* Gedung */}
          {activePage === "Gedung" &&  <Gedung workspaceId={workspaceId} /> }

          {/* REPORTS */}
          {activePage === "Map" && <Map /> }
          {/*Anggota */}
          {activePage === "Lihat Anggota" && workspaceId && (
            <Anggota 
              workspaceId={workspaceId} 
              ownerId={workspaces.find(ws => ws._id === workspaceId)?.pengguna_id || ""}
            />
          )}




          {/* RUANG KERJA */}
          {activePage === "Ruang Kerja" && (
            <div>
              <h3 className="text-xl font-bold mb-4">Daftar Ruang Kerja</h3>

              {workspaces.length === 0 ? (
                <p className="text-gray-600">Belum ada ruang kerja.</p>
              ) : (
                <ul className="space-y-2">
                  {workspaces.map((ws) => (
                    <li
                      key={ws._id}
                      className="p-3 bg-white shadow rounded text-gray-800 cursor-pointer hover:bg-green-100"
                      onClick={() => {
                      localStorage.setItem("workspace_aktif", ws._id);
                      localStorage.setItem("workspace_aktif_nama", ws.nama);

                      setWorkspaceId(ws._id);
                      setWorkspaceName(ws.nama);
                      setActivePage("Dashboard"); // pindah ke dashboard biar jelas

                      alert(`Berhasil mengubah workspace ke: ${ws.nama}`);
                    }}

                    >
                      {ws.nama}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
