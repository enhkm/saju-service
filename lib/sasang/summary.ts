/**
 * 생활 성향 응답 요약 규칙.
 *
 * 1. 4·5(그런 편이다·매우 그렇다)는 "동의", 3은 "상황에 따라 다름", 1·2는 "동의하지 않음"으로 읽는다.
 * 2. 한 영역의 두 문항은 서로 다른 성향을 묻는다. 점수를 빼서 상쇄하지 않고 각 응답을 그대로 문장으로 옮긴다.
 * 3. 두 문항에 모두 동의하면 두 모습을 함께 적는다 ("…편이면서도, …편이라고 답했어요").
 * 4. 건너뛰었거나 보지 않은 문항은 문장에 넣지 않고, 그 성향을 추정하지 않는다.
 * 5. 응답을 체질·유형·점수로 바꾸지 않는다.
 */
import { QUESTION_SET } from "@/data/sasang/questions";
import type {
  Answers,
  ChoiceValue,
  DimensionSummary,
  Question,
  QuestionSet,
  TraitSummary,
} from "@/types/sasang";

type Reading = "agree" | "depends" | "disagree";

export function readChoice(value: ChoiceValue): Reading {
  if (value >= 4) return "agree";
  if (value === 3) return "depends";
  return "disagree";
}

/** 문장 안에 들어갈 절 (뒤에 "답했어요"가 붙는다) */
function clause(q: Question, value: ChoiceValue): string {
  switch (readChoice(value)) {
    case "agree":
      return `${q.phrase}이라고`;
    case "disagree":
      return `${q.phrase}은 아니라고`;
    case "depends":
      return `${q.topic}는 상황에 따라 다르다고`;
  }
}

function isChoice(a: Answers[string]): a is ChoiceValue {
  return typeof a === "number";
}

export function summarize(answers: Answers, set: QuestionSet = QUESTION_SET): TraitSummary {
  const byId = new Map(set.questions.map((q) => [q.id, q]));
  const choiceLabel = (v: ChoiceValue) => set.choices.find((c) => c.value === v)!.label;

  const dimensions: DimensionSummary[] = set.dimensions.map((dim) => {
    const answered = dim.pair
      .map((id) => ({ q: byId.get(id)!, a: answers[id] }))
      .filter((x): x is { q: Question; a: ChoiceValue } => isChoice(x.a));

    const picks = answered.map(({ q, a }) => ({
      questionId: q.id,
      order: q.order,
      text: q.text,
      choiceLabel: choiceLabel(a),
    }));

    if (answered.length === 0) {
      return { dimension: dim.id, label: dim.label, kind: "unanswered", sentence: null, picks };
    }

    if (answered.length === 1) {
      const [{ q, a }] = answered;
      return {
        dimension: dim.id,
        label: dim.label,
        kind: "partial",
        sentence: `${clause(q, a)} 답했어요.`,
        picks,
      };
    }

    const [first, second] = answered;
    if (readChoice(first.a) === "agree" && readChoice(second.a) === "agree") {
      return {
        dimension: dim.id,
        label: dim.label,
        kind: "both-agree",
        sentence: `${first.q.phrase}이면서도, ${second.q.phrase}이라고 답했어요.`,
        picks,
      };
    }

    return {
      dimension: dim.id,
      label: dim.label,
      kind: "answered",
      sentence: `${clause(first.q, first.a)} 답했고, ${clause(second.q, second.a)} 답했어요.`,
      picks,
    };
  });

  const values = set.questions.map((q) => answers[q.id]);
  return {
    questionSetVersion: set.version,
    answeredCount: values.filter(isChoice).length,
    skippedCount: values.filter((a) => a === "skipped").length,
    totalCount: set.questions.length,
    dimensions,
  };
}
