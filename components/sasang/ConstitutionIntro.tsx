import { CONSTITUTIONS, CONTENT_VERSION, OVERVIEW, PENDING_TOPICS, SOURCES } from "@/data/sasang/constitutions";
import type { ContentItem } from "@/types/sasang";

interface Props {
  headingRef: React.RefObject<HTMLHeadingElement | null>;
  onNext: () => void;
  onSkip: () => void;
}

/** 출처 확인 여부를 글자와 기호로 함께 표시한다 (색만으로 구분하지 않음) */
function ItemMeta({ item }: { item: ContentItem }) {
  const source = item.sourceId ? SOURCES[item.sourceId] : undefined;
  if (item.review === "pending") {
    return (
      <p className="mt-1 text-xs text-ink-soft">
        <span className="rounded-sm border border-dashed border-ink-faint px-1 py-px">△ 검토 대기</span> {item.note}
      </p>
    );
  }
  return (
    <p className="mt-1 text-xs text-ink-faint">
      <span className="text-ink-soft">○ 출처 확인</span> · {source?.publisher} 「{source?.title}」 · 확인 {source?.checkedAt}
      {item.note && <span> · {item.note}</span>}
    </p>
  );
}

function ItemText({ item }: { item: ContentItem }) {
  return item.kind === "quote" ? (
    <blockquote className="border-l-2 border-line-strong pl-2.5 leading-relaxed">“{item.text}”</blockquote>
  ) : (
    <p className="leading-relaxed">{item.text}</p>
  );
}

export function ConstitutionIntro({ headingRef, onNext, onSkip }: Props) {
  return (
    <section aria-labelledby="sasang-intro-title">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-sm text-vermilion">
            <span className="font-hanja">四象</span> · 전통 개념 소개
          </p>
          <h2 id="sasang-intro-title" ref={headingRef} tabIndex={-1} className="scroll-mt-40 mt-1 text-2xl font-bold outline-none">
            사상체질이란
          </h2>
        </div>
        <button
          type="button"
          onClick={onSkip}
          className="rounded-sm px-2 py-1 text-sm text-ink-soft underline decoration-line-strong underline-offset-4 hover:text-ink"
        >
          소개 건너뛰고 질문으로
        </button>
      </div>

      <p className="mt-3 rounded-sm border border-line-strong bg-paper px-4 py-3 text-sm leading-relaxed">
        아래는 조선 후기 이제마가 정리한 <b>전통 의학 개념을 소개</b>하는 내용입니다. 이 서비스는 출생 정보나 응답으로 체질을
        판정하지 않으며, 사주의 오행과 사상체질을 서로 연결하지 않습니다. 체질에 대한 판단은 한의사의 진료가 필요합니다.
      </p>

      <dl className="mt-5 space-y-3 text-[15px]">
        {OVERVIEW.map((item) => (
          <div key={item.label}>
            <dt className="text-sm font-bold">{item.label}</dt>
            <dd className="mt-1">
              <ItemText item={item} />
              <ItemMeta item={item} />
            </dd>
          </div>
        ))}
      </dl>

      <ul className="mt-6 grid gap-3 sm:grid-cols-2">
        {CONSTITUTIONS.map((c) => (
          <li key={c.id} className="rounded-sm border border-line-strong bg-paper p-1">
            <article className="h-full rounded-[1px] border border-line px-4 py-4">
              <h3 className="flex items-baseline gap-2 text-lg font-bold">
                {c.name}
                <span className="font-hanja text-sm font-normal text-ink-soft">{c.hanja}</span>
              </h3>
              <dl className="mt-3 space-y-3 text-sm">
                {c.items.map((item) => (
                  <div key={item.label}>
                    <dt className="text-xs font-bold text-ink-soft">{item.label}</dt>
                    <dd className="mt-0.5">
                      <ItemText item={item} />
                      <ItemMeta item={item} />
                    </dd>
                  </div>
                ))}
              </dl>
            </article>
          </li>
        ))}
      </ul>

      <div className="mt-6 rounded-sm border border-dashed border-ink-faint px-4 py-3">
        <h3 className="text-sm font-bold">△ 검토 대기 · 싣지 않은 내용</h3>
        <ul className="mt-2 space-y-1.5 text-sm text-ink-soft">
          {PENDING_TOPICS.map((p) => (
            <li key={p.topic}>
              <b className="text-ink">{p.topic}</b> — {p.reason}
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-4 text-xs leading-relaxed text-ink-faint">
        <p className="font-bold text-ink-soft">출처</p>
        <ul className="mt-1 space-y-1">
          {Object.values(SOURCES).map((s) => (
            <li key={s.id}>
              {s.publisher}, 「{s.title}」{s.author && ` (집필 ${s.author})`}
              {s.sourceUpdatedAt && `, 최종수정 ${s.sourceUpdatedAt}`}.{" "}
              <a href={s.url} target="_blank" rel="noopener noreferrer" className="break-all underline underline-offset-2">
                {s.url}
              </a>{" "}
              · 내용 확인 {s.checkedAt}
            </li>
          ))}
        </ul>
        <p className="mt-1">콘텐츠 버전 {CONTENT_VERSION} · 한의학 전문가 검토 전</p>
      </div>

      <div className="mt-8 flex flex-col gap-2 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={onNext}
          className="min-h-12 rounded-sm bg-ink px-6 text-hanji transition-colors hover:bg-vermilion"
        >
          생활 질문으로
        </button>
      </div>
    </section>
  );
}
