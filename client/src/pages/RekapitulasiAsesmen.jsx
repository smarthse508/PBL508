import { useState, useEffect } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

function RekapitulasiAsesmen() {
  const [ruangList, setRuangList] = useState([]);
  const [selectedRuang, setSelectedRuang] = useState(null);
  const [bangunanList, setBangunanList] = useState([]);
  const [selectedBangunan, setSelectedBangunan] = useState(null);
  const [asesmenList, setAsesmenList] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchRuang = async () => {
      try {
        const res = await fetch("http://localhost:5454/api/ruangkerja/list-ruangkerja", {
          credentials: "include",
        });
        const data = await res.json();
        if (data.success) {
          setRuangList(data.data || []);
          if (data.data.length > 0) setSelectedRuang(data.data[0]);
        }
      } catch {
        alert("Gagal mengambil data ruang kerja");
      }
    };
    fetchRuang();
  }, []);

  useEffect(() => {
    if (!selectedRuang) return;
    const fetchBangunan = async () => {
      setLoading(true);
      try {
        const res = await fetch(`http://localhost:5454/api/bangunan/list/${selectedRuang._id}`, {
          credentials: "include",
        });
        const data = await res.json();
        if (data.success) setBangunanList(data.data || []);
      } catch {
        alert("Gagal mengambil data bangunan");
      }
      setLoading(false);
    };
    fetchBangunan();
  }, [selectedRuang]);

  useEffect(() => {
    if (!selectedBangunan) return;
    const fetchAsesmen = async () => {
      setLoading(true);
      try {
        const res = await fetch(`http://localhost:5454/api/asesmen/list/${selectedBangunan._id}`, {
          credentials: "include",
        });
        const data = await res.json();
        if (data.success) setAsesmenList(data.data || []);
      } catch {
        alert("Gagal mengambil data asesmen");
      }
      setLoading(false);
    };
    fetchAsesmen();
  }, [selectedBangunan]);

  const exportPDF = () => {
    const doc = new jsPDF("p", "pt");
    const judul = `Rekap Asesmen ${selectedRuang.nama} ${selectedBangunan.nama}`;
    doc.setFontSize(14);
    doc.text(judul, 40, 40);

    const tableColumn = [
      "No",
      "Jenis Pekerjaan",
      "Jenis Bahaya",
      "Cause/Effect",
      "Likelihood",
      "Severity",
      "Risk",
      "Level",
      "Impact",
      "Danger",
      "Prevensi",
    ];

    const tableRows = asesmenList.map((a, idx) => [
      idx + 1,
      a.jenis_pekerjaan,
      a.jenis_bahaya,
      a.cause_effect,
      a.likelihood,
      a.severity,
      a.risk,
      a.level,
      a.impact,
      a.danger,
      a.prevensi,
    ]);

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 60,
      theme: "grid",
      headStyles: { fillColor: [22, 160, 133] },
      alternateRowStyles: { fillColor: [240, 240, 240] },
      styles: { fontSize: 10, cellPadding: 4 },
      didParseCell: (data) => {
        if (data.column.index === 9) {
          if (data.cell.raw === "High") data.cell.styles.fillColor = [255, 0, 0];
          else if (data.cell.raw === "Medium") data.cell.styles.fillColor = [255, 165, 0];
          else if (data.cell.raw === "Low") data.cell.styles.fillColor = [0, 255, 0];
        }
      },
    });

    doc.save(`${judul}.pdf`);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8 overflow-y-auto">
      <h1 className="text-3xl font-bold text-center mb-6">📋 Rekap Asesmen</h1>

      {/* RUANG KERJA */}
      <section>
        <h2 className="text-xl font-semibold mb-2">Ruang Kerja</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {ruangList.map((ruang) => (
            <button
              key={ruang._id}
              onClick={() => setSelectedRuang(ruang)}
              className={`p-4 rounded-xl border text-left transition-all ${
                selectedRuang?._id === ruang._id
                  ? "bg-blue-600 text-white"
                  : "bg-gray-50 hover:bg-blue-50"
              }`}
            >
              <h3 className="font-medium">{ruang.nama}</h3>
            </button>
          ))}
        </div>
      </section>

      {/* BANGUNAN */}
      {selectedRuang && (
        <section className="mt-8">
          <h2 className="text-xl font-semibold mb-2">
            Bangunan di <span className="text-blue-600">{selectedRuang.nama}</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {bangunanList.map((b) => (
              <button
                key={b._id}
                onClick={() => setSelectedBangunan(b)}
                className={`p-4 border rounded-xl transition-all ${
                  selectedBangunan?._id === b._id
                    ? "bg-green-600 text-white"
                    : "bg-gray-50 hover:bg-green-50"
                }`}
              >
                <h3 className="font-medium">{b.nama}</h3>
              </button>
            ))}
          </div>
        </section>
      )}

      {/* REKAP ASESMEN */}
      {selectedBangunan && (
        <section className="mt-8">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-xl font-semibold">Asesmen - {selectedBangunan.nama}</h2>
            <button
              onClick={exportPDF}
              className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700"
            >
              Export PDF
            </button>
          </div>

          {loading ? (
            <p>Loading...</p>
          ) : asesmenList.length === 0 ? (
            <p>Tidak ada asesmen</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full border border-gray-200 rounded-xl">
                <thead className="bg-gray-200">
                  <tr>
                    <th className="px-4 py-2 border">No</th>
                    <th className="px-4 py-2 border">Jenis Pekerjaan</th>
                    <th className="px-4 py-2 border">Jenis Bahaya</th>
                    <th className="px-4 py-2 border">Cause/Effect</th>
                    <th className="px-4 py-2 border">Likelihood</th>
                    <th className="px-4 py-2 border">Severity</th>
                    <th className="px-4 py-2 border">Risk</th>
                    <th className="px-4 py-2 border">Level</th>
                    <th className="px-4 py-2 border">Impact</th>
                    <th className="px-4 py-2 border">Danger</th>
                    <th className="px-4 py-2 border">Prevensi</th>
                  </tr>
                </thead>
                <tbody>
                  {asesmenList.map((a, idx) => (
                    <tr key={a._id}>
                      <td className="px-4 py-2 border">{idx + 1}</td>
                      <td className="px-4 py-2 border">{a.jenis_pekerjaan}</td>
                      <td className="px-4 py-2 border">{a.jenis_bahaya}</td>
                      <td className="px-4 py-2 border">{a.cause_effect}</td>
                      <td className="px-4 py-2 border">{a.likelihood}</td>
                      <td className="px-4 py-2 border">{a.severity}</td>
                      <td className="px-4 py-2 border">{a.risk}</td>
                      <td className="px-4 py-2 border">{a.level}</td>
                      <td className="px-4 py-2 border">{a.impact}</td>
                      <td className="px-4 py-2 border">{a.danger}</td>
                      <td className="px-4 py-2 border">{a.prevensi}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      )}
    </div>
  );
}

export default RekapitulasiAsesmen;
