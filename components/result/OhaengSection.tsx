import { ohaengBarColor } from "@/components/ui/GanjiTile";
import {
  OHAENG_HANJA,
  OHAENG_ORDER,
  SIPSEONG_GROUP,
  SIPSEONG_HANJA,
  STEMS,
  groupOf,
} from "@/lib/saju/constants";
import type { Ohaeng, OhaengStat, OhaengStatus, SipseongStat } from "@/types/saju";

interface Props {
  ohaeng: OhaengStat[];
  sipseong: SipseongStat[];
  dayMaster: Ohaeng;
  dayStem: string;
}

const STATUS_STYLE: Record<OhaengStatus, string> = {
  과다: "border-vermilion bg-vermilion text-hanji",
  발달: "border-gold text-gold",
  적정: "border-line-strong text-ink-soft",
  부족: "border-dashed border-ink-faint text-ink-faint",
};

const OHAENG_VAR: Record<Ohaeng, string> = { 목: "wood", 화: "fire", 토: "earth", 금: "metal", 수: "water" };

export function OhaengSection({ ohaeng, sipseong, dayMaster, dayStem }: Props) {
  const top = [...ohaeng].sort((a, b) => b.percent - a.percent)[0];
  const topSipseong = [...sipseong].sort((a, b) => (b.percent ?? 0) - (a.percent ?? 0))[0];

  return (
    <div className="space-y-7">
      <div className="grid items-center gap-6 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <CycleDiagram ohaeng={ohaeng} dayMaster={dayMaster} dayStem={dayStem} />

        <div>
          <p className="mb-3 text-sm text-ink-soft">
            가장 강한 기운은{" "}
            <b className="text-ink">
              {top.ohaeng}
              <span className="font-hanja">{OHAENG_HANJA[top.ohaeng]}</span>
            </b>
            , 가장 많은 십성은{" "}
            <b className="text-ink">
              {topSipseong.sipseong}
              <span className="font-hanja">{SIPSEONG_HANJA[topSipseong.sipseong]}</span>
            </b>
            입니다.
          </p>
          <ul className="space-y-2.5">
            {ohaeng.map((o) => (
              <li key={o.ohaeng} className="grid grid-cols-[52px_1fr_48px_42px] items-center gap-2 text-sm">
                <span>
                  {o.ohaeng} <span className="font-hanja text-ink-soft">{OHAENG_HANJA[o.ohaeng]}</span>
                </span>
                <span className="h-2.5 overflow-hidden rounded-full bg-hanji-deep">
                  <span
                    className="block h-full rounded-full"
                    style={{ width: `${o.percent}%`, backgroundColor: ohaengBarColor(o.ohaeng) }}
                  />
                </span>
                <span className="text-right tabular-nums">{o.percent}%</span>
                <span className={`rounded-sm border px-1 py-px text-center text-[11px] ${STATUS_STYLE[o.status]}`}>
                  {o.status}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div>
        <h3 className="mb-3 text-sm font-bold">십성 분포</h3>
        <ul className="grid gap-x-6 gap-y-2 sm:grid-cols-2">
          {sipseong.map((s) => {
            const group = SIPSEONG_GROUP[s.sipseong];
            const oh = OHAENG_ORDER.find((o) => groupOf(dayMaster, o) === group)!;
            return (
              <li key={s.sipseong} className="grid grid-cols-[88px_1fr_44px] items-center gap-2 text-sm">
                <span className={s.percent === null ? "text-ink-faint" : ""}>
                  {s.sipseong} <span className="font-hanja text-xs text-ink-faint">{SIPSEONG_HANJA[s.sipseong]}</span>
                </span>
                <span className="h-2 overflow-hidden rounded-full bg-hanji-deep">
                  <span
                    className="block h-full rounded-full"
                    style={{ width: `${s.percent ?? 0}%`, backgroundColor: ohaengBarColor(oh) }}
                  />
                </span>
                <span className="text-right tabular-nums text-ink-soft">{s.percent === null ? "–" : `${s.percent}%`}</span>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

/** 상생(바깥 화살표)·상극(안쪽 점선 별) 오각형 도식. 화를 맨 위에 두고 시계 방향이 상생 순서 */
function CycleDiagram({ ohaeng, dayMaster, dayStem }: Omit<Props, "sipseong">) {
  const W = 320;
  const H = 312;
  const cx = W / 2;
  const cy = 168;
  const R = 100;
  const startIdx = OHAENG_ORDER.indexOf("화");

  const nodes = OHAENG_ORDER.map((_, i) => {
    const o = OHAENG_ORDER[(startIdx + i) % 5];
    const angle = (-90 + i * 72) * (Math.PI / 180);
    const pct = ohaeng.find((x) => x.ohaeng === o)?.percent ?? 0;
    return { o, x: cx + R * Math.cos(angle), y: cy + R * Math.sin(angle), r: 22 + pct * 0.32, pct, angle };
  });

  /** 두 노드 원 가장자리 사이 선분 */
  const edge = (a: (typeof nodes)[number], b: (typeof nodes)[number], gap = 5) => {
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    const len = Math.hypot(dx, dy);
    const ux = dx / len;
    const uy = dy / len;
    return {
      x1: a.x + ux * (a.r + gap),
      y1: a.y + uy * (a.r + gap),
      x2: b.x - ux * (b.r + gap),
      y2: b.y - uy * (b.r + gap),
    };
  };

  const dayInfo = STEMS.find((s) => s.hangul === dayStem)!;

  return (
    <figure className="mx-auto w-full max-w-[340px]">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label="오행 상생상극 도식">
        <defs>
          <marker id="arrow-saeng" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
            <path d="M0 1 L9 5 L0 9 z" fill="var(--ink-soft)" />
          </marker>
          <marker id="arrow-geuk" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto">
            <path d="M0 1 L9 5 L0 9 z" fill="var(--vermilion)" opacity="0.55" />
          </marker>
        </defs>

        {/* 상극: 한 칸 건너 */}
        {nodes.map((n, i) => {
          const e = edge(n, nodes[(i + 2) % 5], 4);
          return (
            <line
              key={`g-${n.o}`}
              {...e}
              stroke="var(--vermilion)"
              strokeOpacity="0.4"
              strokeWidth="1"
              strokeDasharray="3 3"
              markerEnd="url(#arrow-geuk)"
            />
          );
        })}

        {/* 상생: 이웃 */}
        {nodes.map((n, i) => {
          const e = edge(n, nodes[(i + 1) % 5]);
          return (
            <line key={`s-${n.o}`} {...e} stroke="var(--ink-soft)" strokeWidth="1.3" markerEnd="url(#arrow-saeng)" />
          );
        })}

        {nodes.map((n) => {
          const isMe = n.o === dayMaster;
          const v = OHAENG_VAR[n.o];
          // 그룹 이름은 원 바깥쪽에
          const lx = cx + (R + n.r + 16) * Math.cos(n.angle);
          const ly = cy + (R + n.r + 16) * Math.sin(n.angle);
          return (
            <g key={n.o}>
              {isMe && <circle cx={n.x} cy={n.y} r={n.r + 5} fill="none" stroke="var(--vermilion)" strokeWidth="1.5" />}
              <circle
                cx={n.x}
                cy={n.y}
                r={n.r}
                fill={`var(--${v})`}
                stroke={n.o === "금" ? "var(--line-strong)" : "none"}
                opacity={n.pct === 0 ? 0.55 : 1}
              />
              <text
                x={n.x}
                y={n.y - 2}
                textAnchor="middle"
                fontSize="17"
                fontWeight="600"
                fill={`var(--${v}-ink)`}
                className="font-hanja"
              >
                {OHAENG_HANJA[n.o]}
              </text>
              <text x={n.x} y={n.y + 13} textAnchor="middle" fontSize="10.5" fill={`var(--${v}-ink)`} opacity="0.85">
                {n.pct}%
              </text>
              <text
                x={lx}
                y={ly + 4}
                textAnchor="middle"
                fontSize="11.5"
                fill={isMe ? "var(--vermilion)" : "var(--ink-soft)"}
                fontWeight={isMe ? 700 : 400}
              >
                {isMe ? "나" : groupOf(dayMaster, n.o)}
              </text>
            </g>
          );
        })}
      </svg>
      <figcaption className="mt-1 flex justify-center gap-4 text-xs text-ink-faint">
        <span>
          나의 오행: {dayInfo.hangul}
          {dayInfo.ohaeng} <span className="font-hanja">{dayInfo.hanja}</span>
        </span>
        <span className="flex items-center gap-1">
          <span className="h-px w-4 bg-ink-soft" /> 생
        </span>
        <span className="flex items-center gap-1">
          <span className="w-4 border-t border-dashed border-vermilion/60" /> 극
        </span>
      </figcaption>
    </figure>
  );
}
