import { CloseIcon } from "@/components/icons";

type RemovableChipProps = {
  label: string;
  /** 지우기 버튼의 읽는 이름 — 무엇을 지우는지 넣는다 ("케냐 최근 검색어 지우기") */
  removeLabel: string;
  onRemove: () => void;
  /** 글자를 누르면 할 일 (최근 검색어 다시 찾기). 없으면 글자만 보인다 */
  onPick?: () => void;
};

/**
 * 글자 + 원형 X가 붙은 칩. 최근 검색어 · 적용한 조건에 쓴다.
 * @example <RemovableChip label="케냐" removeLabel="케냐 최근 검색어 지우기" onRemove={rm} onPick={go} />
 */
export function RemovableChip({
  label,
  removeLabel,
  onRemove,
  onPick,
}: RemovableChipProps) {
  const text = "h-8.5 text-sm font-medium text-ink-2";
  return (
    <span className="flex h-9 items-center rounded-[18px] border border-line-control bg-bg pr-1 pl-4 hover:border-ink">
      {onPick ? (
        <button
          type="button"
          onClick={onPick}
          className={`${text} cursor-pointer`}
        >
          {label}
        </button>
      ) : (
        <span className={`${text} leading-8.5`}>{label}</span>
      )}
      <button
        type="button"
        aria-label={removeLabel}
        onClick={onRemove}
        className="ml-1 grid size-7 cursor-pointer place-items-center rounded-full text-subtle hover:bg-surface hover:text-ink"
      >
        <CloseIcon size={12} strokeWidth={2.4} />
      </button>
    </span>
  );
}
