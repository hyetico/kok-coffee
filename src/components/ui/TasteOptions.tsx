"use client";

type Option<K extends string> = { key: K; label: string };

type TasteOptionsProps<K extends string> = {
  /** 축 가운데 이름 — 「산미」 · 「바디」 */
  name: string;
  /** 축 양 끝 글 (왼쪽 · 오른쪽) */
  ends: readonly [string, string];
  /** 버튼 3칸 (왼쪽부터) */
  options: readonly [Option<K>, Option<K>, Option<K>];
  /** 켜진 칸. null이면 조건 없음 */
  value: K | null;
  onChange: (key: K | null) => void;
  /** 묶음 읽는 이름 — 「산미 (고소한에서 화사한 쪽), 하나만 고를 수 있어요」 */
  label: string;
};

/**
 * 맛 필터 한 줄 — 축 줄(「고소한 ←— 산미 —→ 화사한」) + 버튼 3개 (05 「맛 버튼 (산미 · 바디)」).
 * 한 줄에 하나만 켜진다: 다른 칸을 누르면 그 칸으로, 켜진 칸을 다시 누르면 꺼짐(= 조건 없음). 「전체」 버튼은 없다.
 * 여러 개를 함께 고르는 조건은 CheckList를 쓴다.
 * @example <TasteOptions name="산미" ends={["고소한", "화사한"]} options={acs} value={ac} onChange={setAc} label="산미 …" />
 */
export function TasteOptions<K extends string>({
  name,
  ends,
  options,
  value,
  onChange,
  label,
}: TasteOptionsProps<K>) {
  // 끝 글 칸은 버튼 한 칸 폭과 같다 — 양 끝 글 · 가운데 이름이 각각 버튼 3칸 가운데에 온다
  const end =
    "flex-none basis-[calc((100%-16px)/3)] text-center whitespace-nowrap";
  return (
    <>
      <div
        aria-hidden="true"
        className="mt-3 flex h-5 items-center text-xs text-muted"
      >
        <span className={end}>{ends[0]}</span>
        <i className="relative -mx-1 h-px flex-auto bg-check-line before:absolute before:top-[-3px] before:-left-px before:border-y-[3.5px] before:border-r-[5px] before:border-y-transparent before:border-r-check-line before:content-[''] after:absolute after:top-[-3px] after:-right-px after:border-y-[3.5px] after:border-l-[5px] after:border-y-transparent after:border-l-check-line after:content-['']">
          <b className="absolute top-1/2 left-1/2 -translate-1/2 bg-bg px-2 text-sm leading-5 font-semibold whitespace-nowrap text-ink not-italic">
            {name}
          </b>
        </i>
        <span className={end}>{ends[1]}</span>
      </div>
      <div
        role="group"
        aria-label={label}
        className="mt-2 grid grid-cols-3 gap-2"
      >
        {options.map((o) => {
          const on = value === o.key;
          return (
            <button
              key={o.key}
              type="button"
              aria-pressed={on}
              onClick={() => onChange(on ? null : o.key)}
              className="box-border flex h-9 min-w-0 cursor-pointer items-center justify-center rounded-lg border border-check-line bg-bg p-0 text-sm font-medium text-ink-2 hover:border-ink hover:text-ink aria-pressed:border-ink aria-pressed:bg-ink aria-pressed:text-white"
            >
              {o.label}
            </button>
          );
        })}
      </div>
    </>
  );
}
