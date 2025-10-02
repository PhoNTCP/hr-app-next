"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function KeywordEdit() {
  const { id } = useParams<{id:string}>();
  const router = useRouter();
  const [form, setForm] = useState({ keyword:"", fallback:"", templateId:0, status:"A" });
  const [templates, setTemplates] = useState<{id:number;name:string}[]>([]);
  const [error, setError] = useState<string|null>(null);

  useEffect(()=>{ (async()=>{
    const kRes = await fetch(`/api/keywords/${id}`);
    const k = await kRes.json();
    setForm({ keyword:k.keyword, fallback:k.fallback||"", templateId:k.template?.id||0, status:k.status });

    const tRes = await fetch("/api/templates");
    const t = await tRes.json();
    setTemplates(t || []);
  })().catch(e=>setError(e.message)); },[id]);

  const submit = async (e:React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch(`/api/keywords/${id}`, {
        method:"PUT", headers:{ "Content-Type":"application/json" },
        body: JSON.stringify({
          keyword: form.keyword.trim(),
          fallback: form.fallback.trim() || null,
          templateId: form.templateId || null,
          status: form.status
        })
      });
      router.push(`/bot-config/keyword/${id}`);
    } catch(e:any){ setError(e.message || "Update failed"); }
  };

  return (
    <div className="p-6">
      <div className="p-6 shadow-lg glass">
        <h2 className="mb-4 text-xl font-bold text-white">Edit Keyword</h2>
        {error && <div className="px-3 py-2 mb-4 text-red-200 rounded bg-red-500/15">{error}</div>}
        <form onSubmit={submit} className="grid gap-3 md:grid-cols-3">
          <div>
            <label className="text-sm text-gray-200">Keyword</label>
            <input className="w-full p-2 mt-1 text-white border rounded bg-black/30 border-white/20"
              value={form.keyword} onChange={e=>setForm(f=>({...f,keyword:e.target.value}))}/>
          </div>
          <div>
            <label className="text-sm text-gray-200">Fallback</label>
            <input className="w-full p-2 mt-1 text-white border rounded bg-black/30 border-white/20"
              value={form.fallback} onChange={e=>setForm(f=>({...f,fallback:e.target.value}))}/>
          </div>
          <div>
            <label className="text-sm text-gray-200">Template</label>
            <select className="w-full p-2 mt-1 text-white border rounded bg-black/30 border-white/20"
              value={form.templateId} onChange={e=>setForm(f=>({...f,templateId:Number(e.target.value)}))}>
              <option value={0}>— N/A —</option>
              {templates.map(t=><option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
          </div>
          <div>
            <label className="text-sm text-gray-200">Status</label>
            <select className="w-full p-2 mt-1 text-white border rounded bg-black/30 border-white/20"
              value={form.status} onChange={e=>setForm(f=>({...f,status:e.target.value}))}>
              <option value="A">Active</option>
              <option value="I">Inactive</option>
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
