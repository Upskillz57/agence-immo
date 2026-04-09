"use client";

import { useState, useRef, useEffect } from "react";

export default function SearchPriceDropdown({
  value,
  onChange
}: {
  value: string;
  onChange: (v: string) => void;
}) {

  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e:any) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const options = [
    { label: "Tous les prix", value: "" },
    { label: "300 000 €", value: "300000" },
    { label: "500 000 €", value: "500000" },
    { label: "1 000 000 €", value: "1000000" }
  ];

  const current = options.find(o => o.value === value) || options[0];

  return (
    <div className="relative" ref={ref}>

      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-3 font-medium text-[#122e53]"
      >
        {current.label}
        <span className="text-xs">▾</span>
      </button>

      {open && (
        <div className="
          absolute
          top-12
          left-0
          w-44
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