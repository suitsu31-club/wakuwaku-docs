import { uiTranslations } from "fumadocs-ui/i18n";
import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared";
import Image from "next/image";
import { i18n } from "./i18n";
import { apiReferenceUrl, appName, gitConfig } from "./shared";

export const translations = i18n
  .translations()
  .extend(uiTranslations())
  .add({
    en: {
      displayName: "English",
    },
    ja: {
      displayName: "日本語",
      "Ask AI(AI chat button)": "AI に質問",
      "Back to Home(404 not found page)": "ホームに戻る",
      "Choose a language(language switcher)": "言語を選択",
      "Choose a language(language switcher)(aria-label)": "言語を選択",
      "Close Banner(banner)(aria-label)": "バナーを閉じる",
      "Close Search(search dialog)(aria-label)": "検索を閉じる",
      "Close Sidebar(aria-label)": "サイドバーを閉じる",
      "Close Sidebar(sidebar)(aria-label)": "サイドバーを閉じる",
      "Collapse Sidebar(sidebar)(aria-label)": "サイドバーを折りたたむ",
      "Copied Anchor Link(heading anchor)(aria-label)":
        "リンクをコピーしました",
      "Copied Link(accordion)(aria-label)": "リンクをコピーしました",
      "Copied Markdown(page actions)": "コピーしました",
      "Copied Text(code block)(aria-label)": "コピーしました",
      "Copy Anchor Link(heading anchor)(aria-label)": "リンクをコピー",
      "Copy Link(accordion)(aria-label)": "リンクをコピー",
      "Copy Markdown(page actions)": "Markdown をコピー",
      "Copy Text(code block)(aria-label)": "コードをコピー",
      "Dark(theme switcher)(aria-label)": "ダーク",
      "Default(type table)": "デフォルト",
      "Edit on GitHub(edit page)": "GitHub で編集",
      "Hide Sidebar(sidebar)": "サイドバーを隠す",
      "Language(language switcher)": "言語",
      "Last updated on(page footer)": "最終更新日",
      "Layout Tab(layout tab trigger)": "タブ",
      "Light(theme switcher)(aria-label)": "ライト",
      "Next Page(pagination)": "次のページ",
      "No Headings(table of contents)": "見出しがありません",
      "No results found(search dialog)": "見つかりませんでした",
      "On this page(table of contents)": "目次",
      "Open Search(search trigger)(aria-label)": "検索を開く",
      "Open Sidebar(aria-label)": "サイドバーを開く",
      "Open Sidebar(sidebar)(aria-label)": "サイドバーを開く",
      "Open in ChatGPT(page actions)": "ChatGPT で開く",
      "Open in Claude(page actions)": "Claude で開く",
      "Open in Cursor(page actions)": "Cursor で開く",
      "Open in GitHub(page actions)": "GitHub で開く",
      "Open in Scira AI(page actions)": "Scira AI で開く",
      "Open(page actions)": "開く",
      "Options(aria-label)": "オプション",
      "Page Not Found(404 not found page)": "ページが見つかりません",
      "Parameters(type table)": "パラメータ",
      "Previous Page(pagination)": "前のページ",
      "Prop(type table)": "名前",
      "Read {url}, I want to ask questions about it.(page actions)":
        "{url} を読んで、内容について質問に答えてください。",
      "Returns(type table)": "戻り値",
      "Search(search dialog)": "検索",
      "Search(search trigger)": "検索",
      "Show Sidebar(sidebar)": "サイドバーを表示",
      "System(theme switcher)(aria-label)": "システム",
      "Table of Contents(inline table of contents)": "目次",
      "The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.(404 not found page)":
        "お探しのページは削除されたか、名前が変更されたか、一時的に利用できない可能性があります。",
      "Theme(site menu)": "テーマ",
      "Toggle Menu(home layout header)(aria-label)": "メニューを切り替え",
      "Toggle Theme(theme switcher)(aria-label)": "テーマを切り替え",
      "Type(type table)": "型",
      "View as Markdown(page actions)": "Markdown で表示",
    },
  });

const navText = {
  en: { docs: "Documentation", api: "API Reference" },
  ja: { docs: "ドキュメント", api: "API リファレンス" },
} as const;

export function baseOptions(locale: string): BaseLayoutProps {
  const text = locale === "ja" ? navText.ja : navText.en;

  return {
    // `true` reads the locales from the provider; the config object itself holds functions
    // and can't cross into client components.
    i18n: true,
    nav: {
      title: (
        <>
          <Image src="/icon.svg" alt="" width={24} height={24} unoptimized />
          <span className="font-semibold tracking-tight">{appName}</span>
        </>
      ),
      url: `/${locale}`,
    },
    githubUrl: `https://github.com/${gitConfig.user}/${gitConfig.repo}`,
    links: [
      {
        text: text.docs,
        url: `/${locale}/docs`,
        active: "nested-url",
      },
      {
        text: text.api,
        url: apiReferenceUrl,
        external: true,
      },
    ],
  };
}
