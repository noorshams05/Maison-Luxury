# Maison by MS Luxury — Website

Static luxury website. Deploy on Vercel by importing this repository from GitHub.

## Structure

```
├── index.html      — all page content
├── styles.css      — gold & black theme, animations
├── script.js       — preloader, nav, parallax, reveals, quote form
└── assets/
    ├── hero.jpg        — hero background
    ├── suite.jpg       — "The World of Maison" section
    ├── throw.jpg       — collections card
    └── amenities.jpg   — collections card + white-label backdrop
```

## Quote form → email

Out of the box, submitting the quote form opens the visitor's email app with a
pre-filled message addressed to **sarahi@msluxuryhomes.com**. No backend needed.

To send requests server-side instead (recommended):

1. Create a free form at [formspree.io](https://formspree.io) pointed at sarahi@msluxuryhomes.com
2. In `script.js`, set `FORM_ENDPOINT` to your Formspree URL, e.g.
   `var FORM_ENDPOINT = 'https://formspree.io/f/your-id';`
3. Commit and push — Vercel redeploys automatically.

## Deploy on Vercel

1. Push this folder to a new GitHub repository.
2. In Vercel: **Add New → Project → Import** the repository.
3. Framework preset: **Other**. No build command needed.
4. Deploy.

## Notes

- No pricing anywhere on the site, per requirements.
- Recipient email lives in `script.js` (`TEAM_EMAIL`).
