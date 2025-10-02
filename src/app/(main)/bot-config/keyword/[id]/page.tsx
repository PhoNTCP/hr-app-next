"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function KeywordShow() {
  const { id } = useParams<{id:string}>();
  const router = useRouter();
  const [item, setItem] = useState<any>(null);
  const [templates, setTemplates] = useState<{id:number;name:string}[]>([]);

  useEffect(()=>{ (async()=>{
    setItem(await fetch(`/api/keywords/${id}`));
    const res = await fetch("/api/templates");
    const data = await res.json();
    setTemplates(Array.isArray(data) ? data : []);
  })(); },[id]);

  if (!item) return <div className="p-6 text-gray-300">Loading…</div>;

  const setTemplate = async (templateId:number) => {
    await fetch(`/api/keywords/${id}`, {
      method:"PUT", headers:{ "Content-Type":"application/json" },
      body: JSON.stringify({ ...item, templateId })
    });
    location.reload();
  };

  return (
    <div className="p-6">
      <div className="p-6 shadow-lg glass">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-white">Keyword: {item.keyword}</h2>
          <button onClick={()=>router.push(`/bot-config/keyword/${id}/edit`)} className="px-3 py-1 text-white bg-blue-600 rounded">Edit</button>
        </div>
        <div className="mb-2 text-gray-200"><b>Template:</b> {item.template?.name ?? "N/A"}</div>
        <div className="mb-4 text-gray-200"><b>Fallback:</b> {item.fallback ?? "-"}</div>

        <div className="flex items-end gap-2">
          <div>
            <label className="text-sm text-gray-200">Set Template</label>
            <select className="p-2 ml-2 text-white border rounded bg-black/30 border-white/20"
              defaultValue={item.template?.id ?? 0}
              onChange={e=>setTemplate(Number(e.target.value))}>
              <option value={0}>— N/A —</option>
              {templates.map(t=><option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
