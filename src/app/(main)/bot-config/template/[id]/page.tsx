"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function TemplateShow() {
  const { id } = useParams<{id:string}>();
  const router = useRouter();
  const [item, setItem] = useState<any>(null);
  const [error, setError] = useState<string|null>(null);

  useEffect(() => {
    (async () => {
      try { setItem(await fetch(`/api/templates/${id}`)); }
      catch (e:any) { setError(e.message); }
    })();
  }, [id]);

  if (error) return <div className="p-6 text-red-300">{error}</div>;
  if (!item) return <div className="p-6 text-gray-300">Loading…</div>;

  return (
    <div className="p-6">
      <div className="p-6 shadow-lg glass">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-white">Template: {item.name}</h2>
          <button onClick={()=>router.push(`/bot-config/template/${id}/edit`)} className="px-3 py-1 text-white bg-blue-600 rounded">Edit</button>
        </div>
        <div className="mb-2 text-gray-200"><b>Type:</b> {item.type}</div>
        <pre className="p-3 text-xs rounded text-gray-200/90 bg-black/30">{JSON.stringify(item.payload,null,2)}</pre>
      </div>
    </div>
  );
}
