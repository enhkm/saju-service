/**
 * 예시 사주: 1990/01/01 12:00 서울 출생 가상 인물(이름 "테스트").
 * - 결과 화면 디자인과 사상·생활 성향 비교 화면 미리보기용 데이터
 * - 만세력 결과를 참고해 옮겨 적은 값이며, 외부 서비스 고유 통계(같은 판정의 인구 비율)는 넣지 않았다.
 * - relations(합·충·형·파·해 등)는 네 기둥(갑오·병인·병자·기사)에 표준 규칙을 적용해 채운 값이다.
 * 계산 엔진(lib/saju)이 생기면 엔진 출력으로 교체하고, 이 파일은 비교 테스트용으로만 쓴다.
 */
import { GANJI_60 } from "@/lib/saju/constants";
import type { IljinDay, LuckPillar, SajuResult, Sipseong } from "@/types/saju";

function luck(
  label: string,
  ganji: string,
  stemSipseong: Sipseong,
  branchSipseong: Sipseong,
  unseong: string,
): LuckPillar {
  return { label, stem: ganji[0], branch: ganji[1], stemSipseong, branchSipseong, unseong };
}

function iljinDays(): IljinDay[] {
  const start = GANJI_60.indexOf("무신");
  const special: Record<number, Partial<IljinDay>> = {
    3: { holiday: "개천절" },
    8: { solarTerm: { name: "한로", time: "15:29" } },
    9: { holiday: "한글날" },
    23: { solarTerm: { name: "상강", time: "18:37" } },
  };
  return Array.from({ length: 31 }, (_, i) => {
    const day = i + 1;
    return {
      day,
      ganji: GANJI_60[(start + i) % 60],
      lunar: day <= 10 ? `8.${20 + day}` : `9.${day - 10}`,
      ...special[day],
    };
  });
}

