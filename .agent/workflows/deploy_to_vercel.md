---
description: Deploy the Next.js application to Vercel
---

# Deploying to Vercel

This guide outlines the steps to deploy your Windows 98-style blog to Vercel.

## Prerequisites

1.  A [GitHub](https://github.com) account.
2.  A [Vercel](https://vercel.com) account (linked to your GitHub).
3.  Your project code pushed to a GitHub repository.

## Step 1: Push Code to GitHub

Ensure all your recent changes (SEO fixes, Readme updates) are committed and pushed.

```powershell
git add .
git commit -m "Ready for deployment: SEO and Content updates"
git push origin main
```

## Step 2: Import Project in Vercel

1.  Log in to your **Vercel Dashboard**.
2.  Click **"Add New..."** -> **"Project"**.
3.  Find your `hg-blog` repository in the list and click **"Import"**.

## Step 3: Configure Project

Vercel will automatically detect that this is a **Next.js** project.

- **Framework Preset**: Next.js (Default)
- **Root Directory**: `./` (Default)
- **Build Command**: `next build` (Default)
- **Output Directory**: `.next` (Default)

### Environment Variables

Expand the **"Environment Variables"** section. You may need to add variables if you are using a custom domain, although Vercel handles the default one automatically.

For SEO purposes, strict URL canonicalization is recommended.

| Key                    | Value                                  | Description                                              |
| :--------------------- | :------------------------------------- | :------------------------------------------------------- |
| `NEXT_PUBLIC_SITE_URL` | `https://your-project-name.vercel.app` | (Optional) Explicitly set your production URL if needed. |

_Note: The `sitemap.ts` and `robots.ts` logic we added automatically falls back to `VERCEL_PROJECT_PRODUCTION_URL`, which Vercel provides, so you might not strictly need to set this unless you have a custom domain._

## Step 4: Deploy

1.  Click **"Deploy"**.
2.  Wait for the build to complete. Vercel will run `pnpm install` and `pnpm run build`.
3.  Once finished, you will see a "Congratulations!" screen with a screenshot of your site.

## Step 5: Verify Deployment

1.  Click on the generated domain (e.g., `https://hg-blog-sooty.vercel.app`).
2.  **Check SEO**: View page source to ensure `<meta property="og:..." />` tags are present.
3.  **Check Robots**: Go to `/robots.txt` and verify it allows indexing.
4.  **Check Sitemap**: Go to `/sitemap.xml` and verify it lists your pages.

---

**Troubleshooting:**

- If the build fails, check the "Logs" tab in Vercel for error messages.
- Common issues involve TypeScript errors or linting errors which halt the build. We have cleared most of these, but dependent packages can sometimes cause issues.
