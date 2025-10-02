"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function TemplateEdit() {
  const { id } = useParams<{id:string}>();
  const router = useRouter();
  const [form, setForm] = useState({ type:"text", name:"", payload:"" });
  const [error, setError] = useState<string|null>(null);
  useEffect(()=>{ (async()=>{
    const res = await fetch(`/api/templates/${id}`);
    const t = await res.json();
    setForm({ type: t.type, name: t.name, payload: JSON.stringify(t.payload, null, 2) });
  })().catch(e=>setError(e.message)); }, [id]);

  const submit = async (e:React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch(`/api/templates/${id}`, {
        method:"PUT", headers:{ "Content-Type":"application/json" },
        body: JSON.stringify(form)
      });
      router.push(`/bot-config/template`);
    } catch(e:any) { setError(e.message || "Update failed"); }
  };

  return (
    <div className="p-6">
      <div className="p-6 shadow-lg glass">
        <h2 className="mb-4 text-xl font-bold text-black">Edit Template</h2>
        {error && <div className="px-3 py-2 mb-4 text-red-200 rounded bg-red-500/15">{error}</div>}
        <form onSubmit={submit} className="grid gap-3">
          <div>
            <label className="text-sm text-black">Type</label>
            <select className="w-full p-2 mt-1 text-black border rounded bg-black/30 border-white/20"
              value={form.type} onChange={e=>setForm(f=>({...f,type:e.target.value}))}>
              <option value="text">text</option><option value="flex">flex</option><option value="imagemap">imagemap</option>
            </select>
          </div>
          <div>
            <label className="text-sm text-black">Name</label>
            <input className="w-full p-2 mt-1 text-black border rounded bg-black/30 border-white/20"
              value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))}/>
          </div>
          <div>
            <label className="text-sm text-black">Payload (JSON)</label>
            <textarea rows={12} className="w-full p-2 mt-1 font-mono text-black border rounded bg-black/30 border-white/20"
              value={form.payload} onChange={e=>setForm(f=>({...f,payload:e.target.value}))}/>
          </div>
          <button className="px-4 py-2 text-white bg-blue-600 rounded">Save</button>
        </form>
      </div>
    </div>
  );
}
