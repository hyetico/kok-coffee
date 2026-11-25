"use client";

import {
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
} from "react";
import { ProductCard } from "@/components/product/ProductCard";
import { Button } from "@/components/ui/Button";
import { resultWord, tasteTest } from "@/content/tasteTest";
import { ui } from "@/content/ui";
import {
  DECAF_ANSWER,
  TOOL_QUESTION_INDEX,
  tasteQuestions,
} from "@/data/taste-questions";
import { mappedProducts } from "@/lib/catalog";
import { recommend } from "@/lib/recommend";
import { acidityBand, bodyBand, pinFromAnswers, toPos } from "@/lib/taste";
import { useTasteStore } from "@/store/taste";
import type { MapPosition } from "@/types";

const TOTAL = tasteQuestions.length;
/** 0: 시작 · 1–5: 질문 · 6: 결과 */
type Step = number;
const NO_TOOL_OPTION = tasteQuestions[TOOL_QUESTION_INDEX].options.length - 1;
/** 시작 화면 「내 취향은 어디?」 자리 — 보드 값 (지도 오른쪽 아래 화사 · 가벼운 쪽) */
const COVER_PIN: MapPosition = { x: 70, y: 64 };

const at = ({ x, y }: MapPosition): CSSProperties => ({
  left: `calc(var(--m) + (100% - 2 * var(--m)) * ${x / 100})`,
  top: `calc(var(--m) + (100% - 2 * var(--m)) * ${y / 100})`,
});

/**
 * 테스트 화면의 작은 맛 지도 (꾸밈 — 정보는 글에 있다). 시작 화면은 점선 원 + 「내 취향은 어디?」, 결과는 핀 + 추천 원두 진한 점.
 */
function TestMap({
  pin,
  picked = [],
  question,
}: {
  pin: MapPosition;
  picked?: string[];
  /** 시작 화면 — 핀 대신 숨쉬듯 커지는 점선 원 + 흰 말풍선 */
  question?: boolean;
}) {
  const lab = "absolute text-xs font-semibold text-muted";
  return (
    <div
      aria-hidden="true"
      className="relative aspect-square w-full max-w-100 rounded-2xl bg-bg shadow-[inset_0_0_0_1px_#e1e5e2] [--m:28px] max-lg:aspect-[16/10] max-lg:max-w-none"
    >
      <span className="absolute top-(--m) bottom-(--m) left-1/2 w-px bg-[#e1e5e2]" />
      <span className="absolute top-1/2 right-(--m) left-(--m) h-px bg-[#e1e5e2]" />
      <span className={`${lab} top-2 left-1/2 -translate-x-1/2`}>
        {ui.tasteMap.axes.heavy}
      </span>
      <span className={`${lab} bottom-2 left-1/2 -translate-x-1/2`}>
        {ui.tasteMap.axes.light}
      </span>
      <span className={`${lab} top-1/2 left-2 -translate-y-1/2`}>
        {ui.tasteMap.axes.nutty}
      </span>
      <span className={`${lab} top-1/2 right-2 -translate-y-1/2`}>
        {ui.tasteMap.axes.bright}
      </span>
      {mappedProducts().map((p) => {
        const on = picked.includes(p.id);
        return (
          <span
            key={p.id}
            style={at(toPos(p.taste))}
            className={`absolute rounded-full ${
              on
                ? "-mt-1.75 -ml-1.75 size-3.5 bg-primary"
                : "-mt-1.25 -ml-1.25 size-2.5 bg-map-dot-dim"
            }`}
          />
        );
      })}
      {question && (
        <span
          style={at(pin)}
          className="absolute -mt-7 -ml-7 box-border size-14 rounded-full border-[1.5px] border-dashed border-ink motion-safe:animate-[test-breathe_2.4s_ease-in-out_infinite]"
        />
      )}
      <span
        style={at(pin)}
        className="absolute flex -translate-x-1/2 -translate-y-full flex-col items-center"
      >
        <b
          className={`h-6 rounded-xl px-2 text-xs leading-6 font-bold whitespace-nowrap ${
            question
              ? "bg-bg text-ink shadow-[inset_0_0_0_1.5px_var(--color-ink)]"
              : "bg-ink text-white"
          }`}
        >
          {question ? tasteTest.intro.pinQuestion : tasteTest.result.pin}
        </b>
        <i className="h-2.5 w-0.5 bg-ink" />
        <s className="-mt-px size-2.5 rounded-full bg-bg shadow-[inset_0_0_0_3px_var(--color-ink)]" />
      </span>
    </div>
  );
}

