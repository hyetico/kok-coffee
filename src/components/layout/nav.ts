import type { NavKey } from "@/content/ui";

/**
 * 지금 주소에 맞는 메뉴. 싱글오리진 · 블렌드는 같은 /coffee 주소라 type 쿼리로 가른다.
 * @example activeNavKey("/coffee", "single") // "single"
 */
export function activeNavKey(
  pathname: string,
  type: string | null,
): NavKey | null {
  if (pathname === "/") return "home";
  if (pathname === "/coffee")
    return type === "single" ? "single" : type === "blend" ? "blend" : "coffee";
  if (pathname.startsWith("/coffee/")) return "coffee";
  if (pathname.startsWith("/roasteries")) return "roasteries";
  if (pathname.startsWith("/taste-test")) return "taste-test";
  return null;
}
