"use client";
import { Fragment, useEffect, useRef, useState, type ReactNode } from "react";

// ─── Mise en forme du texte brut Hektor ───────────────────────────────────────
type Block =
  | { kind: "heading"; text: string }
  | { kind: "list"; items: string[] }
  | { kind: "paragraph"; text: string; lead?: boolean };

// "- jardin", "• cave", "o Une chambre…" (puces Word collées dans Hektor)
const BULLET_RE = /^(?:[-•*✓✔➢►▪·–]|o(?=\s))\s*/;
const PHONE_RE  = /(0\d(?:[ .]?\d{2}){4})/g;

function isHeading(line: string) {
  if (line.length > 80) return false;
  // "Les points forts :", "À l'étage :", "LES ATOUTS DU BIEN :"
  if (/:\s*$/.test(line)) return true;
  // "**Charmante maison lorraine**"
  if (/^\*\*[^*]+\*\*$/.test(line)) return true;
  // Ligne courte entièrement en majuscules (hors numéros de téléphone)
  const letters = line.replace(/[^A-Za-zÀ-ÿ]/g, "");
  return letters.length >= 4 && letters === letters.toUpperCase() && !/\d{2}/.test(line);
}

function parseDescription(text: string): Block[] {
  const blocks: Block[] = [];
  const lines = text.replace(/\r/g, "").split("\n").map(l => l.trim());

  for (const line of lines) {
    if (!line) continue;
    const last = blocks[blocks.length - 1];

    if (BULLET_RE.test(line) && !/^\*\*/.test(line) && line.replace(BULLET_RE, "")) {
      const item = line.replace(BULLET_RE, "");
      if (last?.kind === "list") last.items.push(item);
      else blocks.push({ kind: "list", items: [item] });
    } else if (isHeading(line)) {
      blocks.push({ kind: "heading", text: line.replace(/\*\*/g, "").replace(/\s*:\s*$/, "") });
    } else {
      blocks.push({ kind: "paragraph", text: line });
    }
  }

  // Phrase d'accroche : premier paragraphe court mis en avant
  const first = blocks[0];
  if (first?.kind === "paragraph" && first.text.length <= 140) first.lead = true;

  return blocks;
}

// **gras** et numéros de téléphone cliquables
function renderInline(text: string): ReactNode[] {
  return text.split(/(\*\*[^*]+\*\*)/g).map((part, i) => {
    if (/^\*\*[^*]+\*\*$/.test(part)) {
      return <strong key={i} className="font-semibold text-gray-900">{part.slice(2, -2)}</strong>;
    }
    return (
      <Fragment key={i}>
        {part.split(PHONE_RE).map((chunk, j) =>
          j % 2 === 1 ? (
            <a key={j} href={`tel:${chunk.replace(/\D/g, "")}`} className="font-medium text-[#c79b4b] hover:underline whitespace-nowrap">
              {chunk}
            </a>
          ) : (
            chunk.replace(/\*\*/g, "")
          )
        )}
      </Fragment>
    );
  });
}

// ─── Composant ────────────────────────────────────────────────────────────────
const COLLAPSED_HEIGHT = 260; // px

export default function PropertyDescription({ description }: { description: string }) {
  const [expanded, setExpanded] = useState(false);
  const [isLong,   setIsLong]   = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  const blocks = parseDescription(description || "");

  useEffect(() => {
    if (contentRef.current) setIsLong(contentRef.current.scrollHeight > COLLAPSED_HEIGHT + 40);
  }, [description]);

  return (
    <div className="mb-10">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Description</h2>

      <div className="relative">
        <div
          ref={contentRef}
          className="space-y-4 text-gray-600 leading-relaxed overflow-hidden"
          style={{ maxHeight: isLong && !expanded ? COLLAPSED_HEIGHT : undefined }}
        >
          {blocks.map((b, i) => {
            if (b.kind === "heading") {
              return (
                <h3 key={i} className="font-semibold text-gray-900 pt-2">
                  {renderInline(b.text)}
                </h3>
              );
            }
            if (b.kind === "list") {
              return (
                <ul key={i} className="space-y-1.5">
                  {b.items.map((item, j) => (
                    <li key={j} className="flex gap-2">
                      <span className="mt-[9px] h-1.5 w-1.5 shrink-0 rounded-full bg-[#c79b4b]" />
                      <span>{renderInline(item)}</span>
                    </li>
                  ))}
                </ul>
              );
            }
            return (
              <p key={i} className={b.lead ? "text-lg font-semibold text-gray-900" : ""}>
                {renderInline(b.text)}
              </p>
            );
          })}
        </div>

        {isLong && !expanded && (
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-white to-transparent" />
        )}
      </div>

      {isLong && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="mt-3 text-sm font-medium text-gray-900 flex items-center gap-1 hover:underline"
        >
          {expanded ? "lire moins ▴" : "lire plus ▾"}
        </button>
      )}
    </div>
  );
}
