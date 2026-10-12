import type { Metadata } from "next";
import Link from "next/link";
import { CloudDivider } from "@/components/ui/CloudDivider";
import { Section } from "@/components/ui/Section";
import { IljinCalendar } from "@/components/result/IljinCalendar";
import { LuckSlider } from "@/components/result/LuckSlider";
import { OhaengSection } from "@/components/result/OhaengSection";
import { PalaceRelations } from "@/components/result/PalaceRelations";
import { PillarTable } from "@/components/result/PillarTable";
import { ProfileHeader } from "@/components/result/ProfileHeader";
import { SampleNotice } from "@/components/result/SampleNotice";
import { StarsSection } from "@/components/result/StarsSection";
import { StrengthYongsin } from "@/components/result/StrengthYongsin";
import { sampleResult } from "@/data/fixtures/sample_19900101";
import { stemInfo } from "@/lib/saju/constants";

export const metadata: Metadata = { title: "사주 결과 · 사주풀이" };

// 오늘 날짜(일진 강조·현재 대운)를 요청 시점 기준으로 계산
export const dynamic = "force-dynamic";

const NAV = [
  { id: "wonguk", label: "원국" },
  { id: "palace", label: "궁성" },
  { id: "stars", label: "신살" },
  { id: "ohaeng", label: "오행" },
  { id: "strength", label: "신강·용신" },
  { id: "luck", label: "대운" },
  { id: "iljin", label: "일진" },
];

function seoulToday() {
  const [y, m, d] = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Seoul" })
    .format(new Date())
    .split("-")
    .map(Number);
  return { y, m, d };
}

export default function ResultPage() {
  // 계산 엔진 연결 전: 예시 사주로 화면 구성. 이후 /api/saju 결과로 교체
  const r = sampleResult;
  const today = seoulToday();
  const birthYear = Number(r.profile.birthday.slice(0, 4));
  const age = today.y - birthYear;
  const daeunIdx = r.daeun.pillars.findLastIndex((p) => Number(p.label) <= age);
  const dayStem = r.pillars.find((p) => p.position === "day")!.stem;

  return (
    <div className="mx-auto max-w-3xl px-4 pb-16">
      <SampleNotice sampleLabel={`${r.profile.birthday} ${r.profile.birthtime} 서울 출생`} />
      <ProfileHeader result={r} />

      <nav className="no-scrollbar sticky top-14 z-10 -mx-4 mt-4 flex gap-1 overflow-x-auto border-y border-line bg-hanji/90 px-4 py-2 backdrop-blur">
        {NAV.map((n) => (
          <a
            key={n.id}
            href={`#${n.id}`}
            className="shrink-0 rounded-sm px-2.5 py-1 text-sm text-ink-soft hover:bg-hanji-deep hover:text-ink"
          >
            {n.label}
          </a>
        ))}
      </nav>

      <div className="mt-6 space-y-6">
        <Section id="wonguk" title="사주 원국" hanja="四柱" description="태어난 해·달·날·시를 네 기둥으로 세운 여덟 글자입니다.">
          <PillarTable pillars={r.pillars} />
        </Section>

        <Section id="palace" title="궁성과 합충" hanja="宮星" description="각 기둥이 뜻하는 시기와 인연, 글자끼리의 합·충·형·파·해입니다.">
          <PalaceRelations palaces={r.palaces} pillars={r.pillars} relations={r.relations} />
        </Section>

        <Section id="stars" title="신살과 길성" hanja="神殺">
          <StarsSection stars={r.stars} pillars={r.pillars} />
        </Section>

        <Section id="ohaeng" title="오행과 십성" hanja="五行" description="합에 따른 오행 변화와 조후·궁성 보정값을 적용한 비율입니다.">
          <OhaengSection
            ohaeng={r.ohaeng}
            sipseong={r.sipseong}
            dayMaster={stemInfo(dayStem).ohaeng}
            dayStem={dayStem}
          />
        </Section>

        <Section id="strength" title="신강·신약과 용신" hanja="用神">
          <StrengthYongsin strength={r.strength} yongsin={r.yongsin} name={r.profile.name} />
        </Section>

        <Section id="luck" title="운의 흐름" hanja="大運" description="좌우로 밀어서 더 볼 수 있습니다.">
          <div className="space-y-6">
            <LuckSlider
              title="대운"
              caption={`대운수 ${r.daeun.startAge} · 현재 ${age}세`}
              items={r.daeun.pillars}
              activeIndex={daeunIdx}
            />
            <CloudDivider />
            <LuckSlider
              title="연운"
              items={r.yeonun}
              activeIndex={r.yeonun.findIndex((p) => Number(p.label) === today.y)}
            />
            <CloudDivider />
            <LuckSlider title="월운" caption={`${r.wolun.year}년`} items={r.wolun.pillars} />
          </div>
        </Section>

        <Section id="iljin" title="일진 달력" hanja="日辰">
          <IljinCalendar
            month={r.iljin}
            today={r.iljin.year === today.y && r.iljin.month === today.m ? today.d : undefined}
          />
        </Section>

        <section
          aria-labelledby="sasang-cta-title"
          className="rounded-sm border border-line-strong bg-paper p-1.5"
        >
          <div className="flex flex-col items-start gap-4 rounded-[1px] border border-line px-5 py-6 sm:flex-row sm:items-center sm:justify-between sm:px-7">
            <div>
              <h2 id="sasang-cta-title" className="text-lg font-bold">
                사주로 보는 나, 생활 속의 나
              </h2>
              <p className="mt-1 text-sm leading-relaxed text-ink-soft">
                사상체질 개념을 읽어 보고 생활 성향 질문에 답한 뒤, 사주 결과와 나란히 살펴볼 수 있어요. 체질 진단은 아닙니다.
              </p>
            </div>
            <Link
              href="/sasang"
              className="inline-flex min-h-12 shrink-0 items-center rounded-sm bg-ink px-6 text-hanji transition-colors hover:bg-vermilion"
            >
              내 생활 성향도 살펴보기
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
