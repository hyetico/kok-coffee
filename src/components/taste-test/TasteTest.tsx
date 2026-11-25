"use client";

import { useRef, useState, type KeyboardEvent } from "react";
import { ProductCard } from "@/components/product/ProductCard";
import { Button } from "@/components/ui/Button";
import { tasteTest } from "@/content/tasteTest";
import {
  DECAF_ANSWER,
  TOOL_QUESTION_INDEX,
  tasteQuestions,
} from "@/data/taste-questions";
import { recommend } from "@/lib/recommend";
import { pinFromAnswers } from "@/lib/taste";
import { useTasteStore } from "@/store/taste";

const TOTAL = tasteQuestions.length;
/** 0: 시작 · 1–5: 질문 · 6: 결과 */
type Step = number;
const NO_TOOL_OPTION = tasteQuestions[TOOL_QUESTION_INDEX].options.length - 1;

/**
 * 취향 테스트 — 시작 → 질문 5개(진행률) → 추천 원두 3개 + 분쇄 안내.
 * 답은 이 화면 안에서만 기억한다(새로 고침하면 처음부터).
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
  const heading = "m-0 font-bold outline-none";

  if (step === 0)
    return (
      <section
        aria-labelledby="test-title"
        className="mt-12 rounded-xl bg-hero p-[clamp(32px,6vw,64px)]"
      >
        <p className="m-0 text-sm font-bold">{t.intro.eyebrow}</p>
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
        <p className="mt-4 mb-0 text-base leading-[1.7]">{t.intro.desc}</p>
        <Button kind="primary" size="lg" className="mt-8" onClick={() => go(1)}>
          {t.intro.start}
        </Button>
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
      <section aria-labelledby="test-q" className="mt-12">
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
          className="mt-2 h-1.5 overflow-hidden rounded-full bg-line-soft"
        >
          <div
            className="h-full bg-primary"
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
                className={`min-h-22 cursor-pointer rounded-lg px-5 py-4.5 text-left text-ink ${
                  on
                    ? "border-2 border-primary bg-answer-on"
                    : "border border-line bg-bg hover:border-ink"
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
  const { top, words } = recommend(done);
  const toolAnswer = done[TOOL_QUESTION_INDEX];
  const tool = tasteQuestions[TOOL_QUESTION_INDEX].options[toolAnswer].label;
  const desc =
    (toolAnswer === NO_TOOL_OPTION
      ? t.result.noToolDesc
      : t.result.toolDesc(tool)) +
    (done[DECAF_ANSWER.question] === DECAF_ANSWER.option
      ? t.result.decafDesc
      : "");

  return (
    <section aria-labelledby="test-r" className="mt-12">
      <p className="m-0 text-sm font-bold text-primary">{t.result.eyebrow}</p>
      <h1
        id="test-r"
        ref={headingRef}
        tabIndex={-1}
        className={`${heading} mt-2 text-2xl leading-[1.35] sm:text-[28px] lg:text-[34px]`}
      >
        {t.result.title(words.map((w) => t.result.adjectives[w] ?? w))}
      </h1>
      <p className="mt-3 mb-0 text-base leading-[1.7] text-ink-2">{desc}</p>
      <ul className="m-0 mt-7 grid list-none grid-cols-1 gap-4 p-0 sm:grid-cols-3">
        {top.map((p, i) => (
          <li key={p.id}>
            <ProductCard product={p} badge={t.result.rank(i + 1)} />
          </li>
        ))}
      </ul>
      <div className="mt-8 flex flex-wrap gap-2">
        {top[0] && (
          <Button href={`/coffee/${top[0].id}`} kind="primary" size="lg">
            {t.result.goTop}
          </Button>
        )}
        <Button kind="secondary" size="lg" onClick={restart}>
          {t.result.again}
        </Button>
      </div>
    </section>
  );
}
