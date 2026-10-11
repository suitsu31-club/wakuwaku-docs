import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "wakuwaku",
  alternates: {
    languages: { en: "/en", ja: "/ja" },
  },
};

// A static export has no middleware, so the visitor's language is picked in the browser.
const pickLanguage = `location.replace(/^ja\\b/i.test(navigator.language) ? '/ja' : '/en');`;

export default function RedirectPage() {
  return (
    <>
      {/* biome-ignore lint/security/noDangerouslySetInnerHtml: constant inline redirect script */}
      <script dangerouslySetInnerHTML={{ __html: pickLanguage }} />
      <noscript>
        <meta httpEquiv="refresh" content="0; url=/en" />
      </noscript>
      <p style={{ fontFamily: "sans-serif", padding: "2rem" }}>
        <a href="/en">English</a> · <a href="/ja">日本語</a>
      </p>
    </>
  );
}
