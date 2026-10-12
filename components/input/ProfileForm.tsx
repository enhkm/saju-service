"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { CITIES, koreaLocalCorrection } from "@/data/cities";
import { HOUR_TABLE, hourSlotOf } from "@/lib/saju/hours";
import { saveProfile } from "@/lib/profileStore";
import type { CalendarType, Profile } from "@/types/saju";

const CALENDARS: { value: CalendarType; label: string }[] = [
  { value: "S", label: "양력" },
  { value: "M", label: "음력" },
  { value: "L", label: "음력(윤달)" },
];

/** 숫자만 남기고 YYYY/MM/DD 형태로 */
function formatDate(raw: string) {
  const d = raw.replace(/\D/g, "").slice(0, 8);
  if (d.length <= 4) return d;
  if (d.length <= 6) return `${d.slice(0, 4)}/${d.slice(4)}`;
  return `${d.slice(0, 4)}/${d.slice(4, 6)}/${d.slice(6)}`;
}

/** 숫자만 남기고 HH:MM 형태로 */
function formatTime(raw: string) {
  const d = raw.replace(/\D/g, "").slice(0, 4);
  return d.length <= 2 ? d : `${d.slice(0, 2)}:${d.slice(2)}`;
}

function validateDate(value: string, calendar: CalendarType): string | null {
  const m = /^(\d{4})\/(\d{2})\/(\d{2})$/.exec(value);
  if (!m) return "생년월일을 YYYY/MM/DD 형식으로 입력해 주세요.";
  const [y, mo, d] = [Number(m[1]), Number(m[2]), Number(m[3])];
  if (y < 1900 || y > 2100) return "1900년부터 2100년 사이로 입력해 주세요.";
  if (mo < 1 || mo > 12) return "월은 1~12 사이여야 합니다.";
  if (calendar === "S") {
    const dt = new Date(y, mo - 1, d);
    if (dt.getMonth() !== mo - 1 || dt.getDate() !== d) return "존재하지 않는 날짜입니다.";
  } else if (d < 1 || d > 30) {
    return "음력 날짜는 1~30일 사이여야 합니다.";
  }
  return null;
}

type Errors = Partial<Record<"name" | "birthday" | "birthtime", string>>;

