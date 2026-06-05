"use client";
import { useState } from "react";

export default function PropertyDescription({ description }: { description: string }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="mb-10">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Description</h2>
      <p className={`text-gray-600 leading-relaxed ${expanded ? "" : "line-clamp-6"}`}>
        {description}
      </p>
      <button
        onClick={() => setExpanded(!expanded)}
        className="mt-3 text-sm font-medium text-gray-900 flex items-center gap-1 hover:underline"
      >
        {expanded ? "lire moins ▴" : "lire plus ▾"}
      </button>
    </div>
  );
}