import { Fragment } from "react";
import { site } from "@/content/site";
import { ui } from "@/content/ui";
import type { MenuItem } from "@/content/types";

function MenuList({ items, label }: { items: MenuItem[]; label?: string }) {
  return (
    <ul
      aria-label={label}
      className="m-0 flex list-none flex-wrap gap-x-6 gap-y-2 p-0 text-sm text-ink"
    >
      {/* 만들 페이지가 없는 메뉴는 링크 없는 글자로 둔다 (02 PRD 4장) */}
      {items.map((item) => (
        <li key={item.label}>{item.label}</li>
      ))}
    </ul>
  );
}

/** 사업자 정보 한 줄. 모바일에서는 항목마다 줄을 바꾸고 구분선을 숨긴다 */
function BusinessLine({
  items,
}: {
  items: readonly { label: string; value: string }[];
}) {
  return (
    <p className="m-0">
      {items.map((item, i) => (
        <Fragment key={item.label}>
          {i > 0 && (
            <span
              aria-hidden="true"
              className="mx-2.5 hidden h-2.5 w-px bg-footer-line align-[-1px] sm:inline-block"
            />
          )}
          <span className="block sm:inline">
            {item.label} {item.value}
          </span>
        </Fragment>
      ))}
    </p>
  );
}

type FooterProps = {
  /** 본문과 푸터 사이 위 여백(120). 본문이 스스로 아래 여백을 갖는 페이지(목록)는 false */
  spaced?: boolean;
};

/**
 * 모든 페이지 아래 푸터. 글은 모두 content/site.ts에서 온다. 페이지별 여백은 SiteFooter가 정한다.
 * @example <Footer spaced={false} />
 */
export function Footer({ spaced = true }: FooterProps) {
  return (
    <footer
      className={`${spaced ? "mt-30" : ""} border-t border-line bg-footer-bg text-sm leading-[1.7] text-muted`}
    >
      <div className="page-wrap">
        <div className="flex flex-wrap justify-between gap-8 border-b border-line-soft pt-12 pb-8">
          <div>
            <p className="m-0 text-base font-bold text-ink">
              {site.support.title}
            </p>
            <p className="mt-1.5 mb-0 text-[26px] font-bold tracking-[-0.01em] text-ink">
              {site.support.phone}
            </p>
            <p className="mt-1.5 mb-0">{site.support.hours}</p>
            <p className="m-0">{site.support.channels}</p>
          </div>
          <MenuList items={site.supportMenu} label={ui.footer.supportLabel} />
        </div>
        <div className="pt-7 pb-14">
          <MenuList items={site.policyMenu} />
          <div className="mt-4">
            {site.businessLines.map((line, i) => (
              <BusinessLine key={i} items={line} />
            ))}
          </div>
          <p className="mt-4 mb-0">{site.notice}</p>
        </div>
      </div>
    </footer>
  );
}
