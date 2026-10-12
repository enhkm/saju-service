"use client";

import { useState } from "react";
import { PILLAR_LABEL, stemInfo, branchInfo } from "@/lib/saju/constants";
import type { Palace, Pillar, Relation } from "@/types/saju";

interface Props {
  palaces: Palace[];
  pillars: Pillar[];
  relations: Relation[];
}

const PALACE_TAB = "궁성";

/** 궁성 표 + 합·충·형·파·해 탭 */
export function PalaceRelations({ palaces, pillars, relations }: Props) {
  const [tab, setTab] = useState<string>(PALACE_TAB);
  const tabs = [PALACE_TAB, ...relations.map((r) => r.type)];
  const current = relations.find((r) => r.type === tab);

  return (
    <div>
      <div role="tablist" className="no-scrollbar -mx-1 flex gap-1.5 overflow-x-auto px-1 pb-2 sm:flex-wrap sm:overflow-visible">
        {tabs.map((t) => {
          const count = relations.find((r) => r.type === t)?.items.length ?? 0;
          const selected = t === tab;
          return (
            <button
              key={t}
              role="tab"
              aria-selected={selected}
              onClick={() => setTab(t)}
              className={`shrink-0 rounded-full border px-3 py-1 text-[13px] transition-colors ${
                selected
                  ? "border-ink bg-ink text-hanji"
                  : "border-line-strong text-ink-soft hover:border-ink hover:text-ink"
              }`}
            >
              {t}
              {t !== PALACE_TAB && count > 0 && (
                <span className={`ml-1 ${selected ? "text-hanji/70" : "text-vermilion"}`}>{count}</span>
              )}
            </button>
          );
        })}
      </div>

      <div className="mt-3 min-h-[180px]">
        {tab === PALACE_TAB ? (
          <PalaceTable palaces={palaces} pillars={pillars} />
        ) : current && current.items.length > 0 ? (
          <ul className="space-y-2">
            {current.items.map((item) => (
              <li key={item} className="flex items-center gap-2.5 rounded-md border border-line px-3.5 py-2.5">
                <span className="h-1.5 w-1.5 rotate-45 bg-vermilion" />
                {item}
              </li>
            ))}
          </ul>
        ) : (
          <p className="rounded-md border border-dashed border-line-strong px-4 py-8 text-center text-sm text-ink-faint">
            원국에 {tab}이(가) 없습니다.
          </p>
        )}
      </div>
    </div>
  );
}

function PalaceTable({ palaces, pillars }: { palaces: Palace[]; pillars: Pillar[] }) {
  return (
    <div className="overflow-hidden rounded-md border border-line">
      <table className="w-full text-sm">
        <thead className="bg-hanji-deep/60 text-xs text-ink-faint">
          <tr>
            <th className="px-2 py-2 text-left font-normal sm:px-3">궁</th>
            <th className="px-2 py-2 text-left font-normal">시기 · 의미</th>
            <th className="px-2 py-2 font-normal">천간</th>
            <th className="px-2 py-2 font-normal">지지</th>
          </tr>
        </thead>
        <tbody>
          {palaces.map((pal) => {
            const p = pillars.find((x) => x.position === pal.position)!;
            return (
              <tr key={pal.position} className="border-t border-line">
                <td className="px-2 py-2.5 font-bold sm:px-3">{PILLAR_LABEL[pal.position]}</td>
                <td className="px-2 py-2.5">
                  {pal.period}
                  <span className="block text-xs text-ink-faint">{pal.meaning}</span>
                </td>
                <td className="px-2 py-2.5 text-center">
                  <span className="font-hanja">{stemInfo(p.stem).hanja}</span> {pal.stemRole}
                  <span className="block text-xs text-ink-faint">{p.position === "day" ? "일간" : p.stemSipseong}</span>
                </td>
                <td className="px-2 py-2.5 text-center">
                  <span className="font-hanja">{branchInfo(p.branch).hanja}</span> {pal.branchRole}
                  <span className="block text-xs text-ink-faint">{p.branchSipseong}</span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
