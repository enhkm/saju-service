import { describe, expect, it } from "vitest";
import { CONSTITUTIONS, OVERVIEW, SOURCES } from "@/data/sasang/constitutions";
import { QUESTION_SET } from "@/data/sasang/questions";
import { summarize } from "@/lib/sasang/summary";
import type { Answers } from "@/types/sasang";

const dim = (answers: Answers, id: string) => summarize(answers).dimensions.find((d) => d.dimension === id)!;

describe("summarize", () => {
  it("전체 응답: 8문항 모두 집계하고 네 영역 모두 문장을 만든다", () => {
    const answers: Answers = { q1: 5, q2: 2, q3: 4, q4: 3, q5: 1, q6: 4, q7: 2, q8: 5 };
    const s = summarize(answers);
    expect(s.answeredCount).toBe(8);
    expect(s.skippedCount).toBe(0);
    expect(s.dimensions.every((d) => d.sentence !== null)).toBe(true);
    expect(dim(answers, "start").sentence).toBe(
      "새로운 일을 생각하면 실행부터 해 보는 편이라고 답했고, 결정을 내리기 전에 충분히 살펴보는 편은 아니라고 답했어요.",
    );
    expect(dim(answers, "people").sentence).toBe(
      "사람들과 함께 활동하는 시간을 즐기는 편이라고 답했고, 혼자만의 조용한 시간이 필요한지는 상황에 따라 다르다고 답했어요.",
    );
  });

  it("서로 다른 성향에 모두 동의하면 상쇄하지 않고 두 모습을 함께 적는다", () => {
    const answers: Answers = { q5: 5, q6: 4 };
    const d = dim(answers, "change");
    expect(d.kind).toBe("both-agree");
    expect(d.sentence).toBe(
      "익숙한 방식보다 새로운 방식을 시도하는 편이면서도, 일정하고 예측 가능한 일상을 편하게 느끼는 편이라고 답했어요.",
    );
    expect(d.picks.map((p) => p.choiceLabel)).toEqual(["매우 그렇다", "그런 편이다"]);
  });

  it("일부 응답: 답한 문항만 문장에 넣고 짝 문항은 추정하지 않는다", () => {
    const answers: Answers = { q1: 4, q2: "skipped" };
    const d = dim(answers, "start");
    expect(d.kind).toBe("partial");
    expect(d.sentence).toBe("새로운 일을 생각하면 실행부터 해 보는 편이라고 답했어요.");
    expect(d.sentence).not.toContain("살펴보");
    expect(dim(answers, "people").kind).toBe("unanswered");
    expect(dim(answers, "people").sentence).toBeNull();
  });

  it("전체 건너뛰기: 응답 수 0, 모든 영역 요약 없음", () => {
    const answers: Answers = Object.fromEntries(QUESTION_SET.questions.map((q) => [q.id, "skipped"]));
    const s = summarize(answers);
    expect(s.answeredCount).toBe(0);
    expect(s.skippedCount).toBe(8);
    expect(s.dimensions.every((d) => d.kind === "unanswered")).toBe(true);
  });

  it("질문을 아예 보지 않은 경우(빈 응답)도 추정하지 않는다", () => {
    const s = summarize({});
    expect(s.answeredCount).toBe(0);
    expect(s.skippedCount).toBe(0);
    expect(s.dimensions.every((d) => d.sentence === null)).toBe(true);
  });

  it("답을 고친 경우 마지막 값으로 요약한다", () => {
    const answers: Answers = { q7: 5 };
    answers.q7 = 1;
    expect(dim(answers, "expression").sentence).toBe("생각이나 감정을 바로 표현하는 편은 아니라고 답했어요.");
  });

  it("요약 결과에 체질 이름·점수·비율이 들어가지 않는다", () => {
    const all: Answers = { q1: 5, q2: 5, q3: 5, q4: 5, q5: 5, q6: 5, q7: 5, q8: 5 };
    const text = JSON.stringify(summarize(all));
    for (const word of ["태양", "태음", "소양", "소음", "체질", "%", "점"]) {
      expect(text).not.toContain(word);
    }
  });
});

describe("콘텐츠 규칙", () => {
  it("모든 문항 phrase 는 '편'으로 끝난다 (요약 문장 조사 처리 전제)", () => {
    for (const q of QUESTION_SET.questions) expect(q.phrase.endsWith("편")).toBe(true);
  });

  it("인용·출처 확인 항목은 등록된 출처를 가리키고, 풀이는 검토 대기다", () => {
    const items = [...OVERVIEW, ...CONSTITUTIONS.flatMap((c) => c.items)];
    for (const item of items) {
      if (item.kind === "quote") {
        expect(item.review).toBe("source-checked");
        expect(SOURCES[item.sourceId!]).toBeDefined();
      }
      if (item.review === "source-checked") expect(item.sourceId).toBeDefined();
      if (item.kind === "paraphrase" && !item.sourceId) expect(item.review).toBe("pending");
    }
  });

  it("체질 소개에 오행을 연결하는 서술이 없다", () => {
    const text = JSON.stringify(CONSTITUTIONS);
    for (const word of ["오행", "木", "火", "土", "金", "水", "사주"]) expect(text).not.toContain(word);
  });
});
