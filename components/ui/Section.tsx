interface Props {
  title: string;
  /** 제목 옆 세로 한자 (예: "四柱") */
  hanja: string;
  description?: React.ReactNode;
  id?: string;
  children: React.ReactNode;
}

/** 이중 테두리 종이 카드 + 세로 한자 제목 */
export function Section({ title, hanja, description, id, children }: Props) {
  return (
    <section id={id} className="relative scroll-mt-28 rounded-sm border border-line-strong bg-paper p-1.5">
      <div className="rounded-[1px] border border-line px-4 pb-6 pt-5 sm:px-7 sm:pb-8 sm:pt-6">
        <header className="mb-5 flex items-start gap-3">
          <span className="writing-vertical mt-0.5 border-l border-vermilion pl-1.5 font-hanja text-sm tracking-[0.3em] text-vermilion">
            {hanja}
          </span>
          <div className="min-w-0">
            <h2 className="text-xl font-bold tracking-tight sm:text-[22px]">{title}</h2>
            {description && <p className="mt-1 text-sm leading-relaxed text-ink-soft">{description}</p>}
          </div>
        </header>
        {children}
      </div>
    </section>
  );
}
