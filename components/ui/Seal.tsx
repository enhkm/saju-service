interface Props {
  /** 한자 1~4글자. 4글자면 2x2로 새긴다 */
  text: string;
  size?: number;
  className?: string;
}

/** 낙관(도장) 모양 장식 */
export function Seal({ text, size = 40, className = "" }: Props) {
  const chars = [...text];
  const grid = chars.length === 4;
  return (
    <span
      aria-hidden
      className={`inline-grid shrink-0 place-items-center rounded-[6px] bg-vermilion font-hanja font-bold text-hanji ${className}`}
      style={{
        width: size,
        height: size,
        fontSize: grid ? size * 0.32 : size * (chars.length > 1 ? 0.4 : 0.58),
        lineHeight: 1,
        gridTemplateColumns: grid ? "1fr 1fr" : undefined,
        padding: size * 0.1,
        boxShadow: "inset 0 0 0 2px rgb(255 255 255 / 0.18)",
        transform: "rotate(-3deg)",
        // 도장을 찍은 듯한 거친 가장자리
        clipPath:
          "polygon(2% 4%, 30% 0%, 70% 2%, 98% 0%, 100% 35%, 97% 70%, 100% 97%, 65% 100%, 30% 98%, 0% 100%, 3% 65%, 0% 30%)",
      }}
    >
      {grid ? (
        // 도장은 오른쪽 위부터 세로로 읽는다
        [chars[2], chars[0], chars[3], chars[1]].map((c, i) => <span key={i}>{c}</span>)
      ) : (
        <span className={chars.length > 1 ? "writing-vertical" : ""}>{text}</span>
      )}
    </span>
  );
}
