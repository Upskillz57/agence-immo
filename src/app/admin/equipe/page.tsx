"use client";

import { useState, useEffect, useRef } from "react";
import { Montserrat } from "next/font/google";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ArrowLeft, Pencil, CheckCircle, Loader2, X, Plus, Trash2, UserPlus } from "lucide-react";

const montserrat = Montserrat({ subsets: ["latin"], weight: ["400", "500", "600", "700"] });

type Advisor = {
  id: string;
  name: string;
  role: string;
  phone: string;
  email: string;
  image: string;
};

const EMPTY: Omit<Advisor, "id"> = { name: "", role: "Agent commercial", phone: "", email: "", image: "" };

export default function AdminEquipe() {
  const router = useRouter();
  const [advisors, setAdvisors] = useState<Advisor[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<Partial<Advisor>>({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [error, setError] = useState("");
  const [addingNew, setAddingNew] = useState(false);
  const [newData, setNewData] = useState<Omit<Advisor, "id">>(EMPTY);
  const [savingNew, setSavingNew] = useState(false);
  const [uploadingNewPhoto, setUploadingNewPhoto] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const newFileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch("/api/admin/equipe")
      .then(r => r.json())
      .then(data => { setAdvisors(data); setLoading(false); });
  }, []);

  function startEdit(advisor: Advisor) {
    setEditingId(advisor.id);
    setEditData({ ...advisor });
    setError("");
    setSaved(false);
  }

  function cancelEdit() { setEditingId(null); setEditData({}); setError(""); }

  async function handlePhotoUpload(file: File, isNew = false) {
    if (file.size > 5 * 1024 * 1024) { setError("Photo trop lourde (max 5MB)"); return; }
    isNew ? setUploadingNewPhoto(true) : setUploadingPhoto(true);
    try {
      const id = isNew ? `new-${Date.now()}` : editingId;
      const ext = file.name.split(".").pop();
      const res = await fetch("/api/admin/upload-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ filename: `equipe/${id}.${ext}`, contentType: file.type }),
      });
      const { uploadUrl, publicUrl } = await res.json();
      await fetch(uploadUrl, { method: "PUT", headers: { "Content-Type": file.type }, body: file });
      if (isNew) setNewData(prev => ({ ...prev, image: publicUrl }));
      else setEditData(prev => ({ ...prev, image: publicUrl }));
    } catch { setError("Erreur upload photo"); }
    finally { isNew ? setUploadingNewPhoto(false) : setUploadingPhoto(false); }
  }

  async function saveAdvisor() {
    if (!editingId) return;
    setSaving(true); setError("");
    try {
      await fetch("/api/admin/equipe", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: editingId, ...editData }),
      });
      setAdvisors(prev => prev.map(a => a.id === editingId ? { ...a, ...editData } as Advisor : a));
      setSaved(true);
      setTimeout(() => { setSaved(false); setEditingId(null); }, 1500);
    } catch { setError("Erreur lors de la sauvegarde"); }
    finally { setSaving(false); }
  }

  async function deleteAdvisor(id: string, name: string) {
    if (!confirm(`Supprimer ${name} de l'équipe ?`)) return;
    await fetch("/api/admin/equipe", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    setAdvisors(prev => prev.filter(a => a.id !== id));
  }

  async function addAdvisor() {
    if (!newData.name.trim()) { setError("Le nom est obligatoire"); return; }
    setSavingNew(true); setError("");
    try {
      const id = newData.name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "") + "-" + Date.now();
      const advisor = { id, ...newData };
      await fetch("/api/admin/equipe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(advisor),
      });
      setAdvisors(prev => [...prev, advisor]);
      setAddingNew(false);
      setNewData(EMPTY);
    } catch { setError("Erreur lors de l'ajout"); }
    finally { setSavingNew(false); }
  }

  const fields = [
    { key: "name", label: "Nom complet" },
    { key: "role", label: "Rôle" },
    { key: "phone", label: "Téléphone" },
    { key: "email", label: "Email" },
  ];

  if (loading) return (
    <div className={`${montserrat.className} min-h-screen bg-[#f5f5f5] flex items-center justify-center`}>
      <Loader2 className="animate-spin text-[#122e53]" size={28} />
    </div>
  );

  return (
    <div className={`${montserrat.className} min-h-screen bg-[#f5f5f5]`}>

      <header className="bg-[#122e53] px-6 md:px-10 h-[70px] flex items-center gap-4">
        <button onClick={() => router.push("/admin/dashboard")} className="text-white/70 hover:text-white transition">
          <ArrowLeft size={20} />
        </button>
        <div className="relative w-[120px] h-[40px]">
          <Image src="/logo-marchal.png" alt="Marchal Immobilier" fill sizes="120px" className="object-contain" />
        </div>
        <span className="text-white/50 text-sm ml-2">/ Gestion de l'équipe</span>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-10">

        {/* LISTE */}
        <div className="flex flex-col gap-4 mb-6">
          {advisors.map(advisor => (
            <div key={advisor.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              {editingId === advisor.id ? (

                /* MODE ÉDITION */
                <div className="flex gap-6">
                  <div className="flex-shrink-0 flex flex-col items-center gap-2">
                    <div
                      className="relative w-24 h-24 rounded-full overflow-hidden cursor-pointer border-2 border-dashed border-gray-200 hover:border-[#122e53] transition"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      {editData.image ? (
                        <Image src={editData.image} alt="" fill sizes="96px" className="object-cover object-top" />
                      ) : (
                        <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                          <Plus size={20} className="text-gray-300" />
                        </div>
                      )}
                      {uploadingPhoto && (
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                          <Loader2 size={18} className="text-white animate-spin" />
                        </div>
                      )}
                    </div>
                    <p className="text-xs text-gray-400 text-center">Changer</p>
                    <input ref={fileInputRef} type="file" accept="image/*" className="hidden"
                      onChange={e => { const f = e.target.files?.[0]; if (f) handlePhotoUpload(f); }} />
                  </div>

                  <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3">
                    {fields.map(({ key, label }) => (
                      <div key={key}>
                        <label className="block text-xs font-semibold uppercase tracking-widest text-gray-400 mb-1">{label}</label>
                        <input
                          type="text"
                          value={(editData as any)[key] ?? ""}
                          onChange={e => setEditData(prev => ({ ...prev, [key]: e.target.value }))}
                          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-[#122e53] outline-none focus:border-[#122e53] transition"
                        />
                      </div>
                    ))}
                    {error && <p className="col-span-2 text-red-500 text-xs">{error}</p>}
                    <div className="col-span-2 flex gap-3 mt-1">
                      <button onClick={saveAdvisor} disabled={saving}
                        className="flex items-center gap-2 bg-[#122e53] text-white text-xs font-semibold px-5 py-2.5 rounded-full hover:bg-black transition disabled:opacity-40">
                        {saving ? <><Loader2 size={13} className="animate-spin" /> Sauvegarde...</>
                          : saved ? <><CheckCircle size={13} /> Sauvegardé</>
                          : "Sauvegarder"}
                      </button>
                      <button onClick={cancelEdit}
                        className="flex items-center gap-2 text-gray-400 hover:text-[#122e53] text-xs font-semibold px-4 py-2.5 rounded-full border border-gray-200 transition">
                        <X size={13} /> Annuler
                      </button>
                    </div>
                  </div>
                </div>

              ) : (

                /* MODE LECTURE */
                <div className="flex items-center gap-4">
                  <div className="relative w-14 h-14 rounded-full overflow-hidden flex-shrink-0">
                    <Image src={advisor.image || "/placeholder-avatar.jpg"} alt={advisor.name} fill sizes="56px" className="object-cover object-top" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-[#122e53]">{advisor.name}</p>
                    <p className="text-xs text-[#d4af37] uppercase tracking-wide mt-0.5">{advisor.role}</p>
                    <p className="text-xs text-gray-400 mt-1">{advisor.phone} · {advisor.email}</p>
                  </div>
                  <button onClick={() => startEdit(advisor)} className="text-gray-300 hover:text-[#122e53] transition">
                    <Pencil size={17} />
                  </button>
                  <button onClick={() => deleteAdvisor(advisor.id, advisor.name)} className="text-gray-300 hover:text-red-500 transition">
                    <Trash2 size={17} />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* FORMULAIRE AJOUT */}
        {addingNew ? (
          <div className="bg-white rounded-xl shadow-sm border border-[#122e53]/20 p-6">
            <h3 className="text-sm font-semibold text-[#122e53] mb-5">Nouveau conseiller</h3>
            <div className="flex gap-6">

              {/* PHOTO */}
              <div className="flex-shrink-0 flex flex-col items-center gap-2">
                <div
                  className="relative w-24 h-24 rounded-full overflow-hidden cursor-pointer border-2 border-dashed border-gray-200 hover:border-[#122e53] transition"
                  onClick={() => newFileInputRef.current?.click()}
                >
                  {newData.image ? (
                    <Image src={newData.image} alt="" fill sizes="96px" className="object-cover object-top" />
                  ) : (
                    <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                      <Plus size={20} className="text-gray-300" />
                    </div>
                  )}
                  {uploadingNewPhoto && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <Loader2 size={18} className="text-white animate-spin" />
                    </div>
                  )}
                </div>
                <p className="text-xs text-gray-400 text-center">Ajouter photo</p>
                <input ref={newFileInputRef} type="file" accept="image/*" className="hidden"
                  onChange={e => { const f = e.target.files?.[0]; if (f) handlePhotoUpload(f, true); }} />
              </div>

              {/* CHAMPS */}
              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3">
                {fields.map(({ key, label }) => (
                  <div key={key}>
                    <label className="block text-xs font-semibold uppercase tracking-widest text-gray-400 mb-1">{label}</label>
                    <input
                      type="text"
                      value={(newData as any)[key] ?? ""}
                      onChange={e => setNewData(prev => ({ ...prev, [key]: e.target.value }))}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-[#122e53] outline-none focus:border-[#122e53] transition"
                    />
                  </div>
                ))}
                {error && <p className="col-span-2 text-red-500 text-xs">{error}</p>}
                <div className="col-span-2 flex gap-3 mt-1">
                  <button onClick={addAdvisor} disabled={savingNew}
                    className="flex items-center gap-2 bg-[#122e53] text-white text-xs font-semibold px-5 py-2.5 rounded-full hover:bg-black transition disabled:opacity-40">
                    {savingNew ? <><Loader2 size={13} className="animate-spin" /> Ajout...</> : "Ajouter"}
                  </button>
                  <button onClick={() => { setAddingNew(false); setNewData(EMPTY); setError(""); }}
                    className="flex items-center gap-2 text-gray-400 hover:text-[#122e53] text-xs font-semibold px-4 py-2.5 rounded-full border border-gray-200 transition">
                    <X size={13} /> Annuler
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <button
            onClick={() => { setAddingNew(true); setError(""); }}
            className="w-full flex items-center justify-center gap-2 border-2 border-dashed border-gray-200 rounded-xl py-5 text-sm text-gray-400 hover:border-[#122e53] hover:text-[#122e53] transition"
          >
            <UserPlus size={18} /> Ajouter un conseiller
          </button>
        )}

      </main>
    </div>
  );
}