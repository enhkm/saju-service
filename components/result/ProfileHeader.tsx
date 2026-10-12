import { Seal } from "@/components/ui/Seal";
import { branchInfo, ganjiHanja, iljuLabel } from "@/lib/saju/constants";
import type { SajuResult } from "@/types/saju";

export function ProfileHeader({ result }: { result: SajuResult }) {
  const { profile, ilju, dates } = result;
  const gender = profile.gender === "F" ? "여자" : "남자";
  const correction = dates.local.correctionMinutes;

  const lines = [
    { mark: "陽", label: "양력", text: `${dates.solar.date} ${dates.solar.time}` },
    { mark: "陰", label: dates.lunar.leap ? "음력(윤달)" : "음력", text: `${dates.lunar.date} ${dates.lunar.time}` },
    {
      mark: "地",
      label: "지역시",
      text: `${dates.local.date} ${dates.local.time}`,
      note: `${correction > 0 ? "+" : ""}${correction}분 보정`,
    },
  ];

  return (
    <header className="flex flex-col items-center gap-5 pb-2 pt-4 text-center sm:flex-row sm:items-center sm:gap-7 sm:text-left">
      <Seal text={branchInfo(ilju[1]).hanja} size={88} />
      <div className="min-w-0 flex-1">
        <p className="text-sm tracking-[0.2em] text-ink-soft">
          {ilju}일주 · <span className="font-hanja">{ganjiHanja(ilju)}</span>
        </p>
        <h1 className="mt-1 text-3xl font-bold sm:text-4xl">
          {profile.name}
          <span className="ml-2 text-lg font-normal text-ink-soft">{iljuLabel(ilju)}</span>
        </h1>
        <dl className="mt-3 inline-grid grid-cols-[auto_auto_1fr] items-baseline gap-x-2.5 gap-y-1 text-left text-sm">
          {lines.map((l) => (
            <div key={l.label} className="contents">
              <dt className="font-hanja text-vermilion">{l.mark}</dt>
              <dd className="text-ink-faint">{l.label}</dd>
              <dd className="tabular-nums">
                {l.text} · {gender} · {profile.city}
                {l.note && <span className="ml-1.5 text-ink-faint">({l.note})</span>}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </header>
  );
}
