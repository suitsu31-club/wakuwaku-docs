import { createGetUrl } from "fumadocs-core/source";

export const appName = "wakuwaku";
export const siteUrl = "https://www.wakuwaku.rs";
export const docsRoute = "/docs";
export const docsImageRoute = "/og/docs";
export const docsContentRoute = "/llms.mdx/docs";
export const apiReferenceUrl = "https://docs.rs/wakuwaku/latest/wakuwaku/";

export const gitConfig = {
  user: "suitsu31-club",
  repo: "wakuwaku",
  branch: "main",
};

/** Repository of this documentation site, used for "edit this page" links. */
export const docsGitConfig = {
  user: "suitsu31-club",
  repo: "wakuwaku-docs",
  branch: "main",
};

const getContentUrl = createGetUrl(docsContentRoute);

export function getPageMarkdownUrl(page: { slugs: string[]; locale?: string }) {
  const segments = [...page.slugs, "content.md"];

  return { segments, url: getContentUrl(segments, page.locale) };
}

const getImageUrl = createGetUrl(docsImageRoute);

export function getPageImageUrl(page: { slugs: string[]; locale?: string }) {
  const segments = [...page.slugs, "image.png"];

  return { segments, url: getImageUrl(segments, page.locale) };
}
