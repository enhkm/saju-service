/**
 * 생활 성향 질문 (초안).
 * 사상체질 진단 문항이 아니며, 응답을 네 체질로 바꾸는 점수표도 두지 않는다.
 * 문항을 바꾸면 version 을 올려, 나중에 저장 기능이 생겨도 어떤 문항에 대한 답인지 구분할 수 있게 한다.
 */
import type { QuestionSet } from "@/types/sasang";

export const QUESTION_SET: QuestionSet = {
  version: "lifestyle-draft-1",
  status: "초안 · 전문가 검토 전",
  updatedAt: "2026-10-12",
  choices: [
    { value: 1, label: "전혀 아니다" },
    { value: 2, label: "아닌 편이다" },
    { value: 3, label: "상황에 따라 다르다" },
    { value: 4, label: "그런 편이다" },
    { value: 5, label: "매우 그렇다" },
  ],
  // 서로 다른 성향을 묻는 두 문항을 한 영역으로 묶는다. 점수를 빼서 상쇄하지 않는다.
  dimensions: [
    { id: "start", label: "일을 시작할 때", pair: ["q1", "q2"] },
    { id: "people", label: "사람과 시간", pair: ["q3", "q4"] },
    { id: "change", label: "새로움과 익숙함", pair: ["q5", "q6"] },
    { id: "expression", label: "생각과 감정 표현", pair: ["q7", "q8"] },
  ],
  questions: [
    {
      id: "q1",
      order: 1,
      text: "새로운 일을 생각하면 실행부터 해보는 편이다.",
      dimension: "start",
      phrase: "새로운 일을 생각하면 실행부터 해 보는 편",
      topic: "새로운 일을 실행부터 해 보는지",
    },
    {
      id: "q2",
      order: 2,
      text: "결정을 내리기 전에 충분히 살펴보는 편이다.",
      dimension: "start",
      phrase: "결정을 내리기 전에 충분히 살펴보는 편",
      topic: "결정 전에 충분히 살펴보는지",
    },
    {
      id: "q3",
      order: 3,
      text: "사람들과 함께 활동하는 시간이 즐겁다.",
      dimension: "people",
      phrase: "사람들과 함께 활동하는 시간을 즐기는 편",
      topic: "사람들과 함께하는 시간이 즐거운지",
    },
    {
      id: "q4",
      order: 4,
      text: "혼자 조용히 보내는 시간이 필요하다.",
      dimension: "people",
      phrase: "혼자 조용히 보내는 시간이 필요한 편",
      topic: "혼자만의 조용한 시간이 필요한지",
    },
    {
      id: "q5",
      order: 5,
      text: "익숙한 방식보다 새로운 방식을 시도하는 편이다.",
      dimension: "change",
      phrase: "익숙한 방식보다 새로운 방식을 시도하는 편",
      topic: "새로운 방식을 시도하는지",
    },
    {
      id: "q6",
      order: 6,
      text: "일정하고 예측 가능한 일상이 편하다.",
      dimension: "change",
      phrase: "일정하고 예측 가능한 일상을 편하게 느끼는 편",
      topic: "예측 가능한 일상이 편한지",
    },
    {
      id: "q7",
      order: 7,
      text: "생각이나 감정을 바로 표현하는 편이다.",
      dimension: "expression",
      phrase: "생각이나 감정을 바로 표현하는 편",
      topic: "생각이나 감정을 바로 표현하는지",
    },
    {
      id: "q8",
      order: 8,
      text: "생각을 정리한 다음 표현하는 편이다.",
      dimension: "expression",
      phrase: "생각을 정리한 다음 표현하는 편",
      topic: "생각을 정리한 뒤 표현하는지",
    },
  ],
};
