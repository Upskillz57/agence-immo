"use client";

import { useState, useEffect, useRef } from "react";
import { Montserrat } from "next/font/google";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Upload, Trash2, ArrowLeft, CheckCircle, Loader2, Eye, X } from "lucide-react";


const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export default function AdminVideos() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [properties, setProperties] = useState<any[]>([]);
  const [videoMap, setVideoMap] = useState<Record<string, string>>({});
  const [selectedProperty, setSelectedProperty] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);


  useEffect(() => {
    fetch("/api/properties")
      .then(r => r.json())
      .then(data => setProperties(data));

    fetch("/api/admin/videos")
      .then(r => r.json())
      .then(data => setVideoMap(data));
  }, []);

  const filtered = properties.filter(p =>
    `${p.title} ${p.city} ${p.id}`.toLowerCase().includes(search.toLowerCase())
  );

  async function handleUpload() {
    if (!file || !selectedProperty) return;
    setUploading(true);
    setError("");
    setProgress(0);

    try {
      // 1. Obtenir une URL signée
      const ext = file.name.split(".").pop();
      const filename = `${selectedProperty}.${ext}`;

      const res = await fetch("/api/admin/upload-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ filename, contentType: file.type }),
      });

      const { uploadUrl, publicUrl } = await res.json();

      // 2. Upload vers R2
      await new Promise<void>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.upload.addEventListener("progress", (e) => {
          if (e.lengthComputable) setProgress(Math.round((e.loaded / e.total) * 100));
        });
        xhr.addEventListener("load", () => resolve());
        xhr.addEventListener("error", () => reject());
        xhr.open("PUT", uploadUrl);
        xhr.setRequestHeader("Content-Type", file.type);
        xhr.send(file);
      });

      // 3. Sauvegarder le mapping
      await fetch("/api/admin/videos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ propertyId: selectedProperty, videoUrl: publicUrl }),
      });

      setVideoMap(prev => ({ ...prev, [selectedProperty]: publicUrl }));
      setSuccess(true);
      setFile(null);
      setSelectedProperty("");
      setTimeout(() => setSuccess(false), 3000);
    } catch (e) {
      setError("Erreur lors de l'upload. Réessayez.");
    } finally {
      setUploading(false);
      setProgress(0);
    }
  }

  async function handleDelete(propertyId: string) {
    if (!confirm("Supprimer cette vidéo ?")) return;
    await fetch("/api/admin/videos", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ propertyId }),
    });
    setVideoMap(prev => {
      const next = { ...prev };
      delete next[propertyId];
      return next;
    });
  }

  return (
    <div className={`${montserrat.className} min-h-screen bg-[#f5f5f5]`}>

      {/* HEADER */}
      <header className="bg-[#122e53] px-6 md:px-10 h-[70px] flex items-center gap-4">
        <button onClick={() => router.push("/admin/dashboard")} className="text-white/70 hover:text-white transition">
          <ArrowLeft size={20} />
        </button>
        <div className="relative w-[120px] h-[40px]">
          <Image src="/logo-marchal.png" alt="Marchal Immobilier" fill sizes="120px" className="object-contain" />
        </div>
        <span className="text-white/50 text-sm ml-2">/ Gestion des vidéos</span>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-10">

        {/* UPLOAD */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 mb-8">
          <h2 className="text-lg font-semibold text-[#122e53] mb-6">Ajouter une vidéo</h2>

          {/* RECHERCHE BIEN */}
          <div className="mb-4">
            <label className="block text-xs font-semibold uppercase tracking-widest text-gray-400 mb-2">
              Rechercher un bien
            </label>
            <input
              type="text"
              placeholder="Nom, ville, référence..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm text-[#122e53] outline-none focus:border-[#122e53] transition"
            />
          </div>

          {/* LISTE BIENS */}
          {search && (
            <div className="border border-gray-100 rounded-lg mb-4 max-h-48 overflow-y-auto">
              {filtered.slice(0, 10).map(p => (
                <div
                  key={p.id}
                  onClick={() => { setSelectedProperty(p.id); setSearch(""); }}
                  className={`px-4 py-3 cursor-pointer hover:bg-[#f5f5f5] text-sm flex justify-between items-center ${selectedProperty === p.id ? "bg-[#122e53]/5 font-semibold" : ""}`}
                >
                  <span className="text-[#122e53]">{p.title}</span>
                  <span className="text-gray-400 text-xs">{p.city} — {p.id}</span>
                </div>
              ))}
              {filtered.length === 0 && <p className="px-4 py-3 text-sm text-gray-400">Aucun bien trouvé</p>}
            </div>
          )}

          {/* BIEN SÉLECTIONNÉ */}
          {selectedProperty && (
            <div className="bg-[#122e53]/5 rounded-lg px-4 py-3 mb-4 text-sm text-[#122e53] font-medium flex justify-between">
              <span>✓ Bien sélectionné : {selectedProperty}</span>
              <button onClick={() => setSelectedProperty("")} className="text-gray-400 hover:text-red-500 text-xs">Changer</button>
            </div>
          )}

          {/* UPLOAD FICHIER */}
          <div
  onClick={() => fileInputRef.current?.click()}
  onDragOver={(e) => {
    e.preventDefault();
    e.stopPropagation();
  }}
  onDragEnter={(e) => {
    e.preventDefault();
    e.stopPropagation();
  }}
  onDrop={(e) => {
    e.preventDefault();
    e.stopPropagation();
    const dropped = e.dataTransfer.files?.[0];
    if (dropped) setFile(dropped);
  }}
  className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center cursor-pointer hover:border-[#122e53] transition mb-4"
>
  <Upload size={28} className="mx-auto text-gray-300 mb-3" />
  <p className="text-sm text-gray-400">
    {file ? (
      <span className="text-[#122e53] font-medium">{file.name}</span>
    ) : (
      "Cliquez ou glissez une vidéo MP4 ici"
    )}
  </p>
  <input
    ref={fileInputRef}
    type="file"
    accept="video/mp4,video/*"
    className="hidden"
    onChange={e => {
      const selected = e.target.files?.[0];
      if (selected) setFile(selected);
    }}
  />
</div>

          {/* PROGRESS */}
          {uploading && (
            <div className="mb-4">
              <div className="flex justify-between text-xs text-gray-400 mb-1">
                <span>Upload en cours...</span>
                <span>{progress}%</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div className="bg-[#122e53] h-2 rounded-full transition-all" style={{ width: `${progress}%` }} />
              </div>
            </div>
          )}

          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

          {success && (
            <div className="flex items-center gap-2 text-green-600 text-sm mb-4">
              <CheckCircle size={16} />
              Vidéo uploadée avec succès !
            </div>
          )}

          <button
            onClick={handleUpload}
            disabled={!file || !selectedProperty || uploading}
            className="w-full bg-[#122e53] text-white py-3 rounded-full uppercase tracking-widest text-xs font-semibold hover:bg-black transition disabled:opacity-40 flex items-center justify-center gap-2"
          >
            {uploading ? <><Loader2 size={16} className="animate-spin" /> Upload en cours...</> : "Uploader la vidéo"}
          </button>
        </div>

      {/* LISTE VIDÉOS EXISTANTES */}
<div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
  <h2 className="text-lg font-semibold text-[#122e53] mb-6">Vidéos existantes ({Object.keys(videoMap).length})</h2>
  {Object.keys(videoMap).length === 0 ? (
    <p className="text-sm text-gray-400">Aucune vidéo pour l'instant.</p>
  ) : (
    <div className="flex flex-col gap-3">
      {Object.entries(videoMap).map(([id, url]) => {
        const property = properties.find(p => p.id === id);
        return (
          <div key={id} className="flex items-center justify-between p-4 bg-[#f5f5f5] rounded-lg">
            <div>
              <p className="text-sm font-medium text-[#122e53]">{property?.title || id}</p>
              <p className="text-xs text-gray-400 mt-0.5">{property?.city} — {id}</p>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={() => setPreviewUrl(url)} className="text-gray-300 hover:text-[#122e53] transition">
                <Eye size={18} />
              </button>
              <button onClick={() => handleDelete(id)} className="text-gray-300 hover:text-red-500 transition">
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  )}
</div>

{/* POPUP PREVIEW */}
{previewUrl && (
  <div
    className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
    onClick={() => setPreviewUrl(null)}
  >
    <div className="relative max-w-2xl w-full" onClick={e => e.stopPropagation()}>
      <button
        onClick={() => setPreviewUrl(null)}
        className="absolute -top-10 right-0 text-white/70 hover:text-white transition"
      >
        <X size={24} />
      </button>
      <video
        src={previewUrl}
        controls
        autoPlay
        className="w-full rounded-xl shadow-2xl max-h-[80vh]"
      />
    </div>
  </div>
)}

      </main>
    </div>
  );
}