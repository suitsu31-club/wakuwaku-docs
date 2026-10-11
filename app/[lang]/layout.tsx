import { i18nProvider } from "fumadocs-ui/i18n";
import type { Metadata } from "next";
import { Inter, M_PLUS_Rounded_1c } from "next/font/google";
import { notFound } from "next/navigation";
import { Provider } from "@/components/provider";
import { i18n, isLocale } from "@/lib/i18n";
import { translations } from "@/lib/layout.shared";
import { siteUrl } from "@/lib/shared";
import "../global.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter-src",
});

const rounded = M_PLUS_Rounded_1c({
  weight: ["400", "700", "800"],
  subsets: ["latin"],
  variable: "--font-rounded-src",
  preload: false,
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    template: "%s | wakuwaku",
    default: "wakuwaku",
  },
  description: "A proof-driven microservice framework for Rust.",
};

export default async function Layout({
  params,
  children,
}: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  return (
    <html
      lang={lang}
      className={`${inter.variable} ${rounded.variable}`}
      suppressHydrationWarning
    >
      <body className="flex flex-col min-h-screen">
        <Provider i18n={i18nProvider(translations, lang)}>{children}</Provider>
      </body>
    </html>
  );
}

export function generateStaticParams() {
  return i18n.languages.map((lang) => ({ lang }));
}
