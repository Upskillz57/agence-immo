// src/components/calendrier/CalendrierClient.tsx
"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { X, Phone, MapPin, FileText, ChevronLeft, ChevronRight, Check, RefreshCw, Clock, Plus } from "lucide-react";
import { createClient } from "@supabase/supabase-js";

// ─── CONFIG ──────────────────────────────────────────────────────────────────

const GIOVANNI_WHATSAPP = "33633067523"; // Numéro Giovanni

// 👇 Remplacez par vos vraies valeurs Supabase (Settings > API)
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const AGENTS: Record<string, { color: string; bg: string; light: string; initials: string }> = {
  JP:      { color: "#534AB7", bg: "#534AB7", light: "#EEEDFE", initials: "JP" },
  Fabien:  { color: "#0F6E56", bg: "#0F6E56", light: "#E1F5EE", initials: "FA" },
  Laurent: { color: "#D85A30", bg: "#D85A30", light: "#FAECE7", initials: "LA" },
  Jérôme:  { color: "#D4537E", bg: "#D4537E", light: "#FBEAF0", initials: "JE" },
  Benoit:  { color: "#378ADD", bg: "#378ADD", light: "#E6F1FB", initials: "BE" },
  CA:      { color: "#639922", bg: "#639922", light: "#EAF3DE", initials: "CA" },
  Azziza:  { color: "#BA7517", bg: "#BA7517", light: "#FAEEDA", initials: "AZ" },
};

const DAYS_FR = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];
const DAYS_FULL = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];
const MONTHS_FR = ["Janvier","Février","Mars","Avril","Mai","Juin","Juillet","Août","Septembre","Octobre","Novembre","Décembre"];

const START_HOUR = 7;
const END_HOUR = 20;
const SLOT_HEIGHT = 48; // px par heure

// ─── TYPES ───────────────────────────────────────────────────────────────────

type Status = "pending" | "confirmed" | "reschedule";

interface CalEvent {
  id: string;
  agent: string;
  title: string;
  lieu: string;
  tel: string;
  description: string;
  date: string; // "YYYY-MM-DD"
  startH: number;
  startM: number;
  endH: number;
  endM: number;
  status: Status;
  createdAt: number;
}

// ─── HELPERS ─────────────────────────────────────────────────────────────────

function dateKey(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function getWeekDates(offset: number): Date[] {
  const now = new Date();
  const day = now.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  const mon = new Date(now);
  mon.setDate(now.getDate() + diff + offset * 7);
  mon.setHours(0, 0, 0, 0);
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(mon);
    d.setDate(mon.getDate() + i);
    return d;
  });
}

