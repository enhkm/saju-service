import { branchInfo, stemInfo } from "@/lib/saju/constants";
import type { Ohaeng } from "@/types/saju";

const OHAENG_VAR: Record<Ohaeng, string> = {
  목: "wood",
  화: "fire",
  토: "earth",
  금: "metal",
  수: "water",
};

/** 오행 색 인라인 스타일 (Tailwind 클래스로 만들기 어려운 동적 색) */
export function ohaengStyle(ohaeng: Ohaeng): React.CSSProperties {
  const v = OHAENG_VAR[ohaeng];
  return {
    backgroundColor: `var(--${v})`,
    color: `var(--${v}-ink)`,
    boxShadow: ohaeng === "금" ? "inset 0 0 0 1px var(--line-strong)" : undefined,
  };
}

export function ohaengBarColor(ohaeng: Ohaeng): string {
  return ohaeng === "금" ? "var(--metal-bar)" : `var(--${OHAENG_VAR[ohaeng]})`;
}

const SIZE = {
  sm: { box: "h-9 w-9 rounded-[5px]", hanja: "text-lg", meta: "hidden" },
  md: { box: "h-14 w-14 rounded-md", hanja: "text-2xl", meta: "text-[10px]" },
  lg: { box: "h-14 w-14 rounded-md sm:h-20 sm:w-20 sm:rounded-lg", hanja: "text-[28px] sm:text-4xl", meta: "text-[10px] sm:text-[11px]" },
};

interface Props {
  char: string;
  kind: "stem" | "branch";
  size?: keyof typeof SIZE;
}

/** 천간/지지 한 글자를 오행 색 타일로 보여준다 */
export function GanjiTile({ char, kind, size = "md" }: Props) {
  const info = kind === "stem" ? stemInfo(char) : branchInfo(char);
  const s = SIZE[size];
  return (
    <div
      className={`${s.box} flex flex-col items-center justify-center leading-none`}
      style={ohaengStyle(info.ohaeng)}
      title={`${info.hangul}${info.hanja} · ${info.yinyang}${info.ohaeng}`}
    >
      <span className={`${s.hanja} font-hanja font-semibold`}>{info.hanja}</span>
      <span className={`${s.meta} mt-1 opacity-80`}>
        {info.hangul} {info.yinyang}
        {info.ohaeng}
      </span>
    </div>
  );
}
