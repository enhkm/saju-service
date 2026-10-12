import { GanjiTile } from "@/components/ui/GanjiTile";
import type { LuckPillar } from "@/types/saju";

interface Props {
  title: string;
  caption?: string;
  items: LuckPillar[];
  /** 현재 운 강조 */
  activeIndex?: number;
}

/** 대운·연운·월운 공용 가로 슬라이드 */
export function LuckSlider({ title, caption, items, activeIndex = -1 }: Props) {
  return (
    <div>
      <div className="mb-2 flex items-baseline justify-between gap-3">
        <h3 className="font-bold">{title}</h3>
        {caption && <span className="text-xs text-ink-faint">{caption}</span>}
      </div>
      <div className="scroll-row -mx-1 flex snap-x gap-1.5 overflow-x-auto px-1 pb-3">
        {items.map((p, i) => {
          const active = i === activeIndex;
          return (
            <div
              key={p.label}
              className={`flex w-[68px] shrink-0 snap-start flex-col items-center gap-1 rounded-md border py-2 text-center text-xs ${
                active ? "border-vermilion bg-vermilion-soft" : "border-line"
              }`}
            >
              <span className={`text-[13px] font-bold tabular-nums ${active ? "text-vermilion" : ""}`}>{p.label}</span>
              <span className="text-ink-soft">{p.stemSipseong}</span>
              <GanjiTile char={p.stem} kind="stem" />
              <GanjiTile char={p.branch} kind="branch" />
              <span className="text-ink-soft">{p.branchSipseong}</span>
              <span className="text-ink-faint">{p.unseong}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