function fmtTime(h: number, m: number) {
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

function formatDateFR(d: Date) {
  return `${d.getDate()} ${MONTHS_FR[d.getMonth()]} ${d.getFullYear()}`;
}

function formatDateShort(d: Date) {
  return `${d.getDate()} ${MONTHS_FR[d.getMonth()].substring(0, 3)}`;
}

function isToday(d: Date) {
  const t = new Date();
  return d.getDate() === t.getDate() && d.getMonth() === t.getMonth() && d.getFullYear() === t.getFullYear();
}

function sendWhatsApp(ev: CalEvent, weekDates: Date[]) {
  const evDate = weekDates.find(d => dateKey(d) === ev.date);
  const dateFmt = evDate ? formatDateFR(evDate) : ev.date;
  const msg = encodeURIComponent(
    `📅 *Nouvelle demande vidéo*\n\n` +
    `👤 Agent : *${ev.agent}*\n` +
    `🏠 Bien : *${ev.title}*\n` +
    `📍 Lieu : ${ev.lieu || "—"}\n` +
    `📞 Contact : ${ev.tel || "—"}\n` +
    `⏰ Date : ${dateFmt}\n` +
    `🕐 Horaire : ${fmtTime(ev.startH, ev.startM)} – ${fmtTime(ev.endH, ev.endM)}\n` +
    (ev.description ? `\n📝 ${ev.description}` : "") +
    `\n\n_Répondez CONFIRME, REFUS ou proposez une autre date_`
  );
  window.open(`https://wa.me/${GIOVANNI_WHATSAPP}?text=${msg}`, "_blank");
}

// ─── MAIN COMPONENT ──────────────────────────────────────────────────────────

export default function CalendrierClient() {
  const [currentAgent, setCurrentAgent] = useState<string>("");
  const [weekOffset, setWeekOffset] = useState(0);
  const [events, setEvents] = useState<CalEvent[]>([]);
  const [modal, setModal] = useState<{ open: boolean; dayIdx: number; startH: number; endH: number; editId?: string } | null>(null);
  const [mobileDay, setMobileDay] = useState<number>(() => {
    const now = new Date();
    const d = now.getDay();
    return d === 0 ? 6 : d - 1;
  });
  const [notification, setNotification] = useState<string>("");
  const [isGiovanni] = useState(false); // En prod: auth simple par mot de passe
  const dragRef = useRef<{ dayIdx: number; startSlot: number } | null>(null);
  const [dragEnd, setDragEnd] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const weekDates = getWeekDates(weekOffset);

  // ── Supabase: charger les événements
  useEffect(() => {
    async function loadEvents() {
      const { data, error } = await supabase
        .from("cal_events")
        .select("*")
        .order("created_at", { ascending: true });
      if (error) { console.error("Supabase load error:", error); return; }
      if (data) {
        // Mapper snake_case → camelCase
        setEvents(data.map((r: any) => ({
          id: r.id,
          agent: r.agent,
          title: r.title,
          lieu: r.lieu,
          tel: r.tel,
          description: r.description,
          date: r.date,
          startH: r.start_h,
          startM: r.start_m,
          endH: r.end_h,
          endM: r.end_m,
          status: r.status,
          createdAt: r.created_at,
        })));
      }
    }
    loadEvents();

    // Realtime: mise à jour en temps réel pour tous les agents
    const channel = supabase
      .channel("cal_events_changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "cal_events" }, () => {
        loadEvents();
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  function showNotif(msg: string) {
    setNotification(msg);
    setTimeout(() => setNotification(""), 3500);
  }

  function openNewModal(dayIdx: number, startH: number, endH: number) {
    if (!currentAgent) { showNotif("⚠ Sélectionnez votre identité d'abord"); return; }
    setModal({ open: true, dayIdx, startH, endH });
  }

  function openEditModal(id: string) {
    setModal({ open: true, dayIdx: 0, startH: 8, endH: 9, editId: id });
  }

  function closeModal() { setModal(null); }

  async function saveEvent(data: Omit<CalEvent, "id" | "status" | "createdAt">) {
    if (modal?.editId) {
      const { error } = await supabase
        .from("cal_events")
        .update({
          title: data.title, lieu: data.lieu, tel: data.tel,
          description: data.description, date: data.date,
          start_h: data.startH, start_m: data.startM,
          end_h: data.endH, end_m: data.endM,
        })
        .eq("id", modal.editId);
      if (error) { showNotif("❌ Erreur mise à jour"); console.error(error); return; }
      showNotif("✅ Événement mis à jour");
      closeModal();
    } else {
      const newEv: CalEvent = { ...data, id: Date.now().toString(), status: "pending", createdAt: Date.now() };
      const { error } = await supabase.from("cal_events").insert({
        id: newEv.id, agent: newEv.agent, title: newEv.title,
        lieu: newEv.lieu, tel: newEv.tel, description: newEv.description,
        date: newEv.date, start_h: newEv.startH, start_m: newEv.startM,
        end_h: newEv.endH, end_m: newEv.endM,
        status: "pending", created_at: newEv.createdAt,
      });
      if (error) { showNotif("❌ Erreur enregistrement"); console.error(error); return; }
      sendWhatsApp(newEv, weekDates);
      showNotif("✅ Demande envoyée ! Giovanni notifié via WhatsApp.");
      closeModal();
    }
  }

  async function deleteEvent(id: string) {
    const { error } = await supabase.from("cal_events").delete().eq("id", id);
    if (error) { showNotif("❌ Erreur suppression"); return; }
    closeModal();
    showNotif("🗑 Événement supprimé");
  }

  async function updateStatus(id: string, status: Status) {
    const { error } = await supabase.from("cal_events").update({ status }).eq("id", id);
    if (error) { showNotif("❌ Erreur statut"); return; }
    showNotif(status === "confirmed" ? "✅ Confirmé !" : "🔄 Autre date proposée");
  }

  // ── Drag handlers
  const handleSlotMouseDown = useCallback((dayIdx: number, slotIdx: number, e: React.MouseEvent) => {
    e.preventDefault();
    dragRef.current = { dayIdx, startSlot: slotIdx };
    setDragEnd(slotIdx);
    setIsDragging(true);
  }, []);

  const handleSlotMouseEnter = useCallback((dayIdx: number, slotIdx: number) => {
    if (!isDragging || !dragRef.current || dragRef.current.dayIdx !== dayIdx) return;
    setDragEnd(slotIdx);
  }, [isDragging]);

  const handleSlotMouseUp = useCallback((dayIdx: number, slotIdx: number) => {
    if (!isDragging || !dragRef.current) return;
    if (dragRef.current.dayIdx === dayIdx) {
      const startH = START_HOUR + Math.min(dragRef.current.startSlot, slotIdx);
      const endH = START_HOUR + Math.max(dragRef.current.startSlot, slotIdx) + 1;
      openNewModal(dayIdx, startH, Math.min(endH, END_HOUR));
    }
    dragRef.current = null;
    setDragEnd(null);
    setIsDragging(false);
  }, [isDragging, currentAgent]);

  useEffect(() => {
    const up = () => { dragRef.current = null; setDragEnd(null); setIsDragging(false); };
    window.addEventListener("mouseup", up);
    return () => window.removeEventListener("mouseup", up);
  }, []);

  const editingEvent = modal?.editId ? events.find(e => e.id === modal.editId) : undefined;

  return (
    <div className="pt-[90px] min-h-screen bg-[#0d2240] text-white select-none">

      {/* ── HEADER ZONE ── */}
      <div className="bg-[#0d2240] border-b border-white/10 px-4 md:px-8 py-4">
        <div className="max-w-[1400px] mx-auto">

          {/* Title row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <div>
              <h1 className="text-lg font-semibold text-white tracking-wide">Calendrier Vidéo</h1>
              <p className="text-xs text-white/50 mt-0.5">Réservation de créneaux — Marchal Immobilier</p>
            </div>
            {/* Agent selector */}
            <div className="flex items-center gap-3">
              <span className="text-xs text-white/50">Je suis :</span>
              <div className="flex flex-wrap gap-2">
                {Object.entries(AGENTS).map(([name, cfg]) => (
                  <button
                    key={name}
                    onClick={() => setCurrentAgent(currentAgent === name ? "" : name)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all border ${
                      currentAgent === name
                        ? "text-white border-transparent scale-105"
                        : "border-white/20 text-white/60 hover:border-white/40 hover:text-white"
                    }`}
                    style={currentAgent === name ? { background: cfg.color, borderColor: cfg.color } : {}}
                  >
                    {name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Nav row */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setWeekOffset(w => w - 1)}
                className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/10 hover:bg-white/20 transition"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                onClick={() => setWeekOffset(0)}
                className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition text-xs font-medium"
              >
                Aujourd'hui
              </button>
              <button
                onClick={() => setWeekOffset(w => w + 1)}
                className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/10 hover:bg-white/20 transition"
              >
                <ChevronRight size={16} />
              </button>
              <span className="text-sm font-medium text-white/80 ml-2">
                {formatDateShort(weekDates[0])} – {formatDateShort(weekDates[6])} {weekDates[0].getFullYear()}
              </span>
            </div>

            {/* Mobile day tabs */}
            <div className="flex md:hidden gap-1 overflow-x-auto">
              {weekDates.map((d, i) => (
                <button
                  key={i}
                  onClick={() => setMobileDay(i)}
                  className={`flex flex-col items-center px-2 py-1 rounded-lg text-[10px] transition min-w-[36px] ${
                    mobileDay === i ? "bg-[#c79b4b] text-white" : "text-white/50 hover:text-white"
                  }`}
                >
                  <span>{DAYS_FR[i]}</span>
                  <span className={`font-bold text-sm ${isToday(d) ? "text-[#c79b4b]" : ""}`}>{d.getDate()}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── CALENDAR BODY ── */}
      <div className="max-w-[1400px] mx-auto px-2 md:px-8 py-4">
        <div className="bg-[#122e53]/60 rounded-xl overflow-hidden border border-white/10">

          {/* Day headers — desktop */}
          <div className="hidden md:grid border-b border-white/10" style={{ gridTemplateColumns: "56px repeat(7, 1fr)" }}>
            <div className="h-12" />
            {weekDates.map((d, i) => (
              <div
                key={i}
                className={`h-12 flex flex-col items-center justify-center border-l border-white/10 text-xs font-medium transition ${
                  isToday(d) ? "bg-[#c79b4b]/20" : ""
                }`}
              >
                <span className="text-white/50">{DAYS_FR[i]}</span>
                <span className={`font-bold text-sm ${isToday(d) ? "text-[#c79b4b]" : "text-white"}`}>
                  {d.getDate()}
                </span>
              </div>
            ))}
          </div>

          {/* Day header — mobile (single day) */}
          <div className="md:hidden h-12 flex items-center justify-center border-b border-white/10 bg-[#c79b4b]/10">
            <span className="text-sm font-semibold text-white">
              {DAYS_FULL[mobileDay]} {weekDates[mobileDay].getDate()} {MONTHS_FR[weekDates[mobileDay].getMonth()]}
            </span>
          </div>

          {/* Time grid */}
          <div className="overflow-y-auto" style={{ maxHeight: "calc(100vh - 280px)", minHeight: 400 }}>

            {/* Desktop: all 7 days */}
            <div className="hidden md:grid" style={{ gridTemplateColumns: "56px repeat(7, 1fr)" }}>
              {/* Time labels */}
              <div>
                {Array.from({ length: END_HOUR - START_HOUR }, (_, i) => (
                  <div
                    key={i}
                    style={{ height: SLOT_HEIGHT }}
                    className="flex items-start justify-end pr-2 pt-1"
                  >
                    <span className="text-[10px] text-white/30">{fmtTime(START_HOUR + i, 0)}</span>
                  </div>
                ))}
              </div>

              {/* Day columns */}
              {weekDates.map((d, dayIdx) => (
                <DayColumn
                  key={dayIdx}
                  dayIdx={dayIdx}
                  date={d}
                  events={events.filter(e => e.date === dateKey(d))}
                  slotCount={END_HOUR - START_HOUR}
                  startHour={START_HOUR}
                  slotHeight={SLOT_HEIGHT}
                  isDragging={isDragging}
                  dragRef={dragRef}
                  dragEnd={dragEnd}
                  onMouseDown={handleSlotMouseDown}
                  onMouseEnter={handleSlotMouseEnter}
                  onMouseUp={handleSlotMouseUp}
                  onEventClick={openEditModal}
                  onDblClick={(di, h) => openNewModal(di, h, h + 1)}
                />
              ))}
            </div>

            {/* Mobile: single day */}
            <div className="md:hidden flex">
              <div className="w-12 flex-shrink-0">
                {Array.from({ length: END_HOUR - START_HOUR }, (_, i) => (
                  <div key={i} style={{ height: SLOT_HEIGHT }} className="flex items-start justify-end pr-2 pt-1">
                    <span className="text-[10px] text-white/30">{fmtTime(START_HOUR + i, 0)}</span>
                  </div>
                ))}
              </div>
              <div className="flex-1">
                <DayColumn
                  dayIdx={mobileDay}
                  date={weekDates[mobileDay]}
                  events={events.filter(e => e.date === dateKey(weekDates[mobileDay]))}
                  slotCount={END_HOUR - START_HOUR}
                  startHour={START_HOUR}
                  slotHeight={SLOT_HEIGHT}
                  isDragging={isDragging}
                  dragRef={dragRef}
                  dragEnd={dragEnd}
                  onMouseDown={handleSlotMouseDown}
                  onMouseEnter={handleSlotMouseEnter}
                  onMouseUp={handleSlotMouseUp}
                  onEventClick={openEditModal}
                  onDblClick={(di, h) => openNewModal(di, h, h + 1)}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="mt-4 flex flex-wrap gap-3 items-center">
          <span className="text-xs text-white/40">Agents :</span>
          {Object.entries(AGENTS).map(([name, cfg]) => (
            <div key={name} className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full" style={{ background: cfg.color }} />
              <span className="text-xs text-white/60">{name}</span>
            </div>
          ))}
          <div className="ml-4 flex items-center gap-3">
            <span className="text-xs text-white/40">Statuts :</span>
            <StatusBadge status="pending" />
            <StatusBadge status="confirmed" />
            <StatusBadge status="reschedule" />
          </div>
        </div>

        {/* Mobile FAB */}
        <button
          onClick={() => { if (!currentAgent) { showNotif("⚠ Sélectionnez votre identité d'abord"); return; } openNewModal(mobileDay, 10, 11); }}
          className="md:hidden fixed bottom-6 right-6 w-14 h-14 rounded-full bg-[#c79b4b] flex items-center justify-center shadow-xl z-40 hover:bg-[#b8893e] transition"
        >
          <Plus size={24} className="text-white" />
        </button>
      </div>

      {/* ── MODAL ── */}
      {modal?.open && (
        <EventModal
          editEvent={editingEvent}
          defaultDayIdx={modal.dayIdx}
          defaultStartH={modal.startH}
          defaultEndH={modal.endH}
          weekDates={weekDates}
          currentAgent={currentAgent}
          onSave={saveEvent}
          onDelete={deleteEvent}
          onUpdateStatus={updateStatus}
          onClose={closeModal}
        />
      )}

      {/* ── NOTIFICATION ── */}
      {notification && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[200] bg-[#122e53] border border-[#c79b4b]/40 text-white px-5 py-3 rounded-xl shadow-2xl text-sm font-medium animate-fade-in">
          {notification}
        </div>
      )}

      <style>{`
        @keyframes fade-in { from { opacity:0; transform: translateY(8px) translateX(-50%); } to { opacity:1; transform: translateY(0) translateX(-50%); } }
        .animate-fade-in { animation: fade-in 0.3s ease forwards; }
      `}</style>
    </div>
  );
}

// ─── DAY COLUMN ──────────────────────────────────────────────────────────────

function DayColumn({
  dayIdx, date, events, slotCount, startHour, slotHeight,
  isDragging, dragRef, dragEnd,
  onMouseDown, onMouseEnter, onMouseUp, onEventClick, onDblClick
}: {
  dayIdx: number; date: Date; events: CalEvent[];
  slotCount: number; startHour: number; slotHeight: number;
  isDragging: boolean;
  dragRef: React.MutableRefObject<{ dayIdx: number; startSlot: number } | null>;
  dragEnd: number | null;
  onMouseDown: (d: number, s: number, e: React.MouseEvent) => void;
  onMouseEnter: (d: number, s: number) => void;
  onMouseUp: (d: number, s: number) => void;
  onEventClick: (id: string) => void;
  onDblClick: (d: number, h: number) => void;
}) {
  const totalHeight = slotCount * slotHeight;
  const today = isToday(date);

  return (
    <div
      className={`relative border-l border-white/10 ${today ? "bg-[#c79b4b]/5" : ""}`}
      style={{ height: totalHeight }}
    >
      {/* Slot rows */}
      {Array.from({ length: slotCount }, (_, i) => {
        const isDragActive = isDragging && dragRef.current?.dayIdx === dayIdx && dragEnd !== null;
        const minSlot = isDragActive ? Math.min(dragRef.current!.startSlot, dragEnd!) : -1;
        const maxSlot = isDragActive ? Math.max(dragRef.current!.startSlot, dragEnd!) : -1;
        const highlighted = isDragActive && i >= minSlot && i <= maxSlot;

        return (
          <div
            key={i}
            style={{ height: slotHeight, top: i * slotHeight }}
            className={`absolute left-0 right-0 border-t border-white/[0.07] cursor-pointer transition-colors ${
              highlighted ? "bg-[#c79b4b]/20" : "hover:bg-white/[0.03]"
            }`}
            onMouseDown={e => onMouseDown(dayIdx, i, e)}
            onMouseEnter={() => onMouseEnter(dayIdx, i)}
            onMouseUp={() => onMouseUp(dayIdx, i)}
            onDoubleClick={() => onDblClick(dayIdx, startHour + i)}
          />
        );
      })}

      {/* Events */}
      {events.map(ev => {
        const ag = AGENTS[ev.agent] || AGENTS.JP;
        const topPct = ((ev.startH - startHour) + ev.startM / 60) / slotCount;
        const heightPct = ((ev.endH - ev.startH) + (ev.endM - ev.startM) / 60) / slotCount;
        const topPx = topPct * totalHeight;
        const heightPx = Math.max(heightPct * totalHeight - 2, 20);

        return (
          <button
            key={ev.id}
            onClick={() => onEventClick(ev.id)}
            className="absolute left-1 right-1 rounded-md px-1.5 py-1 text-left overflow-hidden z-10 transition hover:brightness-90 group"
            style={{
              top: topPx,
              height: heightPx,
              background: ag.light,
              borderLeft: `3px solid ${ag.color}`,
            }}
          >
            <div className="flex items-start justify-between gap-1">
              <span className="text-[10px] font-semibold leading-tight truncate" style={{ color: ag.color }}>
                {ev.title.length > 20 ? ev.title.slice(0, 20) + "…" : ev.title}
              </span>
              <StatusDot status={ev.status} />
            </div>
            {heightPx > 30 && (
              <span className="text-[9px] opacity-70 leading-none" style={{ color: ag.color }}>
                {fmtTime(ev.startH, ev.startM)}–{fmtTime(ev.endH, ev.endM)} · {ev.agent}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

// ─── STATUS COMPONENTS ───────────────────────────────────────────────────────

function StatusDot({ status }: { status: Status }) {
  const map = { pending: "bg-amber-400", confirmed: "bg-green-400", reschedule: "bg-blue-400" };
  return <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 mt-0.5 ${map[status]}`} />;
}

function StatusBadge({ status }: { status: Status }) {
  const map = {
    pending:    { label: "En attente", cls: "bg-amber-400/20 text-amber-300" },
    confirmed:  { label: "Confirmé",   cls: "bg-green-400/20 text-green-300" },
    reschedule: { label: "Autre date", cls: "bg-blue-400/20 text-blue-300" },
  };
  const s = map[status];
  return <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${s.cls}`}>{s.label}</span>;
}

// ─── EVENT MODAL ─────────────────────────────────────────────────────────────

function EventModal({
  editEvent, defaultDayIdx, defaultStartH, defaultEndH,
  weekDates, currentAgent,
  onSave, onDelete, onUpdateStatus, onClose
}: {
  editEvent?: CalEvent;
  defaultDayIdx: number; defaultStartH: number; defaultEndH: number;
  weekDates: Date[];
  currentAgent: string;
  onSave: (data: Omit<CalEvent, "id" | "status" | "createdAt">) => void;
  onDelete: (id: string) => void;
  onUpdateStatus: (id: string, status: Status) => void;
  onClose: () => void;
}) {
  const agent = editEvent?.agent || currentAgent;
  const agCfg = AGENTS[agent] || AGENTS.JP;

  const [title, setTitle] = useState(editEvent?.title || "");
  const [lieu, setLieu] = useState(editEvent?.lieu || "");
  const [tel, setTel] = useState(editEvent?.tel || "");
  const [description, setDescription] = useState(editEvent?.description || "");
  const [dayIdx, setDayIdx] = useState(editEvent ? weekDates.findIndex(d => dateKey(d) === editEvent.date) : defaultDayIdx);
  const [startH, setStartH] = useState(editEvent?.startH ?? defaultStartH);
  const [startM, setStartM] = useState(editEvent?.startM ?? 0);
  const [endH, setEndH] = useState(editEvent?.endH ?? defaultEndH);
  const [endM, setEndM] = useState(editEvent?.endM ?? 0);
  const [error, setError] = useState("");

  function handleSubmit() {
    if (!title.trim()) { setError("Le titre est requis"); return; }
    if (endH * 60 + endM <= startH * 60 + startM) { setError("L'heure de fin doit être après le début"); return; }
    const safeDayIdx = Math.max(0, Math.min(6, dayIdx));
    onSave({
      agent, title: title.trim(), lieu: lieu.trim(), tel: tel.trim(), description: description.trim(),
      date: dateKey(weekDates[safeDayIdx]),
      startH, startM, endH, endM,
    });
  }

  const isOwner = !editEvent || editEvent.agent === currentAgent;
  const isGiovanni = currentAgent === "" || true; // Simplification: Giovanni peut tout voir

  return (
    <div
      className="fixed inset-0 z-[150] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-[#0d2240] border border-white/20 rounded-2xl w-full max-w-md shadow-2xl max-h-[90vh] overflow-y-auto">

        {/* Modal header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white"
              style={{ background: agCfg.color }}>
              {agCfg.initials}
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">
                {editEvent ? "Modifier la demande" : "Nouvelle demande vidéo"}
              </h3>
              <p className="text-xs text-white/40">{agent}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white/40 hover:text-white transition">
            <X size={18} />
          </button>
        </div>

        {/* Status actions (Giovanni only, on existing event) */}
        {editEvent && (
          <div className="px-6 pt-4 flex items-center gap-2">
            <span className="text-xs text-white/40">Statut :</span>
            <StatusBadge status={editEvent.status} />
            <div className="ml-auto flex gap-2">
              <button
                onClick={() => onUpdateStatus(editEvent.id, "confirmed")}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-green-500/20 hover:bg-green-500/30 text-green-300 text-xs font-medium transition"
              >
                <Check size={12} /> Confirmer
              </button>
              <button
                onClick={() => onUpdateStatus(editEvent.id, "reschedule")}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 text-xs font-medium transition"
              >
                <RefreshCw size={12} /> Autre date
              </button>
            </div>
          </div>
        )}

        {/* Form */}
        <div className="px-6 py-4 flex flex-col gap-4">

          {/* Title */}
          <div>
            <label className="text-xs text-white/50 mb-1 block">Titre / Adresse du bien *</label>
            <input
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Ex: Villa 5p – 12 Rue des Roses, Strasbourg"
              className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-[#c79b4b]/60"
              disabled={!!editEvent && !isOwner}
            />
          </div>

          {/* Day + Time */}
          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-3 sm:col-span-1">
              <label className="text-xs text-white/50 mb-1 block">Jour</label>
              <select
                value={dayIdx}
                onChange={e => setDayIdx(Number(e.target.value))}
                className="w-full bg-[#122e53] border border-white/20 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-[#c79b4b]/60"
                disabled={!!editEvent && !isOwner}
              >
                {weekDates.map((d, i) => (
                  <option key={i} value={i}>{DAYS_FR[i]} {d.getDate()}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs text-white/50 mb-1 block">Début</label>
              <input
                type="time"
                value={fmtTime(startH, startM)}
                onChange={e => { const [h,m]=e.target.value.split(":").map(Number); setStartH(h); setStartM(m); }}
                className="w-full bg-[#122e53] border border-white/20 rounded-lg px-2 py-2.5 text-sm text-white focus:outline-none focus:border-[#c79b4b]/60"
                disabled={!!editEvent && !isOwner}
              />
            </div>
            <div>
              <label className="text-xs text-white/50 mb-1 block">Fin</label>
              <input
                type="time"
                value={fmtTime(endH, endM)}
                onChange={e => { const [h,m]=e.target.value.split(":").map(Number); setEndH(h); setEndM(m); }}
                className="w-full bg-[#122e53] border border-white/20 rounded-lg px-2 py-2.5 text-sm text-white focus:outline-none focus:border-[#c79b4b]/60"
                disabled={!!editEvent && !isOwner}
              />
            </div>
          </div>

          {/* Lieu */}
          <div>
            <label className="text-xs text-white/50 mb-1 block flex items-center gap-1">
              <MapPin size={10} /> Lieu / Adresse précise
            </label>
            <input
              value={lieu}
              onChange={e => setLieu(e.target.value)}
              placeholder="Adresse complète du bien"
              className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-[#c79b4b]/60"
              disabled={!!editEvent && !isOwner}
            />
          </div>

          {/* Tel */}
          <div>
            <label className="text-xs text-white/50 mb-1 block flex items-center gap-1">
              <Phone size={10} /> Téléphone du contact
            </label>
            <input
              type="tel"
              value={tel}
              onChange={e => setTel(e.target.value)}
              placeholder="+33 6 xx xx xx xx"
              className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-[#c79b4b]/60"
              disabled={!!editEvent && !isOwner}
            />
          </div>

          {/* Description */}
          <div>
            <label className="text-xs text-white/50 mb-1 block flex items-center gap-1">
              <FileText size={10} /> Description / Notes
            </label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Infos complémentaires, accès, codes, notes…"
              rows={3}
              className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-[#c79b4b]/60 resize-none"
              disabled={!!editEvent && !isOwner}
            />
          </div>

          {/* Whatsapp info */}
          {!editEvent && (
            <div className="flex items-center gap-2 bg-[#25D366]/10 border border-[#25D366]/20 rounded-lg px-3 py-2.5">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="#25D366">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              <span className="text-xs text-[#25D366]">Giovanni recevra un WhatsApp à la validation</span>
            </div>
          )}

          {error && <p className="text-xs text-red-400">{error}</p>}

          {/* Actions */}
          <div className="flex gap-3 pt-1">
            {editEvent && isOwner && (
              <button
                onClick={() => onDelete(editEvent.id)}
                className="px-4 py-2.5 rounded-lg border border-red-400/30 text-red-400 hover:bg-red-400/10 transition text-sm"
              >
                Supprimer
              </button>
            )}
            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-lg border border-white/20 text-white/60 hover:bg-white/10 transition text-sm ml-auto"
            >
              Annuler
            </button>
            {(!editEvent || isOwner) && (
              <button
                onClick={handleSubmit}
                className="px-5 py-2.5 rounded-lg text-white text-sm font-semibold transition hover:brightness-110"
                style={{ background: agCfg.color }}
              >
                {editEvent ? "Mettre à jour" : "Envoyer la demande"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}