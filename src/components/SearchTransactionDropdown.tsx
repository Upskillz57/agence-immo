"use client";

import { useState, useRef, useEffect } from "react";

export default function SearchTransactionDropdown({
  value,
  onChange
}: {
  value: string;
  onChange: (v: string) => void;
}) {

  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: any) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const options = [
    { label: "À vendre", value: "vente" },
    { label: "À louer", value: "location" }
  ];

  const current = options.find(o => o.value === value);

  return (
    <div className="relative" ref={ref}>

      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-3 text-[#122e53] font-medium"
      >
        {current?.label}
        <span className="text-sm">▾</span>
      </button>

      {open && (
        <div className="
          absolute
          top-12
          left-0
          w-40
          bg-white
          rounded-xl
          shadow-xl
          border
          overflow-hidden
          z-50
        ">

          {options.map(option => (
            <button
              key={option.value}
              onClick={() => {
                onChange(option.value);
                setOpen(false);
              }}
              className="
                w-full
                text-left
                px-4
                py-3
                text-sm
                text-gray-700
                hover:bg-[#122e53]
                hover:text-white
                transition
              "
            >
              {option.label}
            </button>
          ))}

        </div>
      )}

    </div>
  );
}