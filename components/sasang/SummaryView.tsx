"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { summarize } from "@/lib/sasang/summary";
import type { Answers, ComparisonFeeling, DimensionSummary, SajuFacts } from "@/types/sasang";

interface Props {
  headingRef: React.RefObject<HTMLHeadingElement | null>;
  answers: Answers;
  actualSaju: SajuFacts | null;
  sampleSaju: SajuFacts;
  onEdit: (questionId: string) => void;
  onRestart: () => void;
  onIntro: () => void;
}

const KIND_LABEL: Record<DimensionSummary["kind"], string> = {
  "both-agree": "두 모습에 함께 동의",
  answered: "두 문항 응답",
  partial: "한 문항만 응답",
  unanswered: "응답 없음",
};

const FEELINGS: { value: ComparisonFeeling; label: string }[] = [
  { value: "saju", label: "사주 설명에 공감해요" },
  { value: "answers", label: "내 응답이 더 가까워요" },
  { value: "depends", label: "상황마다 달라요" },
];

const btn =
  "min-h-11 rounded-sm border border-line-strong px-4 text-sm transition-colors hover:border-ink hover:bg-hanji-deep";

export function SummaryView({ headingRef, answers, actualSaju, sampleSaju, onEdit, onRestart, onIntro }: Props) {
  const summary = useMemo(() => summarize(answers), [answers]);
  const empty = summary.answeredCount === 0;

  return (
    <section aria-labelledby="summary-title">
      <p className="text-sm text-vermilion">
        <span className="font-hanja">要約</span> · 성향 요약
      </p>
      <h2 id="summary-title" ref={headingRef} tabIndex={-1} className="scroll-mt-40 mt-1 text-2xl font-bold outline-none">
        내가 답한 생활 성향
      </h2>

      {empty ? (
        <div className="mt-5 rounded-sm border border-dashed border-ink-faint px-5 py-8 text-center">
          <p className="font-bold">답한 문항이 없어 정리할 내용이 없어요.</p>
          <p className="mt-2 text-sm leading-relaxed text-ink-soft">
            응답하지 않은 문항으로 성향을 짐작하지 않아요. 몇 문항이라도 답하면 고른 답을 바탕으로 정리해 드릴게요.
          </p>
          <div className="mt-5 flex flex-col justify-center gap-2 sm:flex-row">
            <button type="button" onClick={onRestart} className="min-h-12 rounded-sm bg-ink px-6 text-hanji hover:bg-vermilion">
              질문 다시 시작
            </button>
            <button type="button" onClick={onIntro} className={btn}>
              체질 소개 다시 보기
            </button>
          </div>
        </div>
      ) : (
        <>
          <p className="mt-3 flex flex-wrap items-center gap-2 text-sm text-ink-soft">
            <span className="rounded-sm border border-ink px-1.5 py-px text-xs font-bold text-ink">응답 기반 요약</span>
            {summary.totalCount}문항 중 {summary.answeredCount}문항에 답했어요
            {summary.skippedCount > 0 && ` · 건너뜀 ${summary.skippedCount}`}
            {summary.totalCount - summary.answeredCount - summary.skippedCount > 0 &&
              ` · 보지 않음 ${summary.totalCount - summary.answeredCount - summary.skippedCount}`}
          </p>

          <ul className="mt-5 grid gap-3 sm:grid-cols-2">
            {summary.dimensions.map((d) => (
              <DimensionCard key={d.dimension} d={d} onEdit={onEdit} />
            ))}
          </ul>

          <p className="mt-3 text-xs leading-relaxed text-ink-faint">
            고른 답을 정해진 규칙(그런 편이다·매우 그렇다는 동의, 상황에 따라 다르다는 그대로, 아니다는 동의하지 않음)으로 옮긴
            문장입니다. 반대되는 문항을 서로 빼거나 체질·점수로 바꾸지 않았고, 답하지 않은 문항은 짐작하지 않았어요.
          </p>

          <Comparison summary={summary.dimensions} actualSaju={actualSaju} sampleSaju={sampleSaju} />
        </>
      )}

      {!empty && (
        <div className="mt-8 flex flex-col gap-2 sm:flex-row sm:justify-end">
          <button type="button" onClick={onIntro} className={btn}>
            체질 소개 다시 보기
          </button>
          <button type="button" onClick={onRestart} className={btn}>
            응답 지우고 처음부터
          </button>
        </div>
      )}
    </section>
  );
}

function DimensionCard({ d, onEdit }: { d: DimensionSummary; onEdit: (id: string) => void }) {
  return (
    <li className="rounded-sm border border-line-strong bg-paper px-4 py-4">
      <div className="flex items-baseline justify-between gap-2">
        <h3 className="font-bold">{d.label}</h3>
        <span className="shrink-0 text-xs text-ink-soft">
          {d.kind === "both-agree" && <span aria-hidden>◎ </span>}
          {KIND_LABEL[d.kind]}
        </span>
      </div>
      {d.sentence ? (
        <p className="mt-2 leading-relaxed">{d.sentence}</p>
      ) : (
        <p className="mt-2 text-sm text-ink-soft">이 영역의 문항에 답하지 않아 요약하지 않았어요.</p>
      )}
      {d.picks.length > 0 && (
        <ul className="mt-3 space-y-1 border-t border-line pt-2 text-xs text-ink-soft">
          {d.picks.map((p) => (
            <li key={p.questionId} className="flex items-start justify-between gap-2">
              <span>
                {p.order}. {p.text} → <b className="text-ink">{p.choiceLabel}</b>
              </span>
              <button
                type="button"
                onClick={() => onEdit(p.questionId)}
                className="shrink-0 underline underline-offset-2 hover:text-ink"
                aria-label={`${p.order}번 문항 답 고치기`}
              >
                고치기
              </button>
            </li>
          ))}
        </ul>
      )}
    </li>
  );
}

