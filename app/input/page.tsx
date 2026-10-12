import type { Metadata } from "next";
import { ProfileForm } from "@/components/input/ProfileForm";
import { CloudDivider } from "@/components/ui/CloudDivider";
import { Seal } from "@/components/ui/Seal";

export const metadata: Metadata = { title: "생년월일시 입력 · 사주풀이" };

export default function InputPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 pb-16 pt-10">
      <header className="flex flex-col items-center text-center">
        <Seal text="生時" size={52} />
        <h1 className="mt-5 text-3xl font-bold sm:text-4xl">태어난 때를 알려 주세요</h1>
        <p className="mt-3 max-w-md leading-relaxed text-ink-soft">
          생년월일과 출생 시각, 태어난 도시로 사주 여덟 글자를 세웁니다. 시간을 모르면 세 기둥(여섯 글자)으로 풉니다.
        </p>
      </header>

      <CloudDivider className="my-8" />

      <div className="rounded-sm border border-line-strong bg-paper p-1.5">
        <div className="rounded-[1px] border border-line px-4 py-7 sm:px-8 sm:py-9">
          <ProfileForm />
        </div>
      </div>

      <p className="mt-5 text-center text-xs leading-relaxed text-ink-faint">
        입력한 정보는 이 브라우저 탭에만 임시로 보관되며 서버에 저장되지 않습니다.
      </p>
    </div>
  );
}
