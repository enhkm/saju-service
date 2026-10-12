import { ohaengStyle } from "@/components/ui/GanjiTile";
import { OHAENG_HANJA } from "@/lib/saju/constants";
import type { Strength, StrengthVerdict, Yongsin } from "@/types/saju";

const SCALE: StrengthVerdict[] = ["극약", "태약", "신약", "중화", "신강", "태강", "극왕"];

const CHECKS: { key: keyof Pick<Strength, "deukryeong" | "deukji" | "deuksi" | "deukse">; label: string; hanja: string; desc: string }[] = [
  { key: "deukryeong", label: "득령", hanja: "得令", desc: "월지의 도움" },
  { key: "deukji", label: "득지", hanja: "得地", desc: "일지의 도움" },
  { key: "deuksi", label: "득시", hanja: "得時", desc: "시지의 도움" },
  { key: "deukse", label: "득세", hanja: "得勢", desc: "주변 글자의 도움" },
];

export function StrengthYongsin({ strength, yongsin, name }: { strength: Strength; yongsin: Yongsin; name: string }) {
  const idx = SCALE.indexOf(strength.verdict);
  return (
    <div className="grid gap-6 sm:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
      <div>
        <ul className="grid grid-cols-4 gap-2">
          {CHECKS.map((c) => {
            const ok = strength[c.key];
            return (
              <li key={c.key} className="flex flex-col items-center rounded-md border border-line py-3 text-center">
                <span
                  className={`grid h-9 w-9 place-items-center rounded-full font-hanja text-base ${
                    ok ? "bg-vermilion text-hanji" : "border border-dashed border-ink-faint text-ink-faint"
                  }`}
                  aria-label={ok ? "해당" : "해당 없음"}
                >
                  {ok ? "○" : "✕"}
                </span>
                <span className="mt-2 text-sm font-bold">{c.label}</span>
                <span className="font-hanja text-[11px] text-ink-faint">{c.hanja}</span>
                <span className="mt-0.5 hidden text-[11px] text-ink-faint sm:block">{c.desc}</span>
              </li>
            );
          })}
        </ul>

        <div className="mt-5">
          <div className="grid grid-cols-7 gap-1">
            {SCALE.map((s, i) => (
              <div key={s} className="text-center">
                <div
                  className={`h-2 rounded-full ${i === idx ? "bg-vermilion" : i < idx ? "bg-ink/25" : "bg-hanji-deep"}`}
                />
                <span className={`mt-1.5 block text-[11px] ${i === idx ? "font-bold text-vermilion" : "text-ink-faint"}`}>
                  {s}
                </span>
              </div>
            ))}
          </div>
          <p className="mt-4 leading-relaxed">
            {name}님은 <b className="text-vermilion">{strength.verdict}</b>한 사주입니다.
            {strength.populationPercent !== null && (
              <span className="block text-sm text-ink-soft">
                {strength.populationPercent}%의 사람이 여기에 해당합니다.
              </span>
            )}
          </p>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center rounded-md border border-line bg-hanji/50 px-4 py-5 text-center">
        <p className="text-sm tracking-[0.2em] text-ink-soft">용신 用神</p>
        <div className="mt-3 grid h-20 w-20 place-items-center rounded-full" style={ohaengStyle(yongsin.ohaeng)}>
          <span className="font-hanja text-4xl font-semibold">{OHAENG_HANJA[yongsin.ohaeng]}</span>
        </div>
        <p className="mt-3 text-lg font-bold">
          {yongsin.ohaeng}
          <span className="ml-1.5 text-sm font-normal text-ink-soft">({yongsin.kind})</span>
        </p>
        <p className="mt-2 text-balance text-xs leading-relaxed text-ink-faint">
          사주의 넘치는 기운을 덜거나 모자란 기운을 채워 균형을 잡아 주는 오행입니다.
        </p>
      </div>
    </div>
  );
}
