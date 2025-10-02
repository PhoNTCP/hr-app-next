"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Tpl = { id:number; name:string };

export default function KeywordNew() {
  const [templates, setTemplates] = useState<Tpl[]>([]);
  const [form, setForm] = useState({ keyword:"", fallback:"", templateId:0 });
  const [error, setError] = useState<string|null>(null);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      const res = await fetch("/api/templates");
      const data = await res.json();
      setTemplates(Array.isArray(data) ? data : []);
    })();
  }, []);

  const submit = async (e:React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch("/api/keywords", {
        method:"POST", headers:{ "Content-Type":"application/json" },
        body: JSON.stringify({
          keyword: form.keyword.trim(),
          fallback: form.fallback.trim() || null,
          templateId: form.templateId || null
        })
      });
      router.push("/bot-config/keyword");
    } catch(e:any){ setError(e.message || "Create failed"); }
  };

  return (
    <div className="p-6">
      <div className="p-6 shadow-lg glass">
        <h2 className="mb-4 text-xl font-bold text-white">Create Keyword</h2>
        {error && <div className="px-3 py-2 mb-4 text-red-200 rounded bg-red-500/15">{error}</div>}
        <form onSubmit={submit} className="grid gap-3 md:grid-cols-3">
          <div className="md:col-span-1">
            <label className="text-sm text-gray-200">Keyword</label>
            <input className="w-full p-2 mt-1 text-white border rounded bg-black/30 border-white/20"
              value={form.keyword} onChange={e=>setForm(f=>({...f,keyword:e.target.value}))}/>
          </div>
          <div className="md:col-span-1">
            <label className="text-sm text-gray-200">Fallback</label>
            <input className="w-full p-2 mt-1 text-white border rounded bg-black/30 border-white/20"
              value={form.fallback} onChange={e=>setForm(f=>({...f,fallback:e.target.value}))}/>
          </div>
          <div className="md:col-span-1">
            <label className="text-sm text-gray-200">Template</label>
            <select className="w-full p-2 mt-1 text-white border rounded bg-black/30 border-white/20"
              value={form.templateId} onChange={e=>setForm(f=>({...f,templateId:Number(e.target.value)}))}>
              <option value={0}>— N/A —</option>
              {templates.map(t=><option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
          </div>
          <div className="md:col-span-3">
            <button className="px-4 py-2 text-white bg-blue-600 rounded">Save</button>
          </div>
        </form>
      </div>
    </div>
  );
}
