import type { Profile } from "@/types/saju";

/**
 * 입력한 프로필을 결과 화면으로 넘기는 임시 저장소.
 * 생년월일시는 개인정보라 URL 쿼리에 넣지 않고 탭 단위 sessionStorage에 둔다.
 * DB가 연결되면 저장된 프로필 id로 교체한다.
 */
const KEY = "saju:profile";

export function saveProfile(profile: Profile) {
  try {
    sessionStorage.setItem(KEY, JSON.stringify(profile));
  } catch {
    // 사생활 보호 모드 등에서 저장이 막혀도 화면 이동은 계속한다
  }
}

export function loadProfile(): Profile | null {
  try {
    const raw = sessionStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Profile) : null;
  } catch {
    return null;
  }
}
