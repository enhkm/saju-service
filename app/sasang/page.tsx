import type { Metadata } from "next";
import { SasangFlow } from "@/components/sasang/SasangFlow";
import { CloudDivider } from "@/components/ui/CloudDivider";
import { Seal } from "@/components/ui/Seal";
import { sampleResult } from "@/data/fixtures/sample_19900101";
import { sajuFactsOf } from "@/lib/sasang/sajuFacts";

export const metadata: Metadata = { title: "생활 성향 살펴보기 · 사주풀이" };

export default function SasangPage() {
  // 계산 엔진이 연결되면 실제 결과를 actualSaju 로 넘긴다. 지금은 실제 결과가 없다.
  const sampleSaju = sajuFactsOf(
    sampleResult,
    "sample",
    `${sampleResult.profile.birthday} ${sampleResult.profile.birthtime} ${sampleResult.profile.city} 출생 예시`,
  );

  return (
    <div className="mx-auto max-w-3xl px-4 pb-16 pt-10">
      <header className="flex flex-col items-center text-center">
        <Seal text="四象" size={52} />
        <h1 className="mt-5 text-3xl font-bold sm:text-4xl">사주로 보는 나, 생활 속의 나</h1>
        <p className="mt-3 max-w-lg leading-relaxed text-ink-soft">
          사상체질이라는 전통 개념을 읽어 보고, 생활 성향 질문에 답한 뒤 사주 결과와 나란히 놓고 살펴보는 자기 탐색
          콘텐츠입니다.
        </p>
      </header>

      <CloudDivider className="my-8" />

      <SasangFlow actualSaju={null} sampleSaju={sampleSaju} />
    </div>
  );
}
