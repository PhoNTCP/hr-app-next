"use client";
import Link from "next/link";
import { useEffect, useState  ,useMemo} from "react";
import { useRouter } from "next/navigation";

type Tpl = { id:number; type:string; name:string; payload:any };

export default function TemplateIndex() {
  const [items, setItems] = useState<Tpl[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string|null>(null);
  const router = useRouter();

 useEffect(() => {
    fetch("/api/templates")
      .then((res) => {
        if (res.status === 401 || res.status === 403) {
          router.push("/login");
          return null;
        }
        return res.json();
      })
      .then((data) => data && setItems(Array.isArray(data) ? data : []))
      .catch((err) => setError(String(err)));
  }, [router]);


  const del = async (id:number) => {
    if (!confirm("Delete this template?")) return;
	await fetch(`/api/templates/${id}`, { method: "DELETE" }); 
  };

  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const filtered = useMemo(() => {
      if (!q.trim()) return items;
      const v = q.toLowerCase();
      return items.filter((u) =>
        [u.type, u.name]
          .join(" ")
          .toLowerCase()
          .includes(v)
      );
    }, [q, items]);
  
    const pageCount = Math.max(1, Math.ceil((filtered?.length ?? 0) / pageSize));
    const current = useMemo(() => {
      const start = (page - 1) * pageSize;
      return filtered.slice(start, start + pageSize);
    }, [filtered, page, pageSize]);

  return (
    <div className="w-full p-4 border shadow-lg md:p-6 rounded-2xl border-white/40 bg-white/70 backdrop-blur-xl">
      {/* toolbar */}
      <div className="flex flex-col gap-3 mb-3 md:flex-row md:items-center md:justify-between">
        <input
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setPage(1);
          }}
          placeholder="Search..."
          className="w-full max-w-xl px-4 py-2 border rounded-xl border-neutral-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />

        <div className="flex items-center gap-2 text-sm">
          <span>Rows:</span>
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setPage(1);
            }}
            className="w-24 px-2 py-2 border rounded-xl border-neutral-300 focus:outline-none"
          >
            {[5, 10, 20, 50].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table for md+ screens */}
      <div className="hidden overflow-auto border md:block rounded-2xl border-white/40">
        <table className="w-full text-left">
          <thead className="bg-white/60">
            <tr className="[&>th]:px-3 [&>th]:py-2 text-sm text-neutral-600">
              <th className="px-5 py-2">No</th>
              <th className="px-5 py-2">Type</th>
              <th className="px-5 py-2">Name</th>
              <th className="px-5 py-2">#Keyword</th>
              <th className="px-5 py-2">Action</th>
            </tr>
          </thead>
          <tbody className="bg-white/50">
            {current.map((u, i) => (
              <tr
                key={u.id}
                className="transition-colors odd:bg-white/50 even:bg-white/40 hover:bg-white/70"
              >
                <td className="px-5 py-2">{(page - 1) * pageSize + i + 1}</td>
                <td className="px-5 py-2">{u.type}</td>
                <td className="px-5 py-2">{u.name}</td>
                <td className="px-5 py-2">{/* optional: count on server ifต้องการ */}1</td>
                <td className="px-5 py-2 space-x-2">
                  <Link href={`/bot-config/template/${u.id}`} className="px-3 py-1 text-white rounded bg-cyan-600">Show</Link>
                  <Link href={`/bot-config/template/${u.id}/edit`} className="px-3 py-1 text-white bg-blue-600 rounded">Edit</Link>
                  <button onClick={()=>del(u.id)} className="px-3 py-1 text-white bg-red-600 rounded">Delete</button>
                </td>
              </tr>
            ))}
             {current.length === 0 && (
              <tr>
                <td colSpan={8} className="px-3 py-8 text-center text-neutral-500">
                  No data.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      {/* pagination */}
      <div className="flex flex-col items-center justify-between gap-3 mt-4 md:flex-row">
        <div className="text-sm text-neutral-600">
          Showing <b>{current.length}</b> of <b>{filtered.length}</b> (total{" "}
          <b>{items.length}</b>)
        </div>
        <div className="flex items-center gap-2">
          <button
            className="px-3 py-1 bg-white border rounded-xl"
            disabled={page <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            Prev
          </button>
          {Array.from({ length: pageCount }, (_, i) => i + 1)
            .slice(Math.max(0, page - 3), Math.min(pageCount, page + 2))
            .map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`px-3 py-1 rounded-xl border ${
                  p === page ? "bg-neutral-900 text-white" : "bg-white/70"
                }`}
              >
                {p}
              </button>
            ))}
          <button
            className="px-3 py-1 bg-white border rounded-xl"
            disabled={page >= pageCount}
            onClick={() => setPage((p) => Math.min(pageCount, p + 1))}
          >
            Next
          </button>
        </div>
      </div>

      </div>
    </div>
  );
}