/**
 * 취향 테스트 — 지도 모양 시작 화면 → 질문 5개(진행률 · 도움말) → 핀 구간 제목 · 결과 지도 · 핀과 가까운 원두 3개 (06 기술서 7장).
 * 「결과 보기」를 누르면 「내 취향」 핀을 저장해 목록 맛 지도에도 보인다. 답은 이 화면 안에서만 기억한다.
 * @example <TasteTest />
 */
export function TasteTest() {
  const [step, setStep] = useState<Step>(0);
  const [answers, setAnswers] = useState<(number | null)[]>(() =>
    Array(TOTAL).fill(null),
  );
  const headingRef = useRef<HTMLHeadingElement>(null);

  // 화면이 바뀌면 새 제목으로 초점을 옮겨 화면 낭독기가 바뀐 내용을 읽게 한다
  const go = (next: Step) => {
    setStep(next);
    requestAnimationFrame(() => headingRef.current?.focus());
  };
  const restart = () => {
    setAnswers(Array(TOTAL).fill(null));
    go(0);
  };

  const t = tasteTest;
  const heading = "m-0 font-bold outline-none [word-break:keep-all]";
  const lead = "text-base leading-[1.7] text-ink-2 [word-break:keep-all]";

  if (step === 0)
    return (
      <section
        aria-labelledby="test-title"
        className="mt-12 grid grid-cols-1 gap-y-6 rounded-[16px] bg-map-bg px-5 py-6 max-sm:mt-6 sm:p-8 lg:grid-cols-[minmax(0,1fr)_400px] lg:grid-rows-[auto_1fr] lg:items-center lg:gap-x-12 lg:gap-y-0 lg:p-12"
      >
        <div className="lg:self-end">
          <p className="m-0 text-sm font-bold text-ink-2">{t.intro.eyebrow}</p>
          <h1
            id="test-title"
            ref={headingRef}
            tabIndex={-1}
            className={`${heading} mt-3 text-[28px] leading-[1.3] sm:text-4xl lg:text-[44px]`}
          >
            {t.intro.titleLines[0]}
            <br />
            {t.intro.titleLines[1]}
          </h1>
          <p className={`mt-4 mb-0 ${lead}`}>{t.intro.desc}</p>
        </div>
        <div className="lg:col-start-2 lg:row-span-2 lg:row-start-1">
          <TestMap pin={COVER_PIN} question />
        </div>
        <div className="lg:mt-8 lg:self-start">
          <Button
            kind="primary"
            size="lg"
            className="max-sm:w-full"
            onClick={() => go(1)}
          >
            {t.intro.start}
          </Button>
        </div>
      </section>
    );

  if (step <= TOTAL) {
    const qi = step - 1;
    const q = tasteQuestions[qi];
    const current = answers[qi];
    const pick = (i: number) =>
      setAnswers((a) => a.map((v, j) => (j === qi ? i : v)));

    // 라디오 묶음: ↑/↓/←/→로 답을 옮기며 고른다 (WAI-ARIA 라디오 패턴)
    const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
      const dir =
        e.key === "ArrowDown" || e.key === "ArrowRight"
          ? 1
          : e.key === "ArrowUp" || e.key === "ArrowLeft"
            ? -1
            : 0;
      if (!dir) return;
      e.preventDefault();
      const n = q.options.length;
      const next = ((current ?? (dir > 0 ? -1 : 0)) + dir + n) % n;
      pick(next);
      e.currentTarget
        .querySelectorAll<HTMLButtonElement>("[role=radio]")
        [next]?.focus();
    };

    return (
      <section aria-labelledby="test-q" className="mx-auto mt-12 max-w-190">
        <div className="flex items-center justify-between text-sm text-muted">
          <span>{t.question.step(step, TOTAL)}</span>
          <Button kind="text" onClick={restart}>
            {t.question.restart}
          </Button>
        </div>
        <div
          role="progressbar"
          aria-label={t.question.progressLabel}
          aria-valuemin={0}
          aria-valuemax={TOTAL}
          aria-valuenow={step}
          className="mt-2 h-1.5 overflow-hidden rounded-[3px] bg-line-soft"
        >
          <div
            className="h-full bg-ink"
            style={{ width: `${(step / TOTAL) * 100}%` }}
          />
        </div>
        <h1
          id="test-q"
          ref={headingRef}
          tabIndex={-1}
          className={`${heading} mt-8 text-2xl leading-[1.35] sm:text-[28px] lg:text-[32px]`}
        >
          {q.q}
        </h1>
        <p className="mt-2 mb-0 text-sm text-muted">{t.question.help[qi]}</p>
        <div
          role="radiogroup"
          aria-labelledby="test-q"
          onKeyDown={onKeyDown}
          className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2"
        >
          {q.options.map((o, i) => {
            const on = current === i;
            return (
              <button
                key={o.label}
                type="button"
                role="radio"
                aria-checked={on}
                // 고른 답(없으면 첫 답)만 Tab 순서에 넣는다
                tabIndex={on || (current === null && i === 0) ? 0 : -1}
                onClick={() => pick(i)}
                className={`box-border min-h-22 cursor-pointer rounded-2xl text-left text-ink ${
                  on
                    ? "border-2 border-ink bg-map-bg px-5 py-4"
                    : "border border-line bg-bg p-5 hover:border-ink"
                }`}
              >
                <span className="block text-lg font-bold">{o.label}</span>
                {o.sub && (
                  <span className="mt-1 block text-sm text-muted">{o.sub}</span>
                )}
              </button>
            );
          })}
        </div>
        <div className="mt-8 flex justify-between gap-2">
          <Button kind="secondary" size="lg" onClick={() => go(step - 1)}>
            {t.question.prev}
          </Button>
          <Button
            kind="primary"
            size="lg"
            disabled={current === null}
            onClick={() => {
              // 「결과 보기」를 누르는 순간 「내 취향」 핀을 저장한다 — 목록 맛 지도에 핀 · 가까운 순이 생긴다 (06 기술서 7장)
              if (step === TOTAL)
                useTasteStore.getState().setPin(pinFromAnswers(answers));
              go(step + 1);
            }}
          >
            {step === TOTAL ? t.question.finish : t.question.next}
          </Button>
        </div>
      </section>
    );
  }

  const done = answers.map((a) => a ?? 0);
  const { top, pin } = recommend(done);
  const toolAnswer = done[TOOL_QUESTION_INDEX];
  const tool = tasteQuestions[TOOL_QUESTION_INDEX].options[toolAnswer].label;
  const desc =
    t.result.lead +
    (toolAnswer === NO_TOOL_OPTION
      ? t.result.noToolDesc
      : t.result.toolDesc(tool)) +
    (done[DECAF_ANSWER.question] === DECAF_ANSWER.option
      ? t.result.decafDesc
      : "");

  return (
    <section aria-labelledby="test-r" className="mt-12">
      <div className="grid grid-cols-1 items-center gap-6 lg:grid-cols-[minmax(0,1fr)_280px] lg:gap-10">
        <div>
          <p className="m-0 text-sm font-bold text-ink-2">{t.result.eyebrow}</p>
          <h1
            id="test-r"
            ref={headingRef}
            tabIndex={-1}
            className={`${heading} mt-2 text-2xl leading-[1.35] sm:text-[28px] lg:text-[34px]`}
          >
            {t.result.title(resultWord(acidityBand(pin), bodyBand(pin)))}
          </h1>
          <p className={`mt-3 mb-0 ${lead}`}>{desc}</p>
        </div>
        <TestMap pin={pin} picked={top.map((p) => p.id)} />
      </div>
      <ul className="m-0 mt-8 grid list-none grid-cols-1 gap-4 p-0 sm:grid-cols-3">
        {top.map((p, i) => (
          <li key={p.id}>
            <ProductCard product={p} badge={t.result.rank(i + 1)} />
          </li>
        ))}
      </ul>
      <div className="mt-8 flex flex-wrap gap-2 max-sm:flex-col max-sm:items-stretch">
        {top[0] && (
          <Button href={`/coffee/${top[0].id}`} kind="primary" size="lg">
            {t.result.goTop}
          </Button>
        )}
        <Button href="/coffee" kind="secondary" size="lg">
          {t.result.goMap}
        </Button>
        <Button kind="text" size="lg" onClick={restart}>
          {t.result.again}
        </Button>
      </div>
    </section>
  );
}