export function ProfileForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [gender, setGender] = useState<"F" | "M">("F");
  const [calendar, setCalendar] = useState<CalendarType>("S");
  const [birthday, setBirthday] = useState("");
  const [birthtime, setBirthtime] = useState("");
  const [timeUnknown, setTimeUnknown] = useState(false);
  const [midnightAdjust, setMidnightAdjust] = useState(false);
  const [cityName, setCityName] = useState(CITIES[0].name);
  const [showHours, setShowHours] = useState(false);
  const [errors, setErrors] = useState<Errors>({});

  /** 고친 칸의 오류 문구는 바로 지운다 */
  const clearError = (key: keyof Errors) => setErrors((prev) => (prev[key] ? { ...prev, [key]: undefined } : prev));

  const slot = useMemo(() => (timeUnknown ? null : hourSlotOf(birthtime)), [birthtime, timeUnknown]);
  const city = CITIES.find((c) => c.name === cityName)!;
  const correction = koreaLocalCorrection(city);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const next: Errors = {};
    if (!name.trim()) next.name = "이름을 입력해 주세요.";
    const dateError = validateDate(birthday, calendar);
    if (dateError) next.birthday = dateError;
    if (!timeUnknown && !hourSlotOf(birthtime)) next.birthtime = "출생 시각을 HH:MM 형식(00:00~23:59)으로 입력해 주세요.";
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    const profile: Profile = {
      name: name.trim(),
      gender,
      calendar,
      birthday,
      birthtime: timeUnknown ? null : birthtime,
      city: city.name,
      midnightAdjust,
    };
    saveProfile(profile);
    router.push("/result");
  }

  return (
    <form onSubmit={submit} noValidate className="space-y-6">
      <Field label="이름" hanja="名" htmlFor="name" error={errors.name}>
        <input
          id="name"
          value={name}
          maxLength={12}
          onChange={(e) => {
            setName(e.target.value);
            clearError("name");
          }}
          placeholder="최대 12글자"
          autoComplete="off"
          className={inputClass(!!errors.name)}
        />
      </Field>

      <Field label="성별" hanja="性">
        <Segmented
          name="gender"
          value={gender}
          onChange={(v) => setGender(v as "F" | "M")}
          options={[
            { value: "F", label: "여자", mark: "坤" },
            { value: "M", label: "남자", mark: "乾" },
          ]}
        />
      </Field>

      <Field label="생년월일" hanja="生" htmlFor="birthday" error={errors.birthday}>
        <Segmented
          name="calendar"
          value={calendar}
          onChange={(v) => setCalendar(v as CalendarType)}
          options={CALENDARS}
        />
        <input
          id="birthday"
          value={birthday}
          inputMode="numeric"
          onChange={(e) => {
            setBirthday(formatDate(e.target.value));
            clearError("birthday");
          }}
          placeholder="1990/01/01"
          autoComplete="off"
          className={`${inputClass(!!errors.birthday)} mt-2.5 tabular-nums`}
        />
      </Field>

      <Field label="출생 시각" hanja="時" htmlFor="birthtime" error={errors.birthtime}>
        <div className="flex items-center gap-3">
          <input
            id="birthtime"
            value={timeUnknown ? "" : birthtime}
            disabled={timeUnknown}
            inputMode="numeric"
            onChange={(e) => {
              setBirthtime(formatTime(e.target.value));
              clearError("birthtime");
            }}
            placeholder={timeUnknown ? "시간 모름" : "13:30"}
            autoComplete="off"
            className={`${inputClass(!!errors.birthtime)} tabular-nums disabled:opacity-50`}
          />
          <span className="w-24 shrink-0 text-center text-sm" aria-live="polite">
            {slot ? (
              <>
                <span className="font-hanja text-lg text-vermilion">{slot.hanja}時</span>
                <span className="block text-xs text-ink-faint">{slot.branch}시 · {slot.animal}</span>
              </>
            ) : (
              <span className="text-ink-faint">–</span>
            )}
          </span>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
          <Check
            checked={timeUnknown}
            onChange={(v) => {
              setTimeUnknown(v);
              clearError("birthtime");
            }}
            label="시간 모름"
          />
          <Check
            checked={midnightAdjust}
            onChange={setMidnightAdjust}
            label="야자시 적용"
            hint="23시대 출생을 다음 날이 아닌 당일로 봅니다"
          />
          <button
            type="button"
            onClick={() => setShowHours((v) => !v)}
            aria-expanded={showHours}
            className="ml-auto text-ink-soft underline decoration-line-strong underline-offset-4 hover:text-ink"
          >
            12간지 시간표 {showHours ? "닫기" : "보기"}
          </button>
        </div>

        {showHours && (
          <div className="mt-3 grid grid-cols-3 gap-1.5 sm:grid-cols-4">
            {HOUR_TABLE.map((h) => {
              const active = slot?.branch === h.branch;
              return (
                <div
                  key={h.branch}
                  className={`rounded-sm border px-2 py-1.5 text-center text-xs ${
                    active ? "border-vermilion bg-vermilion-soft" : "border-line"
                  }`}
                >
                  <span className={`font-hanja text-base ${active ? "text-vermilion" : ""}`}>{h.hanja}</span>{" "}
                  {h.branch}시
                  <span className="block tabular-nums text-ink-faint">{h.label}</span>
                </div>
              );
            })}
            <p className="col-span-full mt-1 text-xs leading-relaxed text-ink-faint">
              한국 표준시 기준 근사값입니다. 실제 시(時)의 경계는 태어난 도시의 경도로 보정합니다.
            </p>
          </div>
        )}
      </Field>

      <Field label="태어난 도시" hanja="地" htmlFor="city">
        <select
          id="city"
          value={cityName}
          onChange={(e) => setCityName(e.target.value)}
          className={`${inputClass(false)} appearance-none bg-[length:12px] bg-[right_14px_center] bg-no-repeat pr-9`}
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' fill='none' stroke='%238c8377' stroke-width='1.5'/%3E%3C/svg%3E\")",
          }}
        >
          {["대한민국", "해외"].map((group) => (
            <optgroup key={group} label={group}>
              {CITIES.filter((c) => (group === "대한민국" ? c.country === "대한민국" : c.country !== "대한민국")).map(
                (c) => (
                  <option key={c.name} value={c.name}>
                    {c.name}
                    {c.country !== "대한민국" ? `, ${c.country}` : ""}
                  </option>
                ),
              )}
            </optgroup>
          ))}
        </select>
        <p className="mt-1.5 text-xs text-ink-faint">
          {correction !== null
            ? `지역시 보정 약 ${correction > 0 ? "+" : ""}${correction}분 (경도 ${city.lng}°)`
            : `현지 표준시(${city.timeZone}) 기준으로 계산합니다.`}{" "}
          · 모르면 서울특별시를 고르세요.
        </p>
      </Field>

      <button
        type="submit"
        className="group flex w-full items-center justify-center gap-2 rounded-sm bg-ink py-3.5 text-lg text-hanji transition-colors hover:bg-vermilion"
      >
        만세력 보기
        <span className="font-hanja text-sm opacity-70 group-hover:opacity-100">萬歲曆</span>
      </button>
    </form>
  );
}

