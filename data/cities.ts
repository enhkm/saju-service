/**
 * 출생 도시 샘플 목록.
 * 실제 서비스에서는 시군구 전체(또는 GeoNames 데이터)를 DB에 넣고 /api/cities 로 검색한다.
 * 외부 서비스의 도시 검색 API는 사용하지 않는다.
 * 경도는 지역시 보정(경도 1도 = 4분)에 쓰인다. 서울은 127.0을 쓴다.
 */
export interface City {
  name: string;
  country: string;
  lat: number;
  lng: number;
  timeZone: string;
}

export const CITIES: City[] = [
  { name: "서울특별시", country: "대한민국", lat: 37.5833, lng: 127.0, timeZone: "Asia/Seoul" },
  { name: "부산광역시", country: "대한민국", lat: 35.1028, lng: 129.0403, timeZone: "Asia/Seoul" },
  { name: "대구광역시", country: "대한민국", lat: 35.8703, lng: 128.5911, timeZone: "Asia/Seoul" },
  { name: "인천광역시", country: "대한민국", lat: 37.4563, lng: 126.7052, timeZone: "Asia/Seoul" },
  { name: "광주광역시", country: "대한민국", lat: 35.1595, lng: 126.8526, timeZone: "Asia/Seoul" },
  { name: "대전광역시", country: "대한민국", lat: 36.3504, lng: 127.3845, timeZone: "Asia/Seoul" },
  { name: "울산광역시", country: "대한민국", lat: 35.5384, lng: 129.3114, timeZone: "Asia/Seoul" },
  { name: "세종특별자치시", country: "대한민국", lat: 36.48, lng: 127.289, timeZone: "Asia/Seoul" },
  { name: "수원시", country: "대한민국", lat: 37.2636, lng: 127.0286, timeZone: "Asia/Seoul" },
  { name: "고양시", country: "대한민국", lat: 37.6584, lng: 126.835, timeZone: "Asia/Seoul" },
  { name: "성남시", country: "대한민국", lat: 37.42, lng: 127.1265, timeZone: "Asia/Seoul" },
  { name: "춘천시", country: "대한민국", lat: 37.8813, lng: 127.7298, timeZone: "Asia/Seoul" },
  { name: "강릉시", country: "대한민국", lat: 37.7519, lng: 128.8761, timeZone: "Asia/Seoul" },
  { name: "청주시", country: "대한민국", lat: 36.6424, lng: 127.489, timeZone: "Asia/Seoul" },
  { name: "천안시", country: "대한민국", lat: 36.8151, lng: 127.1522, timeZone: "Asia/Seoul" },
  { name: "전주시", country: "대한민국", lat: 35.8242, lng: 127.148, timeZone: "Asia/Seoul" },
  { name: "목포시", country: "대한민국", lat: 34.8118, lng: 126.3922, timeZone: "Asia/Seoul" },
  { name: "여수시", country: "대한민국", lat: 34.7604, lng: 127.6622, timeZone: "Asia/Seoul" },
  { name: "포항시", country: "대한민국", lat: 36.019, lng: 129.365, timeZone: "Asia/Seoul" },
  { name: "안동시", country: "대한민국", lat: 36.5684, lng: 128.7294, timeZone: "Asia/Seoul" },
  { name: "창원시", country: "대한민국", lat: 35.2281, lng: 128.6811, timeZone: "Asia/Seoul" },
  { name: "진주시", country: "대한민국", lat: 35.18, lng: 128.1076, timeZone: "Asia/Seoul" },
  { name: "제주시", country: "대한민국", lat: 33.4996, lng: 126.5312, timeZone: "Asia/Seoul" },
  { name: "도쿄", country: "일본", lat: 35.6895, lng: 139.6917, timeZone: "Asia/Tokyo" },
  { name: "베이징", country: "중국", lat: 39.9075, lng: 116.3972, timeZone: "Asia/Shanghai" },
  { name: "뉴욕", country: "미국", lat: 40.7128, lng: -74.006, timeZone: "America/New_York" },
  { name: "로스앤젤레스", country: "미국", lat: 34.0522, lng: -118.2437, timeZone: "America/Los_Angeles" },
  { name: "런던", country: "영국", lat: 51.5085, lng: -0.1257, timeZone: "Europe/London" },
  { name: "시드니", country: "호주", lat: -33.8679, lng: 151.2073, timeZone: "Australia/Sydney" },
];

/**
 * 한국 도시의 지역시 보정(분). 표준시 자오선 동경 135도 기준.
 * 서머타임·1954~1961년 표준시(UTC+8:30) 변경은 계산 엔진 단계에서 반영한다.
 */
export function koreaLocalCorrection(city: City): number | null {
  if (city.timeZone !== "Asia/Seoul") return null;
  return Math.round(city.lng * 4 - 135 * 4);
}
