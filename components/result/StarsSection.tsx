import { PILLAR_LABEL, branchInfo, stemInfo } from "@/lib/saju/constants";
import type { Pillar, SajuResult } from "@/types/saju";

/** 귀인·록 계열은 길성, 나머지 살은 주의 기운으로 구분해 색을 다르게 준다 */
const GILSEONG = new Set([
  "천을귀인",
  "천덕귀인",
  "월덕귀인",
  "태극귀인",
  "학당귀인",
  "문곡귀인",
  "문창귀인",
  "정록",
  "암록",
  "금여록",
  "천의성",
]);

function Star({ name }: { name: string }) {
  const good = GILSEONG.has(name);
  return (
    <span
      className={`inline-block rounded-sm border px-1.5 py-0.5 text-xs leading-tight ${
        good ? "border-vermilion/50 bg-vermilion-soft text-vermilion" : "border-line-strong text-ink-soft"
      }`}
    >
      {name}
    </span>
  );
}

export function StarsSection({ stars, pillars }: { stars: SajuResult["stars"]; pillars: Pillar[] }) {
  return (
    <div className="space-y-5">
      <div className="flex flex-wrap gap-1.5">
        {stars.summary.map((s) => (
          <Star key={s} name={s} />
        ))}
      </div>

      <div className="grid grid-cols-4 gap-2">
        {stars.byPillar.map((sp) => {
          const p = pillars.find((x) => x.position === sp.position)!;
          return (
            <div key={sp.position} className="rounded-md border border-line p-2 text-center">
              <p className="text-xs text-ink-faint">{PILLAR_LABEL[sp.position]}</p>
              <p className="mt-1 font-hanja text-lg">{stemInfo(p.stem).hanja}</p>
              <div className="mt-1 flex min-h-6 flex-col items-center gap-1">
                {sp.stem.map((s) => (
                  <Star key={s} name={s} />
                ))}
              </div>
              <div className="my-2 h-px bg-line" />
              <p className="font-hanja text-lg">{branchInfo(p.branch).hanja}</p>
              <div className="mt-1 flex flex-col items-center gap-1">
                {sp.branch.map((s) => (
                  <Star key={s} name={s} />
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <p className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-ink-faint">
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-sm border border-vermilion/50 bg-vermilion-soft" /> 길성(귀인·록)
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-sm border border-line-strong" /> 신살
        </span>
      </p>
    </div>
  );
}