export const sampleResult: SajuResult = {
  profile: {
    name: "테스트",
    gender: "F",
    calendar: "S",
    birthday: "1990/01/01",
    birthtime: "12:00",
    city: "서울특별시",
  },
  ilju: "병인",
  dates: {
    solar: { date: "1990/01/01", time: "12:00" },
    lunar: { date: "1989/12/05", time: "12:00", leap: false },
    local: { date: "1990/01/01", time: "11:28", correctionMinutes: -32 },
  },
  pillars: [
    {
      position: "hour",
      stem: "갑",
      branch: "오",
      stemSipseong: "편인",
      branchSipseong: "겁재",
      jijanggan: ["병", "기", "정"],
      unseong: "제왕",
      sinsal12: "년살",
    },
    {
      position: "day",
      stem: "병",
      branch: "인",
      stemSipseong: "비견",
      branchSipseong: "편인",
      jijanggan: ["무", "병", "갑"],
      unseong: "장생",
      sinsal12: "겁살",
    },
    {
      position: "month",
      stem: "병",
      branch: "자",
      stemSipseong: "비견",
      branchSipseong: "정관",
      jijanggan: ["임", "계"],
      unseong: "태",
      sinsal12: "육해살",
    },
    {
      position: "year",
      stem: "기",
      branch: "사",
      stemSipseong: "상관",
      branchSipseong: "비견",
      jijanggan: ["무", "경", "병"],
      unseong: "건록",
      sinsal12: "망신살",
    },
  ],
  palaces: [
    { position: "hour", period: "말년운", meaning: "자녀운, 결실", stemRole: "아들", branchRole: "딸" },
    { position: "day", period: "중년운", meaning: "정체성, 자아", stemRole: "자신", branchRole: "배우자" },
    { position: "month", period: "청년운", meaning: "부모, 사회상", stemRole: "부친", branchRole: "모친" },
    { position: "year", period: "초년운", meaning: "조상, 시대상", stemRole: "조부", branchRole: "조모" },
  ],
  relations: [
    { type: "천간합", items: ["갑기합 토 (생시 갑 · 생년 기)"] },
    { type: "지지육합", items: [] },
    { type: "지지삼합", items: ["인오 반합 화 (생일 인 · 생시 오)"] },
    { type: "지지방합", items: ["사오 화 (생년 사 · 생시 오)"] },
    { type: "천간충", items: [] },
    { type: "지지충", items: ["자오충 (생월 자 · 생시 오)"] },
    { type: "공망", items: [] },
    { type: "형", items: ["인사형 (생일 인 · 생년 사)"] },
    { type: "파", items: [] },
    { type: "해", items: ["인사해 (생일 인 · 생년 사)"] },
    { type: "원진", items: [] },
  ],
  stars: {
    summary: [
      "천덕귀인",
      "정록",
      "역마살",
      "도화살",
      "학당귀인",
      "문곡귀인",
      "홍염살",
      "현침살",
      "양인살",
    ],
    byPillar: [
      { position: "hour", stem: ["현침살"], branch: ["도화살", "현침살", "양인살"] },
      { position: "day", stem: [], branch: ["학당귀인", "문곡귀인", "홍염살", "역마살"] },
      { position: "month", stem: [], branch: ["도화살"] },
      { position: "year", stem: [], branch: ["천덕귀인", "정록", "역마살"] },
    ],
  },
  ohaeng: [
    { ohaeng: "목", percent: 25, status: "발달" },
    { ohaeng: "화", percent: 50, status: "과다" },
    { ohaeng: "토", percent: 12.5, status: "적정" },
    { ohaeng: "금", percent: 0, status: "부족" },
    { ohaeng: "수", percent: 12.5, status: "적정" },
  ],
  sipseong: [
    { sipseong: "비견", percent: 37.5 },
    { sipseong: "겁재", percent: 12.5 },
    { sipseong: "식신", percent: null },
    { sipseong: "상관", percent: 12.5 },
    { sipseong: "편재", percent: null },
    { sipseong: "정재", percent: null },
    { sipseong: "편관", percent: null },
    { sipseong: "정관", percent: 12.5 },
    { sipseong: "편인", percent: 25 },
    { sipseong: "정인", percent: null },
  ],
  strength: {
    deukryeong: false,
    deukji: true,
    deuksi: true,
    deukse: true,
    verdict: "신강",
    populationPercent: null,
  },
  yongsin: { ohaeng: "수", kind: "억부용신" },
  daeun: {
    startAge: 2,
    pillars: [
      luck("2", "정축", "겁재", "상관", "양"),
      luck("12", "무인", "식신", "편인", "장생"),
      luck("22", "기묘", "상관", "정인", "목욕"),
      luck("32", "경진", "편재", "식신", "관대"),
      luck("42", "신사", "정재", "비견", "건록"),
      luck("52", "임오", "편관", "겁재", "제왕"),
      luck("62", "계미", "정관", "상관", "쇠"),
      luck("72", "갑신", "편인", "편재", "병"),
      luck("82", "을유", "정인", "정재", "사"),
      luck("92", "병술", "비견", "식신", "묘"),
    ],
  },
  yeonun: [
    luck("1990", "경오", "편재", "겁재", "제왕"),
    luck("1991", "신미", "정재", "상관", "쇠"),
    luck("1992", "임신", "편관", "편재", "병"),
    luck("1993", "계유", "정관", "정재", "사"),
    luck("1994", "갑술", "편인", "식신", "묘"),
    luck("1995", "을해", "정인", "편관", "절"),
    luck("1996", "병자", "비견", "정관", "태"),
    luck("1997", "정축", "겁재", "상관", "양"),
    luck("1998", "무인", "식신", "편인", "장생"),
    luck("1999", "기묘", "상관", "정인", "목욕"),
  ],
  wolun: {
    year: 1990,
    pillars: [
      luck("2월", "무인", "식신", "편인", "장생"),
      luck("3월", "기묘", "상관", "정인", "목욕"),
      luck("4월", "경진", "편재", "식신", "관대"),
      luck("5월", "신사", "정재", "비견", "건록"),
      luck("6월", "임오", "편관", "겁재", "제왕"),
      luck("7월", "계미", "정관", "상관", "쇠"),
      luck("8월", "갑신", "편인", "편재", "병"),
      luck("9월", "을유", "정인", "정재", "사"),
      luck("10월", "병술", "비견", "식신", "묘"),
      luck("11월", "정해", "겁재", "편관", "절"),
      luck("12월", "무자", "식신", "정관", "태"),
      luck("1월", "기축", "상관", "상관", "양"),
    ],
  },
  iljin: {
    year: 2026,
    month: 10,
    ganjiLabel: "병오년 정유~무술월",
    firstWeekday: 4,
    days: iljinDays(),
  },
};