function inputClass(invalid: boolean) {
  return `w-full rounded-sm border bg-paper px-3.5 py-2.5 text-base outline-none transition-colors placeholder:text-ink-faint focus:border-ink focus:ring-2 focus:ring-ink/10 ${
    invalid ? "border-vermilion" : "border-line-strong"
  }`;
}

function Field({
  label,
  hanja,
  htmlFor,
  error,
  children,
}: {
  label: string;
  hanja: string;
  htmlFor?: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid gap-x-4 gap-y-2 sm:grid-cols-[112px_1fr]">
      <label htmlFor={htmlFor} className="flex items-center gap-2 pt-2 sm:items-start">
        <span className="grid h-6 w-6 place-items-center rounded-[3px] border border-vermilion/60 font-hanja text-xs text-vermilion">
          {hanja}
        </span>
        <span className="font-bold">{label}</span>
      </label>
      <div>
        {children}
        {error && (
          <p role="alert" className="mt-1.5 text-sm text-vermilion">
            {error}
          </p>
        )}
      </div>
    </div>
  );
}

function Segmented({
  name,
  value,
  onChange,
  options,
}: {
  name: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string; mark?: string }[];
}) {
  return (
    <div role="radiogroup" aria-label={name} className="flex rounded-sm border border-line-strong p-0.5">
      {options.map((o) => {
        const selected = o.value === value;
        return (
          <button
            key={o.value}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => onChange(o.value)}
            className={`flex flex-1 items-center justify-center gap-1.5 rounded-[2px] py-2 text-[15px] transition-colors ${
              selected ? "bg-ink text-hanji" : "text-ink-soft hover:bg-hanji-deep hover:text-ink"
            }`}
          >
            {o.mark && <span className="font-hanja text-xs opacity-70">{o.mark}</span>}
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

function Check({
  checked,
  onChange,
  label,
  hint,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
  hint?: string;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-2" title={hint}>
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="peer sr-only" />
      <span className="grid h-[18px] w-[18px] place-items-center rounded-[3px] border border-line-strong text-[11px] text-hanji peer-checked:border-vermilion peer-checked:bg-vermilion peer-focus-visible:ring-2 peer-focus-visible:ring-ink/20">
        {checked && "✓"}
      </span>
      {label}
    </label>
  );
}
