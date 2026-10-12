export type Ohaeng = "목" | "화" | "토" | "금" | "수";
export type YinYang = "+" | "-";

export type Sipseong =
  | "비견"
  | "겁재"
  | "식신"
  | "상관"
  | "편재"
  | "정재"
  | "편관"
  | "정관"
  | "편인"
  | "정인";

/** 비겁·식상·재성·관성·인성 */
export type SipseongGroup = "비겁" | "식상" | "재성" | "관성" | "인성";

export type PillarPosition = "hour" | "day" | "month" | "year";

/** S=양력, M=음력, L=음력(윤달) */
export type CalendarType = "S" | "M" | "L";

export interface Profile {
  name: string;
  gender: "F" | "M";
  calendar: CalendarType;
  /** YYYY/MM/DD */
  birthday: string;
  /** HH:MM, 시간 모름이면 null */
  birthtime: string | null;
  city: string;
  /** 야자시 적용: 23시대 출생을 당일로 본다 */
  midnightAdjust?: boolean;
}

export interface BirthDates {
  solar: { date: string; time: string };
  lunar: { date: string; time: string; leap: boolean };
  /** 지역시 보정 후 */
  local: { date: string; time: string; correctionMinutes: number };
}

export interface Pillar {
  position: PillarPosition;
  /** 천간 한글 한 글자 (예: "갑") */
  stem: string;
  /** 지지 한글 한 글자 (예: "오") */
  branch: string;
  stemSipseong: Sipseong;
  branchSipseong: Sipseong;
  /** 지장간 (여기·중기·정기) */
  jijanggan: string[];
  unseong: string;
  sinsal12: string;
}

export interface Palace {
  position: PillarPosition;
  period: string;
  meaning: string;
  stemRole: string;
  branchRole: string;
}

export type RelationType =
  | "천간합"
  | "지지육합"
  | "지지삼합"
  | "지지방합"
  | "천간충"
  | "지지충"
  | "공망"
  | "형"
  | "파"
  | "해"
  | "원진";

export interface Relation {
  type: RelationType;
  items: string[];
}

export interface PillarStars {
  position: PillarPosition;
  stem: string[];
  branch: string[];
}

export type OhaengStatus = "부족" | "적정" | "발달" | "과다";

export interface OhaengStat {
  ohaeng: Ohaeng;
  percent: number;
  status: OhaengStatus;
}

export interface SipseongStat {
  sipseong: Sipseong;
  /** 없으면 null */
  percent: number | null;
}

export type StrengthVerdict = "극약" | "태약" | "신약" | "중화" | "신강" | "태강" | "극왕";

export interface Strength {
  deukryeong: boolean;
  deukji: boolean;
  deuksi: boolean;
  deukse: boolean;
  verdict: StrengthVerdict;
  /** 같은 판정에 해당하는 사람 비율 (%). 자체 통계가 없으면 null */
  populationPercent: number | null;
}

export interface Yongsin {
  ohaeng: Ohaeng;
  kind: string;
}

export interface LuckPillar {
  /** 대운: 나이, 연운: 연도, 월운: 월 */
  label: string;
  stem: string;
  branch: string;
  stemSipseong: Sipseong;
  branchSipseong: Sipseong;
  unseong: string;
}

export interface IljinDay {
  day: number;
  ganji: string;
  /** 음력 M.D */
  lunar: string;
  holiday?: string;
  solarTerm?: { name: string; time: string };
}

export interface IljinMonth {
  year: number;
  month: number;
  /** 예: "병오년 정유~무술월" */
  ganjiLabel: string;
  /** 1일의 요일 (0=일요일) */
  firstWeekday: number;
  days: IljinDay[];
}

export interface SajuResult {
  profile: Profile;
  /** 일주 (예: "병인") */
  ilju: string;
  dates: BirthDates;
  /** 생시·생일·생월·생년 순서 */
  pillars: Pillar[];
  palaces: Palace[];
  relations: Relation[];
  stars: {
    summary: string[];
    byPillar: PillarStars[];
  };
  ohaeng: OhaengStat[];
  sipseong: SipseongStat[];
  strength: Strength;
  yongsin: Yongsin;
  daeun: { startAge: number; pillars: LuckPillar[] };
  yeonun: LuckPillar[];
  wolun: { year: number; pillars: LuckPillar[] };
  iljin: IljinMonth;
}
