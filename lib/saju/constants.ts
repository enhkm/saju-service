import type { Ohaeng, PillarPosition, Sipseong, SipseongGroup, YinYang } from "@/types/saju";

export interface GanjiInfo {
  hangul: string;
  hanja: string;
  ohaeng: Ohaeng;
  yinyang: YinYang;
}

export const STEMS: GanjiInfo[] = [
  { hangul: "갑", hanja: "甲", ohaeng: "목", yinyang: "+" },
  { hangul: "을", hanja: "乙", ohaeng: "목", yinyang: "-" },
  { hangul: "병", hanja: "丙", ohaeng: "화", yinyang: "+" },
  { hangul: "정", hanja: "丁", ohaeng: "화", yinyang: "-" },
  { hangul: "무", hanja: "戊", ohaeng: "토", yinyang: "+" },
  { hangul: "기", hanja: "己", ohaeng: "토", yinyang: "-" },
  { hangul: "경", hanja: "庚", ohaeng: "금", yinyang: "+" },
  { hangul: "신", hanja: "辛", ohaeng: "금", yinyang: "-" },
  { hangul: "임", hanja: "壬", ohaeng: "수", yinyang: "+" },
  { hangul: "계", hanja: "癸", ohaeng: "수", yinyang: "-" },
];

/** 지지 음양은 체용(體用) 중 용(用) 기준: 자·오는 음, 사·해는 양 */
export const BRANCHES: (GanjiInfo & { animal: string })[] = [
  { hangul: "자", hanja: "子", ohaeng: "수", yinyang: "-", animal: "쥐" },
  { hangul: "축", hanja: "丑", ohaeng: "토", yinyang: "-", animal: "소" },
  { hangul: "인", hanja: "寅", ohaeng: "목", yinyang: "+", animal: "호랑이" },
  { hangul: "묘", hanja: "卯", ohaeng: "목", yinyang: "-", animal: "토끼" },
  { hangul: "진", hanja: "辰", ohaeng: "토", yinyang: "+", animal: "용" },
  { hangul: "사", hanja: "巳", ohaeng: "화", yinyang: "+", animal: "뱀" },
  { hangul: "오", hanja: "午", ohaeng: "화", yinyang: "-", animal: "말" },
  { hangul: "미", hanja: "未", ohaeng: "토", yinyang: "-", animal: "양" },
  { hangul: "신", hanja: "申", ohaeng: "금", yinyang: "+", animal: "원숭이" },
  { hangul: "유", hanja: "酉", ohaeng: "금", yinyang: "-", animal: "닭" },
  { hangul: "술", hanja: "戌", ohaeng: "토", yinyang: "+", animal: "개" },
  { hangul: "해", hanja: "亥", ohaeng: "수", yinyang: "+", animal: "돼지" },
];

export const OHAENG_ORDER: Ohaeng[] = ["목", "화", "토", "금", "수"];

export const OHAENG_HANJA: Record<Ohaeng, string> = {
  목: "木",
  화: "火",
  토: "土",
  금: "金",
  수: "水",
};

/** 일주 동물 앞에 붙는 색 이름 (천간 오행 기준) */
export const OHAENG_COLOR_NAME: Record<Ohaeng, string> = {
  목: "푸른",
  화: "붉은",
  토: "노란",
  금: "하얀",
  수: "검은",
};

export const SIPSEONG_ORDER: Sipseong[] = [
  "비견",
  "겁재",
  "식신",
  "상관",
  "편재",
  "정재",
  "편관",
  "정관",
  "편인",
  "정인",
];

export const SIPSEONG_HANJA: Record<Sipseong, string> = {
  비견: "比肩",
  겁재: "劫財",
  식신: "食神",
  상관: "傷官",
  편재: "偏財",
  정재: "正財",
  편관: "偏官",
  정관: "正官",
  편인: "偏印",
  정인: "正印",
};

export const SIPSEONG_GROUP: Record<Sipseong, SipseongGroup> = {
  비견: "비겁",
  겁재: "비겁",
  식신: "식상",
  상관: "식상",
  편재: "재성",
  정재: "재성",
  편관: "관성",
  정관: "관성",
  편인: "인성",
  정인: "인성",
};

export const PILLAR_LABEL: Record<PillarPosition, string> = {
  hour: "생시",
  day: "생일",
  month: "생월",
  year: "생년",
};

/** 상생 순서에서 일간 오행으로부터 몇 칸 떨어졌는지로 십성 그룹을 정한다 */
const GROUP_BY_DISTANCE: SipseongGroup[] = ["비겁", "식상", "재성", "관성", "인성"];

export function groupOf(dayMaster: Ohaeng, target: Ohaeng): SipseongGroup {
  const d = (OHAENG_ORDER.indexOf(target) - OHAENG_ORDER.indexOf(dayMaster) + 5) % 5;
  return GROUP_BY_DISTANCE[d];
}

export function stemInfo(hangul: string): GanjiInfo {
  const s = STEMS.find((x) => x.hangul === hangul);
  if (!s) throw new Error(`unknown stem: ${hangul}`);
  return s;
}

export function branchInfo(hangul: string) {
  const b = BRANCHES.find((x) => x.hangul === hangul);
  if (!b) throw new Error(`unknown branch: ${hangul}`);
  return b;
}

/** "병인" → "丙寅" */
export function ganjiHanja(ganji: string): string {
  return stemInfo(ganji[0]).hanja + branchInfo(ganji[1]).hanja;
}

/** 60갑자 순서 */
export const GANJI_60: string[] = Array.from(
  { length: 60 },
  (_, i) => STEMS[i % 10].hangul + BRANCHES[i % 12].hangul,
);

/** 일주 → "붉은 호랑이" */
export function iljuLabel(ilju: string): string {
  return `${OHAENG_COLOR_NAME[stemInfo(ilju[0]).ohaeng]} ${branchInfo(ilju[1]).animal}`;
}
