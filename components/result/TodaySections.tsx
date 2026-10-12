"use client";

import { useEffect, useState } from "react";
import { CloudDivider } from "@/components/ui/CloudDivider";
import type { SajuResult } from "@/types/saju";
import { IljinCalendar } from "./IljinCalendar";
import { LuckSlider } from "./LuckSlider";

/**
 * 정적 사이트(GitHub Pages)로 배포하므로 "오늘"은 빌드 시점이 아니라 방문자 브라우저에서 계산한다.
 * 첫 렌더에서는 강조 없이 그리고, 화면이 뜬 뒤 오늘 기준 강조를 붙인다.
 */
function useSeoulToday() {
  const [today, setToday] = useState<{ y: number; m: number; d: number } | null>(null);
  useEffect(() => {
    const [y, m, d] = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Seoul" })
      .format(new Date())
      .split("-")
      .map(Number);
    setToday({ y, m, d });
  }, []);
  return today;
}

export function LuckSections({ result }: { result: SajuResult }) {
  const today = useSeoulToday();
  const birthYear = Number(result.profile.birthday.slice(0, 4));
  const age = today ? today.y - birthYear : null;
  const daeunIdx = age === null ? -1 : result.daeun.pillars.findLastIndex((p) => Number(p.label) <= age);

  return (
    <div className="space-y-6">
      <LuckSlider
        title="대운"
        caption={`대운수 ${result.daeun.startAge}${age !== null ? ` · 현재 ${age}세` : ""}`}
        items={result.daeun.pillars}
        activeIndex={daeunIdx}
      />
      <CloudDivider />
      <LuckSlider
        title="연운"
        items={result.yeonun}
        activeIndex={today ? result.yeonun.findIndex((p) => Number(p.label) === today.y) : -1}
      />
      <CloudDivider />
      <LuckSlider title="월운" caption={`${result.wolun.year}년`} items={result.wolun.pillars} />
    </div>
  );
}

export function IljinToday({ month }: { month: SajuResult["iljin"] }) {
  const today = useSeoulToday();
  return (
    <IljinCalendar
      month={month}
      today={today && month.year === today.y && month.month === today.m ? today.d : undefined}
    />
  );
}
