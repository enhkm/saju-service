/**
 * 비교 화면에 보여 줄 사주 쪽 요약.
 * 사주 결과 화면에 이미 표시된 값만 옮기며, 사상체질이나 생활 성향으로 해석하지 않는다.
 */
import { OHAENG_HANJA, stemInfo } from "@/lib/saju/constants";
import type { SajuFacts } from "@/types/sasang";
import type { SajuResult } from "@/types/saju";

export function sajuFactsOf(result: SajuResult, kind: SajuFacts["kind"], label: string): SajuFacts {
  const dayStem = stemInfo(result.pillars.find((p) => p.position === "day")!.stem);
  const sorted = [...result.ohaeng].sort((a, b) => b.percent - a.percent);
  const top = sorted[0];
  const missing = result.ohaeng.filter((o) => o.percent === 0).map((o) => `${o.ohaeng}(${OHAENG_HANJA[o.ohaeng]})`);

  return {
    kind,
    label,
    facts: [
      { label: "일간 (나를 나타내는 글자)", value: `${dayStem.hangul}${dayStem.ohaeng} ${dayStem.hanja}` },
      {
        label: "가장 많은 오행",
        value: `${top.ohaeng}(${OHAENG_HANJA[top.ohaeng]}) ${top.percent}% · ${top.status}`,
      },
      { label: "없는 오행", value: missing.length > 0 ? missing.join(", ") : "없음" },
      { label: "신강·신약", value: result.strength.verdict },
      { label: "용신", value: `${result.yongsin.ohaeng}(${OHAENG_HANJA[result.yongsin.ohaeng]}) · ${result.yongsin.kind}` },
    ],
  };
}
