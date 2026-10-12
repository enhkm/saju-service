import { ganjiHanja } from "@/lib/saju/constants";
import type { IljinMonth } from "@/types/saju";

const WEEK = ["日", "月", "火", "水", "木", "金", "土"];

export function IljinCalendar({ month, today }: { month: IljinMonth; today?: number }) {
  const blanks = Array.from({ length: month.firstWeekday });

  return (
    <div>
      <div className="mb-3 flex items-baseline justify-between">
        <p className="text-lg font-bold">
          {month.year}년 {month.month}월
        </p>
        <p className="text-sm text-ink-soft">{month.ganjiLabel}</p>
      </div>

      <div className="grid grid-cols-7 border-l border-t border-line text-center">
        {WEEK.map((w, i) => (
          <div
            key={w}
            className={`border-b border-r border-line bg-hanji-deep/60 py-1.5 font-hanja text-sm ${
              i === 0 ? "text-vermilion" : i === 6 ? "text-azure" : "text-ink-soft"
            }`}
          >
            {w}
          </div>
        ))}
        {blanks.map((_, i) => (
          <div key={`b${i}`} className="border-b border-r border-line" />
        ))}
        {month.days.map((d) => {
          const weekday = (month.firstWeekday + d.day - 1) % 7;
          const red = weekday === 0 || !!d.holiday;
          const isToday = d.day === today;
          return (
            <div
              key={d.day}
              className={`relative flex min-h-[74px] flex-col items-center border-b border-r border-line px-0.5 pb-1.5 pt-1 sm:min-h-[86px] ${
                isToday ? "bg-vermilion-soft" : ""
              }`}
            >
              <span
                className={`self-start pl-1 text-xs tabular-nums sm:text-[13px] ${
                  red ? "text-vermilion" : weekday === 6 ? "text-azure" : ""
                } ${isToday ? "font-bold" : ""}`}
              >
                {d.day}
              </span>
              <span className="mt-0.5 font-hanja text-[13px] leading-tight sm:text-base">{ganjiHanja(d.ganji)}</span>
              <span className="text-[10px] text-ink-soft sm:text-[11px]">{d.ganji}</span>
              <span className="text-[10px] tabular-nums text-ink-faint">{d.lunar}</span>
              {d.holiday && <span className="mt-0.5 text-[10px] leading-tight text-vermilion">{d.holiday}</span>}
              {d.solarTerm && (
                <span className="mt-0.5 rounded-sm bg-gold/15 px-1 text-[10px] leading-tight text-gold">
                  {d.solarTerm.name}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
