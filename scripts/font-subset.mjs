// Pretendard 원본을 두 파일로 나눈다 (CLAUDE.md 8장). 글자가 새로 생기면 `npm run font:subset`을 다시 돌린다.
// ① pretendard-used.woff2 — 사이트에 실제로 쓰인 글자 (preload)
// ② pretendard-rest.woff2 — KS X 1001 한글 2,350자 + 영문 · 숫자 · 기호 (unicode-range로 필요할 때만 받음)
//    unicode-range는 src/app/fonts.ts에 구간으로 적는다. 이 목록(SYMBOLS)을 바꾸면 그쪽도 같이 고친다
import { readFile, readdir, writeFile } from "node:fs/promises";
import { extname, join } from "node:path";
import subsetFont from "subset-font";

const ROOT = new URL("..", import.meta.url).pathname;
const FONT_DIR = join(ROOT, "src/app/fonts");
const SOURCE = join(FONT_DIR, "PretendardVariable.woff2");
const CHARS_FILE = join(ROOT, "scripts/font-subset-chars.txt");
const SCAN_DIRS = ["src/content", "src/data", "src/app"];
const TEXT_EXT = new Set([
  ".ts",
  ".tsx",
  ".js",
  ".mjs",
  ".json",
  ".css",
  ".md",
]);

/** 화면 글이 들어 있는 파일만 훑는다. 폰트 · 이미지 같은 바이너리는 건너뛴다 */
async function collectFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true }).catch(() => []);
  const files = [];
  for (const e of entries) {
    const p = join(dir, e.name);
    if (e.isDirectory()) files.push(...(await collectFiles(p)));
    else if (TEXT_EXT.has(extname(e.name))) files.push(p);
  }
  return files;
}

/** 코드 글자를 Set으로. 줄바꿈 · 탭 같은 제어 문자만 뺀다 (보이는 공백은 아래에서 따로 넣는다) */
function toChars(text) {
  return [...text].filter((c) => !/[\s\p{Cc}]/u.test(c));
}

/** KS X 1001 완성형 한글 2,350자: EUC-KR 첫 바이트 0xB0–0xC8 × 둘째 바이트 0xA1–0xFE */
function ksHangul() {
  const decoder = new TextDecoder("euc-kr");
  const out = [];
  for (let lead = 0xb0; lead <= 0xc8; lead++)
    for (let trail = 0xa1; trail <= 0xfe; trail++)
      out.push(decoder.decode(Uint8Array.of(lead, trail)));
  if (out.length !== 2350 || out.some((c) => !/^\p{Script=Hangul}$/u.test(c)))
    throw new Error("KS X 1001 한글 2,350자를 만들지 못했어요");
  return out;
}

function range(from, to) {
  return Array.from({ length: to - from + 1 }, (_, i) =>
    String.fromCodePoint(from + i),
  );
}

// 영문 · 숫자 · 기호: 기본 라틴 · 라틴-1 보충 · 일반 문장부호 · ₩ · 화살표 · CJK 기호 · 한글 자모
const SYMBOLS = [
  ...range(0x20, 0x7e),
  ...range(0xa0, 0xff),
  ...range(0x2010, 0x2027),
  ...range(0x2030, 0x203a),
  "₩",
  ...range(0x2190, 0x2199),
  ...range(0x3001, 0x3011),
  ...range(0x3131, 0x318e),
];

const used = new Set();
for (const dir of SCAN_DIRS)
  for (const file of await collectFiles(join(ROOT, dir)))
    toChars(await readFile(file, "utf8")).forEach((c) => used.add(c));
// 코드에 아직 안 쓰였어도 화면에 늘 나오는 영문 · 숫자는 ①에 넣어 ②를 받지 않게 한다
// 공백(U+0020 · U+00A0)이 빠지면 띄어쓰기만 시스템 글꼴로 그려져 글줄이 넓어진다 — 반드시 넣는다
range(0x20, 0x7e).forEach((c) => used.add(c));
used.add("\u00a0");

const usedChars = [...used].sort();
await writeFile(CHARS_FILE, usedChars.join("") + "\n");

const restChars = [...new Set([...ksHangul(), ...SYMBOLS])].sort();
const source = await readFile(SOURCE);

for (const [name, chars] of [
  ["pretendard-used.woff2", usedChars],
  ["pretendard-rest.woff2", restChars],
]) {
  // variationAxes를 주지 않으면 wght 축이 그대로 남는다 (가변 폰트 유지)
  const out = await subsetFont(source, chars.join(""), {
    targetFormat: "woff2",
  });
  await writeFile(join(FONT_DIR, name), out);
  console.log(
    `${name}: ${chars.length}자 · ${(out.length / 1024).toFixed(1)}KB`,
  );
}
