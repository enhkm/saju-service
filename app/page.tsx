import Link from "next/link";
import { CloudDivider } from "@/components/ui/CloudDivider";
import { Seal } from "@/components/ui/Seal";
import { STEMS, BRANCHES } from "@/lib/saju/constants";

const FEATURES = [
  { hanja: "四柱", title: "사주 원국", desc: "네 기둥의 천간·지지와 십성, 지장간, 12운성, 신살" },
  { hanja: "五行", title: "오행 분석", desc: "목·화·토·금·수의 균형과 상생상극, 신강·신약과 용신" },
  { hanja: "大運", title: "운의 흐름", desc: "10년 단위 대운과 해마다, 달마다 바뀌는 운" },
  { hanja: "日辰", title: "일진 달력", desc: "오늘 하루의 간지를 달력으로" },
];

export default function Home() {
  return (
    <div className="mx-auto max-w-3xl px-4">
      <section className="relative flex flex-col items-center py-16 text-center sm:py-24">
        {/* 배경의 큰 세로 한자 */}
        <div
          aria-hidden
          className="writing-vertical pointer-events-none absolute right-0 top-8 hidden font-hanja text-7xl tracking-[0.4em] text-ink/[0.06] sm:block"
        >
          四柱八字
        </div>
        <div
          aria-hidden
          className="writing-vertical pointer-events-none absolute left-0 top-8 hidden font-hanja text-7xl tracking-[0.4em] text-ink/[0.06] sm:block"
        >
          天干地支
        </div>

        <Seal text="四柱八字" size={76} />
        <h1 className="mt-7 text-4xl font-bold leading-tight sm:text-5xl">
          태어난 때에 새겨진
          <br />
          나의 결을 읽다
        </h1>
        <p className="mt-5 max-w-md leading-relaxed text-ink-soft">
          생년월일시와 태어난 곳으로 사주 여덟 글자를 세우고, 지역 시차까지 보정해 오행의 흐름을 풀어 드립니다.
        </p>

        <div className="mt-9 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/input"
            className="rounded-sm border border-ink bg-ink px-7 py-3 text-hanji transition-colors hover:border-vermilion hover:bg-vermilion"
          >
            내 사주 보기
          </Link>
          <Link
            href="/result"
            className="rounded-sm border border-ink px-7 py-3 transition-colors hover:bg-ink hover:text-hanji"
          >
            예시 결과 보기
          </Link>
        </div>
      </section>

      <CloudDivider />

      <section className="grid gap-3 py-12 sm:grid-cols-2">
        {FEATURES.map((f) => (
          <div key={f.title} className="flex gap-4 rounded-sm border border-line bg-paper p-5">
            <span className="writing-vertical border-l border-vermilion pl-1.5 font-hanja text-sm tracking-[0.3em] text-vermilion">
              {f.hanja}
            </span>
            <div>
              <h2 className="font-bold">{f.title}</h2>
              <p className="mt-1 text-sm leading-relaxed text-ink-soft">{f.desc}</p>
            </div>
          </div>
        ))}
      </section>

      <section className="pb-16 text-center">
        <p className="font-hanja text-xl tracking-[0.35em] text-ink-soft sm:text-2xl">
          {STEMS.map((s) => s.hanja).join("")}
        </p>
        <p className="mt-2 font-hanja text-xl tracking-[0.35em] text-ink-faint sm:text-2xl">
          {BRANCHES.map((b) => b.hanja).join("")}
        </p>
      </section>
    </div>
  );
}
