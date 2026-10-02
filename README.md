# Maison by MS Luxury

Static website with a white base with black typography and gold accents. No build step is required.

## Updated content

- Seven clickable collections and a rotating carousel covering all 61 supplied catalog presentations. Uses the supplied MS logo behind the landing section; old stock imagery removed.
- 61 catalog product presentations extracted from the supplied line card, with category filters, search, pagination and enlarged previews.
- Dedicated Corporate Gifting page linked from desktop and mobile navigation.
- SVG favicon, PNG fallback and Apple touch icon.
- Quote inquiries addressed to sarahi@msluxuryhomes.com, with selected products prefilled.
- No product pricing. Custom gifting minimum of 100 pieces.

## Quote delivery

By default the form prepares an email, then displays a link for the visitor to open and send it in their email app. It does not silently or automatically deliver email.

For automatic delivery, configure a form endpoint that accepts JSON and delivers inquiries to Sarahi. Add this before script.js on index.html:

```html
<script>window.MAISON_FORM_ENDPOINT = 'YOUR_VERIFIED_FORM_ENDPOINT';</script>
```

The UI confirms delivery only after a successful endpoint response. Test the configured service before launch. Do not put email-provider secrets into browser JavaScript.

## Publish the update

Replace the repository's site files with the contents of this folder and commit/push. Preserve the assets/catalog directory, products.js and corporate-gifting.html. For Vercel, use Framework Preset Other and no build command.

## Catalog editing

Product metadata is recorded in products.json and products.js. index.html contains matching static cards, so update all three if changing the catalog. Supplied branded photographs are customization examples, not endorsements.
