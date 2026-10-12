/** 사상체질 소개 · 생활 성향 탐색 */

export type ConstitutionId = "taeyang" | "soyang" | "taeeum" | "soeum";

/** 출처 확인 상태. pending 은 화면에 "검토 대기"로 표시한다 */
export type ReviewStatus = "source-checked" | "pending";

export interface Source {
  id: string;
  title: string;
  publisher: string;
  author?: string;
  url: string;
  /** 출처 쪽 최종 수정일 (확인된 경우만) */
  sourceUpdatedAt?: string;
  /** 우리가 출처를 열어 내용을 대조한 날짜 */
  checkedAt: string;
}

export interface ContentItem {
  label: string;
  text: string;
  /** quote: 출처 원문 인용, paraphrase: 우리 쪽 풀이 */
  kind: "quote" | "paraphrase";
  sourceId?: string;
  review: ReviewStatus;
  /** 검토 대기 사유 등 */
  note?: string;
}

export interface ConstitutionCard {
  id: ConstitutionId;
  name: string;
  hanja: string;
  items: ContentItem[];
}

/** 응답 선택지 값: 1 전혀 아니다 … 5 매우 그렇다 */
export type ChoiceValue = 1 | 2 | 3 | 4 | 5;

/** 문항별 응답. 건너뛰면 "skipped", 아직 보지 않았으면 키가 없다 */
export type Answer = ChoiceValue | "skipped";
export type Answers = Partial<Record<string, Answer>>;

export type DimensionId = "start" | "people" | "change" | "expression";

export interface Question {
  id: string;
  order: number;
  text: string;
  dimension: DimensionId;
  /** 요약 문장용. 반드시 "편"으로 끝난다 (예: "…해 보는 편") */
  phrase: string;
  /** "상황에 따라 다르다" 문장용 (예: "…해 보는지") */
  topic: string;
}

export interface QuestionSet {
  version: string;
  status: string;
  updatedAt: string;
  questions: Question[];
  choices: { value: ChoiceValue; label: string }[];
  dimensions: { id: DimensionId; label: string; pair: [string, string] }[];
}

export type DimensionSummaryKind =
  /** 두 문항 모두 답하지 않음 */
  | "unanswered"
  /** 한 문항만 답함 */
  | "partial"
  /** 서로 다른 두 성향에 모두 동의 */
  | "both-agree"
  /** 두 문항에 답했고 위 경우가 아님 */
  | "answered";

export interface DimensionSummary {
  dimension: DimensionId;
  label: string;
  kind: DimensionSummaryKind;
  /** 요약 문장. unanswered 면 null */
  sentence: string | null;
  /** 이 영역에서 실제로 고른 답 (건너뛴 문항 제외) */
  picks: { questionId: string; order: number; text: string; choiceLabel: string }[];
}

export interface TraitSummary {
  questionSetVersion: string;
  answeredCount: number;
  skippedCount: number;
  totalCount: number;
  dimensions: DimensionSummary[];
}

/** 사주와 비교 영역에서 사용자가 고르는 느낌 */
export type ComparisonFeeling = "saju" | "answers" | "depends";

/**
 * 비교 화면에 보여 줄 사주 쪽 요약.
 * kind 로 실제 결과와 예시를 구분하며, 예시는 화면에서 "내 결과 아님"으로 표시한다.
 */
export interface SajuFacts {
  kind: "actual" | "sample";
  label: string;
  facts: { label: string; value: string }[];
}
