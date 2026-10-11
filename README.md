# wakuwaku-docs

Source of [www.wakuwaku.rs](https://www.wakuwaku.rs), the usage guide for the
[wakuwaku](https://github.com/suitsu31-club/wakuwaku) microservice framework. The API reference
lives on [docs.rs](https://docs.rs/wakuwaku).

Built with [Fumadocs](https://fumadocs.dev) on Next.js as a static export (`out/`).

```bash
bun install
bun run dev          # http://localhost:3000
bun run build        # static export into out/
bun run types:check
bun run lint
```

## Layout

| Path                     | Contents                                                                 |
| ------------------------ | ------------------------------------------------------------------------ |
| `content/docs/`          | Pages. `foo.mdx` is English, `foo.ja.mdx` is Japanese; `meta.json` / `meta.ja.json` order the sidebar. |
| `app/[lang]/`            | Landing page, docs layout, OG images and per-page Markdown, per locale.  |
| `app/(redirect)/`        | `/` picks `/en` or `/ja` from the browser language (no middleware in a static export). |
| `components/diagrams/`   | Inline SVG diagrams used in MDX, e.g. `<OrderingDiagram lang="ja" />`.   |
| `lib/i18n.ts`            | Locales (`en`, `ja`).                                                    |
| `lib/layout.shared.tsx`  | Navigation and the Japanese UI translations.                             |
| `public/banner.svg`      | Landing page banner.                                                     |

## Writing pages

- Every page exists in both languages with the same headings, code and diagrams. Japanese headings
  that are link targets carry the English anchor, e.g. `## 隔離 [#quarantine]`.
- Internal links are absolute and include the locale: `/en/docs/core/service-builder`,
  `/ja/docs/core/service-builder`.
- Items of the `wakuwaku` crate link to `docs.rs/wakuwaku`; items of the sub-crates link to their own
  crates (`docs.rs/wakuwaku-entity`, `wakuwaku-iggy`, `wakuwaku-proof`), because docs.rs does not
  inline re-exported crates.
- Diagrams only use theme CSS variables (`--color-fd-*`, `--color-waku-*`), so they follow light and
  dark mode. Labels are kept in an `{ en, ja }` dictionary inside each component.
- Rust snippets are meant to compile against the current wakuwaku release; check new ones in a
  scratch crate before publishing.