function Comparison({
  summary,
  actualSaju,
  sampleSaju,
}: {
  summary: DimensionSummary[];
  actualSaju: SajuFacts | null;
  sampleSaju: SajuFacts;
}) {
  const [showSample, setShowSample] = useState(false);
  const [feeling, setFeeling] = useState<ComparisonFeeling | null>(null);
  const saju = actualSaju ?? (showSample ? sampleSaju : null);
  const answered = summary.filter((d) => d.sentence);

  return (
    <section aria-labelledby="compare-title" className="mt-10">
      <p className="text-sm text-vermilion">
        <span className="font-hanja">對照</span> · 사주와 비교
      </p>
      <h2 id="compare-title" className="mt-1 text-2xl font-bold">
        나란히 놓고 보기
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-ink-soft">
        두 내용은 서로 다른 방식으로 만든 것이라 맞고 틀림을 따지지 않아요. 닮은 점과 다른 점은 직접 판단해 주세요.
      </p>

      <div className="mt-5 grid gap-3 md:grid-cols-2">
        <div
          className={`rounded-sm border px-4 py-4 ${
            saju?.kind === "sample" ? "border-dashed border-ink-faint" : "border-line-strong bg-paper"
          }`}
        >
          <h3 className="font-bold">
            <span className="font-hanja text-sm text-ink-soft">四柱</span> 사주로 보는 나
          </h3>

          {saju ? (
            <>
              {saju.kind === "sample" && (
                <p className="mt-2 rounded-sm border border-ink px-2 py-1 text-xs font-bold">
                  예시 · 내 결과 아님 — {saju.label}
                </p>
              )}
              <dl className="mt-3 space-y-2 text-sm">
                {saju.facts.map((f) => (
                  <div key={f.label} className="flex justify-between gap-3 border-b border-line pb-1.5">
                    <dt className="text-ink-soft">{f.label}</dt>
                    <dd className="text-right font-bold">{f.value}</dd>
                  </div>
                ))}
              </dl>
              <p className="mt-3 text-xs leading-relaxed text-ink-faint">
                사주 결과 화면에 표시된 값을 그대로 옮겼어요. 성향 해설 문구는 아직 준비 전입니다.
              </p>
              {!actualSaju && (
                <button
                  type="button"
                  onClick={() => setShowSample(false)}
                  className="mt-2 text-xs text-ink-soft underline underline-offset-2 hover:text-ink"
                >
                  예시 사주 숨기기
                </button>
              )}
            </>
          ) : (
            <div className="mt-3 text-sm leading-relaxed text-ink-soft">
              <p>아직 내 사주 결과가 없어요. 사주 계산 기능이 연결되면 여기에 내 결과가 표시됩니다.</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <button type="button" onClick={() => setShowSample(true)} className={btn}>
                  예시 사주로 미리 보기
                </button>
                <Link href="/input" className={`${btn} inline-flex items-center`}>
                  생년월일 입력하러 가기
                </Link>
              </div>
            </div>
          )}
        </div>

        <div className="rounded-sm border border-line-strong bg-paper px-4 py-4">
          <h3 className="font-bold">
            <span className="font-hanja text-sm text-ink-soft">生活</span> 생활 속에서 느끼는 나
          </h3>
          <p className="mt-2 text-xs text-ink-soft">
            <span className="rounded-sm border border-ink px-1 py-px font-bold text-ink">응답 기반 요약</span>
          </p>
          <ul className="mt-3 space-y-2.5 text-sm leading-relaxed">
            {answered.map((d) => (
              <li key={d.dimension}>
                <span className="text-xs text-ink-soft">{d.label}</span>
                <p>{d.sentence}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <fieldset className="mt-6" disabled={!saju}>
        <legend className="font-bold">두 내용을 보니 어떤가요?</legend>
        {!saju && (
          <p className="mt-1 text-sm text-ink-soft">비교할 사주 결과가 없어 선택할 수 없어요. 예시 사주로 미리 볼 수는 있어요.</p>
        )}
        {saju?.kind === "sample" && (
          <p className="mt-1 text-sm text-ink-soft">지금은 예시 사주 기준의 화면 미리보기예요.</p>
        )}
        <div className="mt-3 grid gap-2 sm:grid-cols-3">
          {FEELINGS.map((f) => {
            const checked = feeling === f.value;
            return (
              <label
                key={f.value}
                className={`flex min-h-12 items-center gap-2.5 rounded-sm border px-3.5 py-2 text-sm has-[:disabled]:cursor-not-allowed has-[:disabled]:opacity-50 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-vermilion/60 ${
                  checked ? "border-ink bg-ink/[0.06] font-bold" : "cursor-pointer border-line-strong hover:border-ink"
                }`}
              >
                <input
                  type="radio"
                  name="comparison-feeling"
                  value={f.value}
                  checked={checked}
                  onChange={() => setFeeling(f.value)}
                  className="sr-only"
                />
                <span
                  aria-hidden
                  className={`grid h-5 w-5 shrink-0 place-items-center rounded-full border text-[11px] ${
                    checked ? "border-ink bg-ink text-hanji" : "border-line-strong"
                  }`}
                >
                  {checked && "✓"}
                </span>
                {f.label}
              </label>
            );
          })}
        </div>
        <p className="mt-2 text-xs text-ink-faint" aria-live="polite">
          {feeling && saju
            ? `‘${FEELINGS.find((f) => f.value === feeling)!.label}’를 골랐어요. 정답이나 일치율은 없으며, 이 선택은 저장되지 않아요.`
            : "정답이나 일치율은 없어요. 선택은 이 화면에만 남아요."}
        </p>
      </fieldset>
    </section>
  );
}
