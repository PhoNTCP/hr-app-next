"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

type Row = { id:number; keyword:string; fallback:string|null; status:string; template?:{id:number;name:string}|null };

export default function KeywordIndex() {
  const [items, setItems] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string|null>(null);

  const load = async () => {
      const res = await fetch("/api/keywords");
      const data = await res.json();
      setItems(Array.isArray(data) ? data : []);
  };

  useEffect(()=>{ load(); }, []);

  const del = async (id:number) => {
    if (!confirm("Delete this keyword?")) return;
    try { await fetch(`/api/keywords/${id}`, { method:"DELETE" }); load(); }
    catch(e:any){ alert(e.message || "Delete failed"); }
  };

  return (
    <div className="p-6">
      <div className="p-6 shadow-lg glass">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-white">Keyword Management</h2>
          <Link href="/bot-config/keyword/new" className="px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600">Create New Keyword</Link>
        </div>

        {error && <div className="px-3 py-2 mb-4 text-red-200 rounded bg-red-500/15">{error}</div>}

        <table className="min-w-full text-sm text-left text-gray-200 table-auto">
          <thead className="border-b border-white/10">
            <tr>
              <th className="px-3 py-2">No</th>
              <th className="px-3 py-2">Keyword</th>
              <th className="px-3 py-2">Template</th>
              <th className="px-3 py-2">Fallback</th>
              <th className="px-3 py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} className="px-3 py-3">Loading…</td></tr>
            ) : items.length === 0 ? (
              <tr><td colSpan={5} className="px-3 py-3">No data</td></tr>
            ) : items.map((k,i)=>(
              <tr key={k.id} className="border-b border-white/10">
                <td className="px-3 py-2">{i+1}</td>
                <td className="px-3 py-2">{k.keyword}</td>
                <td className="px-3 py-2">{k.template?.name ?? "N/A"}</td>
                <td className="px-3 py-2">{k.fallback ?? "N/A"}</td>
                <td className="px-3 py-2 space-x-2">
                  <Link href={`/bot-config/keyword/${k.id}`} className="px-3 py-1 text-white rounded bg-cyan-600">Show</Link>
                  <Link href={`/bot-config/keyword/${k.id}/edit`} className="px-3 py-1 text-white bg-blue-600 rounded">Edit</Link>
                  <button onClick={()=>del(k.id)} className="px-3 py-1 text-white bg-red-600 rounded">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

      </div>
    </div>
  );
}
