"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { loadProfile } from "@/lib/profileStore";
import type { Profile } from "@/types/saju";

const CALENDAR_LABEL = { S: "양력", M: "음력", L: "음력(윤달)" } as const;

/**
 * 계산 엔진 연결 전 안내.
 * 사용자가 입력한 값을 보여 주고, 아래 결과는 예시 사주라는 점을 분명히 한다.
 */
export function SampleNotice({ sampleLabel }: { sampleLabel: string }) {
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    setProfile(loadProfile());
  }, []);

  return (
    <div className="mt-4 rounded-sm border border-dashed border-vermilion/50 bg-vermilion-soft px-4 py-3 text-sm leading-relaxed">
      {profile ? (
        <p>
          <b>입력하신 정보</b> · {profile.name} · {profile.gender === "F" ? "여자" : "남자"} ·{" "}
          {CALENDAR_LABEL[profile.calendar]} {profile.birthday} {profile.birthtime ?? "시간 모름"} · {profile.city}
          {profile.midnightAdjust && " · 야자시 적용"}
        </p>
      ) : null}
      <p className={profile ? "mt-1 text-ink-soft" : "text-ink-soft"}>
        사주 계산 엔진을 연결하기 전이라 아래는 <b className="text-ink">예시 사주({sampleLabel})</b>입니다.{" "}
        <Link href="/input" className="text-vermilion underline underline-offset-4">
          {profile ? "다시 입력" : "내 정보 입력하기"}
        </Link>
      </p>
    </div>
  );
}
