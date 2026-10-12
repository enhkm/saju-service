import { GanjiTile } from "@/components/ui/GanjiTile";
import { PILLAR_LABEL, stemInfo } from "@/lib/saju/constants";
import type { Pillar } from "@/types/saju";

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <>
      <div className="flex items-center justify-end pr-2 text-xs text-ink-faint sm:pr-3 sm:text-[13px]">{label}</div>
      {children}
    </>
  );
}

/** 사주 원국표: 생시·생일·생월·생년 4기둥 */
export function PillarTable({ pillars }: { pillars: Pillar[] }) {
  const cell = (p: Pillar, content: React.ReactNode, extra = "") => (
    <div
      key={p.position}
      className={`flex items-center justify-center px-0.5 py-1.5 text-center ${
        p.position === "day" ? "bg-vermilion-soft" : ""
      } ${extra}`}
    >
      {content}
    </div>
  );

  return (
    <div className="grid grid-cols-[44px_repeat(4,minmax(0,1fr))] text-sm sm:grid-cols-[64px_repeat(4,minmax(0,1fr))]">
      <div />
      {pillars.map((p) =>
        cell(
          p,
          <span className="font-bold">
            {PILLAR_LABEL[p.position]}
            {p.position === "day" && <span className="ml-1 text-xs font-normal text-vermilion">나</span>}
          </span>,
          "rounded-t-md border-b border-line pt-2.5",
        ),
      )}

      <Row label="십성">
        {pillars.map((p) =>
          cell(p, <span className={p.position === "day" ? "text-vermilion" : ""}>{p.position === "day" ? "일간" : p.stemSipseong}</span>),
        )}
      </Row>
      <Row label="천간">{pillars.map((p) => cell(p, <GanjiTile char={p.stem} kind="stem" size="lg" />))}</Row>
      <Row label="지지">{pillars.map((p) => cell(p, <GanjiTile char={p.branch} kind="branch" size="lg" />))}</Row>
      <Row label="십성">{pillars.map((p) => cell(p, p.branchSipseong))}</Row>

      <Row label="지장간">
        {pillars.map((p) =>
          cell(
            p,
            <span className="font-hanja tracking-wider">
              {p.jijanggan.map((s) => stemInfo(s).hanja).join("")}
              <span className="block font-serif text-[11px] tracking-normal text-ink-faint">{p.jijanggan.join("")}</span>
            </span>,
            "border-t border-line",
          ),
        )}
      </Row>
      <Row label="12운성">{pillars.map((p) => cell(p, p.unseong, "border-t border-line"))}</Row>
      <Row label="12신살">{pillars.map((p) => cell(p, p.sinsal12, "rounded-b-md border-t border-line pb-2.5"))}</Row>
    </div>
  );
}
