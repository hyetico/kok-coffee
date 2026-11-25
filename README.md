This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## 알려진 점

Lighthouse 모바일(배포 주소, 3번 잰 중간값)에서 남은 감점과 그대로 둔 이유예요.

- 장바구니 SEO 66 — 장바구니 · 주문서 · 주문 완료는 개인 화면이라 robots.txt로 검색에서 일부러 뺐어요(`is-crawlable` 감점).
- 목록 「소개 글 없음」 — 소개 글은 들어 있지만, 주소 쿼리(종류)로 제목을 정하는 페이지라 Next.js가 메타 태그를 본문 뒤에 보내 Lighthouse가 못 읽어요. 검색 로봇에는 처음부터 넣어 보내요.
- 메인 맛 지도 점 간격(`target-size`) — 좁은 화면에서 맛이 비슷한 점끼리 가까워요. 같은 원두를 목록 · 검색에서도 고를 수 있어 WCAG 2.5.8 예외(같은 기능을 하는 다른 방법)에 해당해요.
