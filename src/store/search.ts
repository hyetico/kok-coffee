"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

const MAX_RECENT = 6;

type SearchState = {
  recent: string[];
  /** 맨 앞에 넣고 같은 말은 하나만 남긴다 (최대 6개) */
  addRecent: (q: string) => void;
  removeRecent: (q: string) => void;
  clearRecent: () => void;
};

/**
 * 최근 검색어. localStorage에 남는다 (02 PRD 4장 「최근 검색어」).
 * @example useSearchStore.getState().addRecent("케냐")
 */
export const useSearchStore = create<SearchState>()(
  persist(
    (set) => ({
      recent: [],
      addRecent: (q) =>
        set(({ recent }) => {
          const k = q.trim();
          if (!k) return { recent };
          return {
            recent: [k, ...recent.filter((x) => x !== k)].slice(0, MAX_RECENT),
          };
        }),
      removeRecent: (q) =>
        set(({ recent }) => ({ recent: recent.filter((x) => x !== q) })),
      clearRecent: () => set({ recent: [] }),
    }),
    { name: "koke-recent-search" },
  ),
);
