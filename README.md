# recruitMap

- 스택: Next.js 16 (App Router), React 19, Tailwind, TypeScript, Zustand
- Mock API: 서버 없이 `src/api`에서 localStorage로 저장. 호출마다 200–800ms 지연, 약 15% 실패.

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## 배포 주소

배포된 보드: [https://goeunleee.github.io/recruitMap/](https://goeunleee.github.io/recruitMap/)

1. 위 링크를 브라우저에서 연다.
2. 처음이면 레포 **Settings → Pages → Build and deployment → Source**를 **GitHub Actions**로 둔다.
3. **Actions** 탭에서 `Deploy` 워크플로가 성공(초록)인지 확인한 뒤 다시 연다.

`main`에 푸시하면 GitHub Actions가 다시 배포한다.

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
