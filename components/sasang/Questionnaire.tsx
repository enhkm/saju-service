"use client";

import { QUESTION_SET } from "@/data/sasang/questions";
import type { Answer, Answers, ChoiceValue } from "@/types/sasang";

type HeadingRef = React.RefObject<HTMLHeadingElement | null>;

const primaryBtn =
  "min-h-12 rounded-sm bg-ink px-6 text-hanji transition-colors hover:bg-vermilion disabled:cursor-not-allowed disabled:bg-ink/30 disabled:text-hanji";
const secondaryBtn =
  "min-h-12 rounded-sm border border-line-strong px-5 text-ink transition-colors hover:border-ink hover:bg-hanji-deep disabled:cursor-not-allowed disabled:opacity-40";

export function QuestionStart({
  headingRef,
  total,
  onStart,
  onSkipAll,
  onBack,
}: {
  headingRef: HeadingRef;
  total: number;
  onStart: () => void;
  onSkipAll: () => void;
  onBack: () => void;
}) {
  return (
    <section aria-labelledby="question-start-title">
      <p className="text-sm text-vermilion">
        <span className="font-hanja">生活</span> · 생활 성향 질문
      </p>
      <h2 id="question-start-title" ref={headingRef} tabIndex={-1} className="scroll-mt-40 mt-1 text-2xl font-bold outline-none">
        생활 속에서 느끼는 나
      </h2>

      <p className="mt-4 rounded-sm border-2 border-ink px-4 py-3 font-bold leading-relaxed">
        이 질문은 생활 성향을 돌아보기 위한 콘텐츠이며, 사상체질을 진단하는 검사가 아닙니다.
      </p>

      <ul className="mt-4 space-y-1.5 text-sm leading-relaxed text-ink-soft">
        <li>· 질문은 {total}개이고, 답하기 어려운 문항은 건너뛸 수 있어요.</li>
        <li>· 이전 문항으로 돌아가 답을 고칠 수 있어요.</li>
        <li>· 응답을 체질이나 점수로 바꾸지 않고, 고른 답을 그대로 정리해 드려요.</li>
        <li>· 질문 버전 {QUESTION_SET.version} ({QUESTION_SET.status})</li>
      </ul>

      <div className="mt-8 flex flex-col-reverse gap-2 sm:flex-row sm:justify-between">
        <button type="button" onClick={onBack} className={secondaryBtn}>
          ‹ 체질 소개
        </button>
        <div className="flex flex-col-reverse gap-2 sm:flex-row">
          <button type="button" onClick={onSkipAll} className={secondaryBtn}>
            질문 건너뛰기
          </button>
          <button type="button" onClick={onStart} className={primaryBtn}>
            질문 시작
          </button>
        </div>
      </div>
    </section>
  );
}

function statusOf(a: Answer | undefined) {
  if (a === undefined) return { mark: "", text: "아직 안 봄" };
  if (a === "skipped") return { mark: "–", text: "건너뜀" };
  return { mark: "✓", text: "답함" };
}

export function QuestionStep({
  headingRef,
  index,
  answers,
  onAnswer,
  onSkip,
  onPrev,
  onNext,
  onJump,
  onFinish,
}: {
  headingRef: HeadingRef;
  index: number;
  answers: Answers;
  onAnswer: (v: ChoiceValue) => void;
  onSkip: () => void;
  onPrev: () => void;
  onNext: () => void;
  onJump: (i: number) => void;
  /** 남은 문항을 그대로 두고 요약으로 이동 (보지 않은 문항은 응답 없음으로 둔다) */
  onFinish: () => void;
}) {
  const { questions, choices } = QUESTION_SET;
  const q = questions[index];
  const current = answers[q.id];
  const selected = typeof current === "number" ? current : null;
  const isLast = index === questions.length - 1;

  return (
    <section aria-labelledby="question-title">
      <div className="flex items-center justify-between text-sm text-ink-soft">
        <span>
          문항 <b className="text-ink">{index + 1}</b> / {questions.length}
        </span>
        <span>{statusOf(current).text}</span>
      </div>
      <div
        className="mt-2 h-1.5 overflow-hidden rounded-full bg-hanji-deep"
        role="progressbar"
        aria-valuemin={1}
        aria-valuemax={questions.length}
        aria-valuenow={index + 1}
        aria-label="질문 진행"
      >
        <div className="h-full bg-ink transition-all" style={{ width: `${((index + 1) / questions.length) * 100}%` }} />
      </div>

      <nav aria-label="문항 바로가기" className="mt-3 flex flex-wrap items-center justify-between gap-2">
        <ol className="flex flex-wrap gap-1.5">
          {questions.map((item, i) => {
            const s = statusOf(answers[item.id]);
            const here = i === index;
            return (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={() => onJump(i)}
                  aria-current={here ? "step" : undefined}
                  aria-label={`${i + 1}번 문항, ${s.text}${here ? ", 현재 문항" : ""}`}
                  className={`flex h-9 min-w-9 items-center justify-center gap-0.5 rounded-sm border px-2 text-sm tabular-nums ${
                    here ? "border-ink bg-ink text-hanji" : "border-line-strong hover:border-ink"
                  }`}
                >
                  {i + 1}
                  {s.mark && <span aria-hidden className="text-xs">{s.mark}</span>}
                </button>
              </li>
            );
          })}
        </ol>
        <button
          type="button"
          onClick={onFinish}
          className="min-h-9 px-1 text-sm text-ink-soft underline decoration-line-strong underline-offset-4 hover:text-ink"
        >
          요약으로 바로 가기
        </button>
      </nav>

      <fieldset className="mt-6">
        <legend className="w-full">
          <h2 id="question-title" ref={headingRef} tabIndex={-1} className="scroll-mt-40 text-xl font-bold leading-snug outline-none sm:text-2xl">
            {q.text}
          </h2>
        </legend>

        <div className="mt-5 grid gap-2">
          {choices.map((c) => {
            const checked = selected === c.value;
            return (
              <label
                key={c.value}
                className={`flex min-h-12 cursor-pointer items-center gap-3 rounded-sm border px-4 py-2.5 transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-vermilion/60 ${
                  checked ? "border-ink bg-ink/[0.06] font-bold" : "border-line-strong hover:border-ink"
                }`}
              >
                <input
                  type="radio"
                  name={`answer-${q.id}`}
                  value={c.value}
                  checked={checked}
                  onChange={() => onAnswer(c.value)}
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
                <span className="flex-1">{c.label}</span>
                {checked && <span className="text-xs font-normal text-ink-soft">선택함</span>}
              </label>
            );
          })}
        </div>
      </fieldset>

      <div className="mt-6 grid grid-cols-2 gap-2 sm:flex sm:justify-between">
        <button type="button" onClick={onPrev} className={secondaryBtn}>
          ‹ 이전
        </button>
        <button type="button" onClick={onSkip} className={`${secondaryBtn} sm:ml-auto`}>
          건너뛰기
        </button>
        <button type="button" onClick={onNext} disabled={selected === null} className={`${primaryBtn} col-span-2`}>
          {isLast ? "요약 보기" : "다음 ›"}
        </button>
      </div>
      {selected === null && (
        <p className="mt-2 text-right text-xs text-ink-faint">답을 고르면 다음으로 넘어갈 수 있어요. 어려우면 건너뛰어도 돼요.</p>
      )}
    </section>
  );
}
