"use client";

export default function GoogleReviewsBadge() {
  return (
    <a
      href="https://www.google.com/search?q=Marchal+Immobilier+Metz+avis"
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/40 backdrop-blur-sm rounded-full px-3 py-1.5 transition-all duration-300 group"
      aria-label="Voir nos avis Google"
    >
      {/* Google G */}
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
      </svg>

      {/* Étoiles */}
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            width="11"
            height="11"
            viewBox="0 0 24 24"
            fill={star <= 4 ? "#FBBC05" : "url(#halfStar)"}
            xmlns="http://www.w3.org/2000/svg"
          >
            {star === 5 && (
              <defs>
                <linearGradient id="halfStar" x1="0" x2="1" y1="0" y2="0">
                  <stop offset="90%" stopColor="#FBBC05" />
                  <stop offset="90%" stopColor="#ffffff40" />
                </linearGradient>
              </defs>
            )}
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
        ))}
      </div>

      {/* Note et nombre d'avis */}
      <span className="text-white text-[12px] font-semibold leading-none">4,9</span>
      <span className="text-white/60 text-[11px] leading-none hidden xl:inline">· 134 avis</span>
    </a>
  );
}
