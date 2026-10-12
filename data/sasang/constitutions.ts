/**
 * 사상체질 소개 콘텐츠와 출처.
 *
 * 원칙
 * - 출처 원문에서 확인한 문장만 kind: "quote", review: "source-checked" 로 넣는다.
 * - 우리 쪽 풀이는 kind: "paraphrase", review: "pending"(전문가 검토 대기)으로 둔다.
 * - 출처를 확인하지 못한 내용(원전 대조, 체형 설명, 음식·약, 질병 경향 등)은 넣지 않고
 *   PENDING_TOPICS 에 사유만 적는다.
 * - 오행·사주와 연결하는 서술은 넣지 않는다.
 */
import type { ConstitutionCard, Source } from "@/types/sasang";

export const CONTENT_VERSION = "2026-10-12";

export const SOURCES: Record<string, Source> = {
  encykorea: {
    id: "encykorea",
    title: "사상의학",
    publisher: "한국민족문화대백과사전 (한국학중앙연구원)",
    author: "송일병",
    url: "https://encykorea.aks.ac.kr/Article/E0025696",
    sourceUpdatedAt: "2023-02-07",
    checkedAt: "2026-10-12",
  },
};

/** 사상의학 전반 소개 */
export const OVERVIEW: ConstitutionCard["items"] = [
  {
    label: "정의",
    text: "사람들을 체질적 특성에 따라 태양·태음·소양·소음의 네 유형으로 나누고 그에 따라 병을 진단하고 치료하는 우리나라 고유의 학문",
    kind: "quote",
    sourceId: "encykorea",
    review: "source-checked",
  },
  {
    label: "유래",
    text: "이제마가 1894년 『동의수세보원(東醫壽世保元)』에서 처음으로 창안, 발표하였다고 소개합니다.",
    kind: "paraphrase",
    sourceId: "encykorea",
    review: "source-checked",
    note: "백과사전 본문의 연도 표기를 옮긴 문장입니다.",
  },
];

/**
 * 네 유형 카드. 순서는 출처의 성정 서술 순서(태양·소양·태음·소음)를 따른다.
 * 장부 대소와 성정은 이론상 개념 설명이며, 개인의 건강 상태나 성격을 판정하는 근거로 쓰지 않는다.
 */
export const CONSTITUTIONS: ConstitutionCard[] = [
  {
    id: "taeyang",
    name: "태양인",
    hanja: "太陽人",
    items: [
      { label: "장부의 대소", text: "폐(肺)가 크고 간(肝)이 작으며", kind: "quote", sourceId: "encykorea", review: "source-checked" },
      {
        label: "성정",
        text: "본래 애성(哀性)이 원산(遠散)하고 노정(怒情)이 촉급한 본성이 있어",
        kind: "quote",
        sourceId: "encykorea",
        review: "source-checked",
      },
      { label: "경계할 점", text: "항상 크게 노하는 일을 경계해야 하고", kind: "quote", sourceId: "encykorea", review: "source-checked" },
      {
        label: "낱말 풀이",
        text: "애성(哀性)은 슬퍼하는 성품, 원산(遠散)은 멀리 흩어짐, 노정(怒情)은 성내는 감정, 촉급(促急)은 급하게 일어남을 뜻하는 말로 풀이했습니다.",
        kind: "paraphrase",
        review: "pending",
        note: "한자어 풀이는 개발 단계 작성으로, 한의학 전문가 검토 전입니다.",
      },
    ],
  },
  {
    id: "soyang",
    name: "소양인",
    hanja: "少陽人",
    items: [
      { label: "장부의 대소", text: "비(脾)가 크고 신(腎)이 작으며", kind: "quote", sourceId: "encykorea", review: "source-checked" },
      {
        label: "성정",
        text: "노성은 넓게 포용하지만 애정은 촉급한 본성이 있으니",
        kind: "quote",
        sourceId: "encykorea",
        review: "source-checked",
      },
      { label: "경계할 점", text: "항상 깊이 슬퍼하는 일을 경계해야 하며", kind: "quote", sourceId: "encykorea", review: "source-checked" },
      {
        label: "낱말 풀이",
        text: "노성(怒性)은 성내는 성품, 애정(哀情)은 슬퍼하는 감정을 뜻하는 말로 풀이했습니다.",
        kind: "paraphrase",
        review: "pending",
        note: "한자어 풀이는 개발 단계 작성으로, 한의학 전문가 검토 전입니다.",
      },
    ],
  },
  {
    id: "taeeum",
    name: "태음인",
    hanja: "太陰人",
    items: [
      { label: "장부의 대소", text: "간이 크고 폐가 작은 체질", kind: "quote", sourceId: "encykorea", review: "source-checked" },
      {
        label: "성정",
        text: "희성(喜性)은 넓게 펴지지만 낙정(樂情)은 촉급한 본성이 있으니",
        kind: "quote",
        sourceId: "encykorea",
        review: "source-checked",
      },
      { label: "경계할 점", text: "항상 도락에 빠지는 일을 경계해야 하고", kind: "quote", sourceId: "encykorea", review: "source-checked" },
      {
        label: "낱말 풀이",
        text: "희성(喜性)은 기뻐하는 성품, 낙정(樂情)은 즐거워하는 감정, 도락(道樂)은 즐거움에 빠짐을 뜻하는 말로 풀이했습니다.",
        kind: "paraphrase",
        review: "pending",
        note: "한자어 풀이는 개발 단계 작성으로, 한의학 전문가 검토 전입니다.",
      },
    ],
  },
  {
    id: "soeum",
    name: "소음인",
    hanja: "少陰人",
    items: [
      { label: "장부의 대소", text: "신이 크고 비가 작은 체질", kind: "quote", sourceId: "encykorea", review: "source-checked" },
      {
        label: "성정",
        text: "낙성(樂性)이 심확(深確)하고 희정(喜情)이 촉급한 본성이 있으므로",
        kind: "quote",
        sourceId: "encykorea",
        review: "source-checked",
      },
      { label: "경계할 점", text: "항상 지나치게 기뻐하는 일을 경계해야 한다", kind: "quote", sourceId: "encykorea", review: "source-checked" },
      {
        label: "낱말 풀이",
        text: "낙성(樂性)은 즐거워하는 성품, 심확(深確)은 깊고 굳음, 희정(喜情)은 기뻐하는 감정을 뜻하는 말로 풀이했습니다.",
        kind: "paraphrase",
        review: "pending",
        note: "한자어 풀이는 개발 단계 작성으로, 한의학 전문가 검토 전입니다.",
      },
    ],
  },
];

/** 출처를 확인하지 못해 넣지 않은 주제 (화면에 "검토 대기"로 안내) */
export const PENDING_TOPICS: { topic: string; reason: string }[] = [
  {
    topic: "『동의수세보원』 원문 대조",
    reason: "한의학고전DB(mediclassics.kr) 접속이 거부되어(403) 원문을 직접 확인하지 못했습니다.",
  },
  {
    topic: "체형·용모 설명",
    reason: "확인한 공공 자료에 특정 유형을 낮춰 부르는 표현이 함께 있어 전문가 검토 후 싣기로 했습니다.",
  },
  {
    topic: "체질별 음식·약·질병 경향",
    reason: "의료 정보에 해당하므로 이 콘텐츠에서는 다루지 않습니다.",
  },
];
