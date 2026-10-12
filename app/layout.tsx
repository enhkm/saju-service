import type { Metadata } from "next";
import Link from "next/link";
import { Noto_Serif_KR } from "next/font/google";
import { Seal } from "@/components/ui/Seal";
import "./globals.css";

// 궁서체(globals.css)가 로드되기 전·없는 글자용 대체 글꼴
const notoSerif = Noto_Serif_KR({
  variable: "--font-noto-serif",
  weight: ["400", "600", "700"],
  subsets: ["latin"],
  display: "swap",
  preload: false,
});

export const metadata: Metadata = {
  title: "사주풀이 · 四柱八字",
  description: "생년월일시로 보는 사주 원국, 오행 분석, 대운과 일진",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko">
      <body className={`${notoSerif.variable} min-h-dvh antialiased`}>
        <div className="flex min-h-dvh flex-col">
          <header className="sticky top-0 z-20 border-b border-line bg-hanji/85 backdrop-blur">
            <div className="mx-auto flex h-14 max-w-3xl items-center justify-between px-4">
              <Link href="/" className="flex items-center gap-2.5">
                <Seal text="命" size={30} />
                <span className="whitespace-nowrap text-lg font-bold tracking-wide">사주풀이</span>
              </Link>
              <nav className="flex gap-3 whitespace-nowrap text-[13px] text-ink-soft sm:gap-4 sm:text-sm">
                <Link href="/input" className="hover:text-ink">
                  사주 입력
                </Link>
                <Link href="/result" className="hover:text-ink">
                  예시 결과
                </Link>
                <Link href="/sasang" className="hover:text-ink">
                  생활 성향
                </Link>
              </nav>
            </div>
          </header>
          <main className="flex-1">{children}</main>
          <footer className="border-t border-line py-6 text-center text-xs text-ink-faint">
            <span className="font-hanja">四柱八字</span> · 사주풀이
          </footer>
        </div>
      </body>
    </html>
  );
}
