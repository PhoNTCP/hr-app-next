"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function TemplateNew() {
  const [form, setForm] = useState({ type:"text", name:"", payload:'{ "type":"text", "text":"hello" }' });
  const [error, setError] = useState<string|null>(null);
  const router = useRouter();

  const submit = async (e:React.FormEvent) => {
    e.preventDefault();
    try {
      setError(null);
      await fetch("/api/templates", {
        method:"POST", headers:{ "Content-Type":"application/json" },
        body: JSON.stringify(form)
      });
      router.push("/bot-config/template");
    } catch(e:any) { setError(e.message || "Create failed"); }
  };

  return (
    <div className="p-6">
      <div className="p-6 shadow-lg glass">
        <h2 className="mb-4 text-xl font-bold text-black">Create Template</h2>
        {error && <div className="px-3 py-2 mb-4 text-red-200 rounded bg-red-500/15">{error}</div>}

        <form onSubmit={submit} className="grid gap-3">
          <div>
            <label className="text-sm font-bold text-black">Type</label>
            <select className="w-full p-2 mt-1 font-bold text-black border rounded bg-black/30 border-white/20"
              value={form.type} onChange={e=>setForm(f=>({...f,type:e.target.value}))}>
              <option value="text">text</option>
              <option value="flex">flex</option>
              <option value="imagemap">imagemap</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-bold text-black">Name</label>
            <input className="w-full p-2 mt-1 text-black border rounded bg-black/30 border-white/20"
              value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))}/>
          </div>
          <div>
            <label className="text-sm font-bold text-black">Payload (JSON)</label>
            <textarea rows={10} className="w-full p-2 mt-1 font-mono font-bold text-black border rounded bg-black/30 border-white/20"
              value={form.payload} onChange={e=>setForm(f=>({...f,payload:e.target.value}))}/>
          </div>
          <div className="flex gap-2">
            <button className="px-4 py-2 text-white bg-blue-600 rounded">Save</button>
          </div>
        </form>
      </div>
    </div>
  );
}
