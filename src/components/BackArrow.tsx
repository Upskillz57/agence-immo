"use client";

import { useRouter } from "next/navigation";

export default function BackArrow() {
  const router = useRouter();

  return (
    <button
      onClick={() => {
        const savedUrl = sessionStorage.getItem("searchUrl");

        if (savedUrl) {
          router.push(savedUrl);
        } else {
          router.back();
        }
      }}
      className="
        absolute top-4 left-4 z-50
        w-10 h-10 md:w-11 md:h-11
        flex items-center justify-center
        rounded-full
        bg-white shadow-lg
        hover:scale-105 active:scale-95
        transition
      "
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-5 h-5 text-blue-600"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2.5}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 18l-6-6 6-6" />
      </svg>
    </button>
  );
}