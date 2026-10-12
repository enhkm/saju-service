/** 가운데 구름 문양이 있는 구분선 */
export function CloudDivider({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-3 text-line-strong ${className}`} aria-hidden>
      <span className="h-px flex-1 bg-current opacity-60" />
      <svg width="56" height="18" viewBox="0 0 56 18" fill="none" stroke="currentColor" strokeWidth="1.3">
        <path d="M4 12c0-4 3-6 6-6s5 2 5 4.5S13 14 11 14s-3-1.2-3-2.6S9 9 10.5 9" strokeLinecap="round" />
        <path d="M52 12c0-4-3-6-6-6s-5 2-5 4.5S43 14 45 14s3-1.2 3-2.6S47 9 45.5 9" strokeLinecap="round" />
        <path d="M17 12h22" strokeLinecap="round" />
        <circle cx="28" cy="7" r="2.2" fill="var(--vermilion)" stroke="none" />
      </svg>
      <span className="h-px flex-1 bg-current opacity-60" />
    </div>
  );
}
