"use client";

import { useEffect, useRef, useState } from "react";
import { QUESTION_SET } from "@/data/sasang/questions";
import type { Answer, Answers, SajuFacts } from "@/types/sasang";
import { ConstitutionIntro } from "./ConstitutionIntro";
import { QuestionStart, QuestionStep } from "./Questionnaire";
import { SummaryView } from "./SummaryView";

type Step = "intro" | "start" | "question" | "summary";

const STEPS: { key: Step[]; label: string }[] = [
  { key: ["intro"], label: "체질 소개" },
  { key: ["start", "question"], label: "생활 질문" },
  { key: ["summary"], label: "요약 · 사주와 비교" },
];

interface Props {
  /** 실제 사주 결과. 계산 엔진 연결 전이라 지금은 항상 null */
  actualSaju: SajuFacts | null;
  /** 화면 미리보기용 예시 사주 (실제 결과와 구분해 표시) */
  sampleSaju: SajuFacts;
}

/**
 * 체질 소개 → 생활 질문 → 성향 요약 → 사주와 비교.
 * 응답은 이 컴포넌트의 메모리(state)에만 있다. localStorage·쿠키·서버로 보내지 않으므로
 * 새로고침하거나 페이지를 떠나면 사라진다.
 */
export function SasangFlow({ actualSaju, sampleSaju }: Props) {
  const [step, setStep] = useState<Step>("intro");
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const headingRef = useRef<HTMLHeadingElement>(null);
  const firstRender = useRef(true);

  // 단계·문항이 바뀌면 제목으로 초점을 옮겨 키보드·화면낭독기 사용자가 위치를 잃지 않게 한다
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    headingRef.current?.focus();
    headingRef.current?.scrollIntoView({ block: "start", behavior: "smooth" });
  }, [step, index]);

  const questions = QUESTION_SET.questions;

  const setAnswer = (id: string, value: Answer) => setAnswers((prev) => ({ ...prev, [id]: value }));

  const goQuestion = (i: number) => {
    setIndex(i);
    setStep("question");
  };

  const next = () => {
    if (index < questions.length - 1) setIndex(index + 1);
    else setStep("summary");
  };

  const restart = () => {
    setAnswers({});
    goQuestion(0);
  };

  const current = STEPS.findIndex((s) => s.key.includes(step));

  return (
    <div>
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm" aria-label="진행 단계">
        {STEPS.map((s, i) => (
          <li key={s.label} className="flex items-center gap-2" aria-current={i === current ? "step" : undefined}>
            {i > 0 && <span className="text-ink-faint" aria-hidden>›</span>}
            <span className={i === current ? "font-bold text-ink" : "text-ink-faint"}>
              {i + 1}. {s.label}
              {i === current && <span className="sr-only"> (현재 단계)</span>}
            </span>
          </li>
        ))}
      </ol>

      <p className="mt-3 rounded-sm border border-line bg-hanji-deep/40 px-3 py-2 text-xs leading-relaxed text-ink-soft">
        <span aria-hidden>※ </span>
        응답은 이 화면의 메모리에만 있어요. 새로고침하거나 페이지를 닫으면 사라지며, 브라우저 저장소나 서버에 저장·전송하지 않습니다.
      </p>

      <div className="mt-6">
        {step === "intro" && (
          <ConstitutionIntro headingRef={headingRef} onNext={() => setStep("start")} onSkip={() => setStep("start")} />
        )}

        {step === "start" && (
          <QuestionStart
            headingRef={headingRef}
            total={questions.length}
            onStart={() => goQuestion(0)}
            onSkipAll={() => setStep("summary")}
            onBack={() => setStep("intro")}
          />
        )}

        {step === "question" && (
          <QuestionStep
            headingRef={headingRef}
            index={index}
            answers={answers}
            onAnswer={(v) => setAnswer(questions[index].id, v)}
            onSkip={() => {
              setAnswer(questions[index].id, "skipped");
              next();
            }}
            onPrev={() => (index > 0 ? setIndex(index - 1) : setStep("start"))}
            onNext={next}
            onJump={setIndex}
            onFinish={() => setStep("summary")}
          />
        )}

        {step === "summary" && (
          <SummaryView
            headingRef={headingRef}
            answers={answers}
            actualSaju={actualSaju}
            sampleSaju={sampleSaju}
            onEdit={(id) => goQuestion(questions.findIndex((q) => q.id === id))}
            onRestart={restart}
            onIntro={() => setStep("intro")}
          />
        )}
      </div>
    </div>
  );
}
