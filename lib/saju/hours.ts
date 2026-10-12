import { BRANCHES } from "./constants";

/**
 * 12간지 시간표 (한국 표준시 기준).
 * 한국은 동경 135도 표준시를 쓰지만 실제 경도는 127도 안팎이라 각 시(時)가 정각보다 30분 늦게 시작한다.
 * 정확한 경계는 출생 도시 경도로 보정해야 하며, 여기서는 안내용 근사값이다.
 */
export interface HourSlot {
  branch: string;
  hanja: string;
  animal: string;
  /** 시작 시각 (분, 0~1439) */
  start: number;
  label: string;
}

const fmt = (m: number) => `${String(Math.floor(m / 60) % 24).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;

export const HOUR_TABLE: HourSlot[] = BRANCHES.map((b, i) => {
  const start = (23 * 60 + 30 + i * 120) % 1440;
  return {
    branch: b.hangul,
    hanja: b.hanja,
    animal: b.animal,
    start,
    label: `${fmt(start)}~${fmt((start + 119) % 1440)}`,
  };
});

/** "HH:MM" → 해당 시(時). 형식이 틀리면 null */
export function hourSlotOf(time: string): HourSlot | null {
  const m = /^(\d{2}):(\d{2})$/.exec(time);
  if (!m) return null;
  const h = Number(m[1]);
  const min = Number(m[2]);
  if (h > 23 || min > 59) return null;
  const t = h * 60 + min;
  // 자시(23:30)부터 2시간 단위
  const idx = Math.floor(((t - (23 * 60 + 30) + 1440) % 1440) / 120);
  return HOUR_TABLE[idx];
}
