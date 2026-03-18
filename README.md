# SEO Keyword Checker

A small Next.js app for checking exact keyword and phrase occurrences in pasted text.

## Features

- Paste text and a keyword list
- Split keywords by new lines, commas, or semicolons
- Case-insensitive exact phrase matching
- Count occurrences for each keyword
- Mark keywords as Found or Missing
- Sort missing keywords to the top

## Run locally

```bash
npm install
npm run dev
```

Then open `http://localhost:3000`.

## Deploy to Vercel

1. Create a new GitHub repository.
2. Upload these project files to the repository.
3. Sign in to Vercel with GitHub.
4. Click **Add New Project**.
5. Import the repository.
6. Keep the default Next.js settings.
7. Click **Deploy**.

## Notes

This version uses exact phrase matching only. It does not try to detect grammar variants or close phrase alternatives.
