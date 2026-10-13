import { highlight } from "fumadocs-core/highlight";
import { CodeBlock, Pre } from "fumadocs-ui/components/codeblock";
import {
  ArrowRight,
  Boxes,
  Clock,
  Database,
  ExternalLink,
  Radio,
  Server,
  ShieldCheck,
} from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { i18n } from "@/lib/i18n";

const apiReference = "https://docs.rs/wakuwaku/latest/wakuwaku/";

const installCode = `[dependencies]
wakuwaku = { version = "1.0.0-rc2", features = ["iggy", "sqlx-pg", "redis"] }
tokio = { version = "1", features = ["macros", "rt-multi-thread", "signal"] }`;

const exampleCode = `use std::time::Duration;
use wakuwaku::deps::kanau::processor::Processor;
use wakuwaku::{CronJob, CronJobInterval, CronTick, ServiceBuilder, ServiceCreation};

#[derive(Clone)]
struct SessionStore;

struct ExpireSessions { store: SessionStore }

impl ServiceCreation for ExpireSessions {
    type Dep = SessionStore;
    fn create_service(store: SessionStore) -> Self { Self { store } }
}

impl Processor<CronTick> for ExpireSessions {
    type Output = ();
    type Error = std::convert::Infallible;
    async fn process(&self, _tick: CronTick) -> Result<(), Self::Error> {
        // Scan for expired sessions and delete them.
        Ok(())
    }
}

impl CronJob for ExpireSessions {
    const INTERVAL: CronJobInterval = CronJobInterval::AtLeast(Duration::from_secs(60));
}

#[tokio::main]
async fn main() {
    let (services, cron) = ServiceBuilder::new(SessionStore)
        .cron_job::<ExpireSessions, _>()
        .start();

    // Build gRPC servers and Iggy handlers from \`services\` the same way:
    // \`services.grpc_service::<XxxServer<_>, Impl, _>(XxxServer::new)\`,
    // \`services.iggy_consumer::<Handler, _, _>()\`, or from several
    // services at once with \`.compose_grpc_service(|s| ...)\`.
    let _ = services;

    tokio::signal::ctrl_c().await.ok();
    cron.shutdown().await;
}`;

/** Cargo features of the `wakuwaku` crate, from its README. */
const cargoFeatures = [
  { name: "grpc", default: true },
  { name: "proof", default: true },
  { name: "iggy", default: false },
  { name: "entity", default: false },
  { name: "sqlx-pg", default: false },
  { name: "sqlx-mysql", default: false },
  { name: "redis", default: false },
  { name: "meilisearch", default: false },
];

/** Static class strings per brand color, so Tailwind sees every class literally. */
const accents = {
  teal: "bg-waku-teal/20 border-waku-teal/60 dark:bg-waku-teal/10 dark:border-waku-teal/40",
  blue: "bg-waku-blue/30 border-waku-blue dark:bg-waku-blue/12 dark:border-waku-blue/40",
  indigo:
    "bg-waku-indigo/30 border-waku-indigo dark:bg-waku-indigo/12 dark:border-waku-indigo/40",
  purple:
    "bg-waku-purple/35 border-waku-purple dark:bg-waku-purple/12 dark:border-waku-purple/40",
  pink: "bg-waku-pink/35 border-waku-pink dark:bg-waku-pink/12 dark:border-waku-pink/40",
  yellow:
    "bg-waku-yellow/40 border-waku-yellow dark:bg-waku-yellow/12 dark:border-waku-yellow/40",
} as const;

const features = [
  {
    key: "registry",
    icon: Boxes,
    accent: accents.blue,
    href: "/docs/core/service-builder",
  },
  {
    key: "grpc",
    icon: Server,
    accent: accents.indigo,
    href: "/docs/services/grpc",
  },
  {
    key: "cron",
    icon: Clock,
    accent: accents.purple,
    href: "/docs/services/cron-jobs",
  },
  { key: "events", icon: Radio, accent: accents.pink, href: "/docs/events" },
  { key: "data", icon: Database, accent: accents.yellow, href: "/docs/data" },
  {
    key: "validation",
    icon: ShieldCheck,
    accent: accents.teal,
    href: "/docs/validation",
  },
] as const;

const roadmapAccents = [
  accents.teal,
  accents.blue,
  accents.indigo,
  accents.pink,
];

type FeatureKey = (typeof features)[number]["key"];

type Text = {
  metaTitle: string;
  metaDescription: string;
  bannerAlt: string;
  tagline: string;
  intro: string;
  getStarted: string;
  documentation: string;
  apiReference: string;
  installTitle: string;
  installBody: ReactNode;
  defaultFeature: string;
  proofTitle: string;
  proofBody: string;
  macroTitle: string;
  macroBody: string;
  microTitle: string;
  microBody: string;
  proofLink: string;
  featuresTitle: string;
  featuresBody: string;
  feature: Record<FeatureKey, { title: string; tag: string; body: string }>;
  learnMore: string;
  exampleTitle: string;
  exampleBody: ReactNode;
  exampleLink: string;
  roadmapTitle: string;
  roadmapBody: string;
  roadmap: { version: string; label: string; body: string }[];
  roadmapLink: string;
  ctaTitle: string;
  ctaBody: string;
};

const text: Record<"en" | "ja", Text> = {
  en: {
    metaTitle: "wakuwaku: a proof-driven microservice framework for Rust",
    metaDescription:
      "wakuwaku builds gRPC servers, event handlers and cron jobs from a type-level registry of shared dependencies, with typed events on Apache Iggy, capability-typed data access and proof-carrying validation.",
    bannerAlt: "wakuwaku",
    tagline: "A proof-driven microservice framework for Rust",
    intro:
      "wakuwaku wires a service together. Every component (gRPC server, event handler, cron job) is built from a type-level registry of shared dependencies, and the crates that do the actual work are re-exported behind feature flags, so a service depends on wakuwaku alone.",
    getStarted: "Get started",
    documentation: "Documentation",
    apiReference: "API reference",
    installTitle: "One dependency",
    installBody: (
      <>
        Add <code>wakuwaku</code> and turn on the integrations you need.
        Third-party crates that appear in its APIs are re-exported under{" "}
        <code>wakuwaku::deps</code>.
      </>
    ),
    defaultFeature: "default",
    proofTitle: "Proof-driven programming",
    proofBody:
      "Correctness is split in two, and each half has its own kind of proof.",
    macroTitle: "Macro correctness",
    macroBody:
      "How components fit together is proven by traits and checked by the compiler. A component whose dependency was never registered, a write query run through a read-only handle, or a cron job with a zero interval does not build.",
    microTitle: "Micro correctness",
    microBody:
      "What one component does is proven by unit tests. Every component is a plain value implementing a Processor-based trait, so a test calls it directly, without starting the service.",
    proofLink: "Read about proof-driven design",
    featuresTitle: "What you build with",
    featuresBody:
      "The framework crate wires the components; each integration lives in its own crate, re-exported behind a feature flag.",
    feature: {
      registry: {
        title: "Type-level dependency registry",
        tag: "ServiceBuilder",
        body: "Shared dependencies live in a type-indexed registry. A component is built from one of them through ServiceCreation, or from several by a compose_* closure. Lookup is resolved by the trait solver: no Any, no downcasting, no runtime map.",
      },
      grpc: {
        title: "gRPC registration",
        tag: 'feature = "grpc"',
        body: "Build tonic servers from the registry and add them all to one router, in registration order, with no boxing and no dynamic dispatch.",
      },
      cron: {
        title: "Cron jobs",
        tag: "CronJob",
        body: "A job is a processor of CronTick with a constant CronJobInterval: a pause after each run, a minimum spacing between starts, or a fixed grid whose runs may overlap. Errors and panics are logged and the schedule is kept.",
      },
      events: {
        title: "Typed events on Apache Iggy",
        tag: "wakuwaku::iggy",
        body: "Events are ordered per key, not per partition. Ordering fences decide what may move past what, and algebra markers let a polled batch collapse or fold into fewer handler calls.",
      },
      data: {
        title: "Capability-typed data access",
        tag: "wakuwaku::entity",
        body: "A query declares the entities it reads and writes, and a Db handle must carry a capability that covers them. Data sources for sqlx (PostgreSQL, MySQL), Redis and Meilisearch.",
      },
      validation: {
        title: "Proof-carrying validation",
        tag: "wakuwaku::proof",
        body: 'prove hands back Proven<T, P>: the value together with evidence that the predicate held. Take Proven in signatures and "forgot to validate" becomes a type error.',
      },
    },
    learnMore: "Learn more",
    exampleTitle: "A service in one file",
    exampleBody: (
      <>
        A cron job built from a shared <code>SessionStore</code> that runs every
        minute. gRPC servers and Iggy event handlers are registered from the
        same <code>ServiceBuilder</code>.
      </>
    ),
    exampleLink: "Follow the quick start",
    roadmapTitle: "Roadmap",
    roadmapBody:
      "The goal is a framework as powerful and robust as Spring is for Java.",
    roadmap: [
      {
        version: "1.0.0-rc1",
        label: "Start",
        body: "The first release candidate.",
      },
      {
        version: "1.0.0-rc2",
        label: "Now",
        body: "The release candidate these docs describe.",
      },
      {
        version: "1.0.0",
        label: "Stable",
        body: "After end-to-end tests on real-world projects.",
      },
      {
        version: "2.0.0",
        label: "Spring parity",
        body: "Every meaningful Spring module has a wakuwaku counterpart.",
      },
    ],
    roadmapLink: "See the roadmap",
    ctaTitle: "Ready to build?",
    ctaBody: "Set up a project and run your first service in a few minutes.",
  },
  ja: {
    metaTitle: "wakuwaku: Rust のための証明駆動マイクロサービスフレームワーク",
    metaDescription:
      "wakuwaku は、共有依存の型レベルレジストリから gRPC サーバー・イベントハンドラー・cron ジョブを組み立てます。Apache Iggy 上の型付きイベント、ケイパビリティで型付けされたデータアクセス、証明付きバリデーションを備えています。",
    bannerAlt: "wakuwaku（ワクワク）",
    tagline: "Rust のための証明駆動マイクロサービスフレームワーク",
    intro:
      "wakuwaku はサービスを組み立てるフレームワークです。gRPC サーバー、イベントハンドラー、cron ジョブといったすべてのコンポーネントを共有依存の型レベルレジストリから構築します。実際の処理を担うクレートは feature フラグの裏で再エクスポートされるので、サービスが依存するのは wakuwaku ひとつだけです。",
    getStarted: "はじめる",
    documentation: "ドキュメント",
    apiReference: "API リファレンス",
    installTitle: "依存はひとつだけ",
    installBody: (
      <>
        <code>wakuwaku</code> を追加し、必要な連携機能を feature
        で有効にします。API に現れるサードパーティのクレートは{" "}
        <code>wakuwaku::deps</code> から再エクスポートされます。
      </>
    ),
    defaultFeature: "デフォルト",
    proofTitle: "証明駆動プログラミング",
    proofBody: "正しさを 2 つに分け、それぞれに適した方法で証明します。",
    macroTitle: "マクロな正しさ",
    macroBody:
      "コンポーネント同士の組み合わせ方はトレイトで証明し、コンパイラーが検査します。登録されていない依存を使うコンポーネント、読み取り専用ハンドルで実行する書き込みクエリ、間隔がゼロの cron ジョブは、どれもビルドが通りません。",
    microTitle: "ミクロな正しさ",
    microBody:
      "個々のコンポーネントの振る舞いはユニットテストで証明します。どのコンポーネントも Processor ベースのトレイトを実装したただの値なので、サービスを起動せずにテストから直接呼び出せます。",
    proofLink: "証明駆動の設計を読む",
    featuresTitle: "主な機能",
    featuresBody:
      "フレームワーク本体がコンポーネントを組み立て、各連携機能はそれぞれのクレートとして feature フラグの裏で再エクスポートされます。",
    feature: {
      registry: {
        title: "型レベルの依存レジストリ",
        tag: "ServiceBuilder",
        body: "共有依存は型でインデックスされたレジストリに置かれます。コンポーネントは ServiceCreation を通じてそのひとつから、または compose_* のクロージャで複数の依存から構築されます。参照はトレイトソルバーが解決するため、Any もダウンキャストも実行時のマップもありません。",
      },
      grpc: {
        title: "gRPC サーバーの登録",
        tag: 'feature = "grpc"',
        body: "レジストリから tonic のサーバーを構築し、登録順にひとつのルーターへまとめて追加します。Box 化も動的ディスパッチもありません。",
      },
      cron: {
        title: "cron ジョブ",
        tag: "CronJob",
        body: "ジョブは定数 CronJobInterval を持つ CronTick のプロセッサーです。実行後に間隔を空ける、開始の間隔を最低限空ける、実行が重なりうる固定のグリッド、のいずれかを選べます。エラーやパニックはログに記録され、スケジュールは保たれます。",
      },
      events: {
        title: "Apache Iggy 上の型付きイベント",
        tag: "wakuwaku::iggy",
        body: "順序はパーティション単位ではなくキー単位で保証されます。順序フェンスが追い越しの可否を決め、代数マーカーによってポーリングしたバッチを畳み込み、ハンドラー呼び出しを減らせます。",
      },
      data: {
        title: "ケイパビリティで型付けされたデータアクセス",
        tag: "wakuwaku::entity",
        body: "クエリは読み書きするエンティティを宣言し、Db ハンドルはそれを満たすケイパビリティを持たなければなりません。sqlx（PostgreSQL・MySQL）、Redis、Meilisearch のデータソースを提供します。",
      },
      validation: {
        title: "証明付きバリデーション",
        tag: "wakuwaku::proof",
        body: "prove は値と、述語が成り立った証拠を組にした Proven<T, P> を返します。シグネチャで Proven を受け取れば、「検証し忘れ」は型エラーになります。",
      },
    },
    learnMore: "詳しく見る",
    exampleTitle: "ひとつのファイルでサービスを",
    exampleBody: (
      <>
        共有の <code>SessionStore</code> から構築され、1 分ごとに実行される cron
        ジョブです。gRPC サーバーや Iggy のイベントハンドラーも同じ{" "}
        <code>ServiceBuilder</code> から登録します。
      </>
    ),
    exampleLink: "クイックスタートに進む",
    roadmapTitle: "ロードマップ",
    roadmapBody:
      "目指すのは、Java における Spring のように強力で堅牢なフレームワークです。",
    roadmap: [
      {
        version: "1.0.0-rc1",
        label: "出発点",
        body: "最初のリリース候補版です。",
      },
      {
        version: "1.0.0-rc2",
        label: "現在",
        body: "このドキュメントが対象とするリリース候補版です。",
      },
      {
        version: "1.0.0",
        label: "安定版",
        body: "実際のプロジェクトでの E2E テストを経てリリースします。",
      },
      {
        version: "2.0.0",
        label: "Spring と同等",
        body: "意味のある Spring モジュールすべてに wakuwaku の対応物がそろった段階です。",
      },
    ],
    roadmapLink: "ロードマップを見る",
    ctaTitle: "さっそく作ってみましょう",
    ctaBody: "プロジェクトを用意して、数分で最初のサービスを動かせます。",
  },
};

async function Code({
  code,
  lang,
  title,
}: {
  code: string;
  lang: string;
  title?: string;
}) {
  const rendered = await highlight(code, {
    lang,
    components: {
      pre: (props) => (
        <CodeBlock
          {...props}
          title={title}
          className={`${props.className ?? ""} my-0`}
          viewportProps={{ className: "max-h-none" }}
        >
          <Pre>{props.children}</Pre>
        </CodeBlock>
      ),
    },
  });
  return rendered;
}

const buttonBase =
  "inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition-colors";
const primaryButton = `${buttonBase} bg-fd-primary text-fd-primary-foreground hover:bg-fd-primary/85`;
const secondaryButton = `${buttonBase} border border-fd-border bg-fd-card hover:bg-fd-accent hover:text-fd-accent-foreground`;
const sectionTitle =
  "font-rounded text-3xl font-extrabold tracking-tight sm:text-4xl";

export default async function HomePage(props: PageProps<"/[lang]">) {
  const { lang } = await props.params;
  const t = lang === "ja" ? text.ja : text.en;

  return (
    <div className="flex flex-1 flex-col">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-fd-border">
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -top-32 left-[8%] size-80 rounded-full bg-waku-blue/30 blur-3xl" />
          <div className="absolute -top-20 right-[10%] size-72 rounded-full bg-waku-pink/30 blur-3xl" />
          <div className="absolute top-40 left-1/2 size-96 -translate-x-1/2 rounded-full bg-waku-purple/25 blur-3xl" />
        </div>
        <div className="mx-auto flex max-w-5xl flex-col items-center px-6 pt-14 pb-16 text-center sm:pt-20">
          <h1 className="w-full max-w-4xl">
            <Image
              src="/banner.svg"
              alt={t.bannerAlt}
              width={1853}
              height={600}
              priority
              unoptimized
              className="h-auto w-full select-none"
            />
          </h1>
          <p className="mt-8 font-rounded text-2xl font-extrabold tracking-tight text-balance sm:text-3xl">
            {t.tagline}
          </p>
          <p className="mt-4 max-w-2xl text-fd-muted-foreground text-pretty">
            {t.intro}
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              href={`/${lang}/docs/getting-started/quick-start`}
              className={primaryButton}
            >
              {t.getStarted}
              <ArrowRight className="size-4" />
            </Link>
            <Link href={`/${lang}/docs`} className={secondaryButton}>
              {t.documentation}
            </Link>
            <a
              href={apiReference}
              target="_blank"
              rel="noreferrer"
              className={secondaryButton}
            >
              {t.apiReference}
              <ExternalLink className="size-4" />
            </a>
          </div>
        </div>
      </section>

      {/* Install */}
      <section className="mx-auto w-full max-w-5xl px-6 py-16">
        <div className="grid gap-x-10 gap-y-5 md:grid-cols-2 md:items-end">
          <div>
            <h2 className={sectionTitle}>{t.installTitle}</h2>
            <p className="mt-3 text-fd-muted-foreground [&_code]:font-mono [&_code]:text-fd-foreground">
              {t.installBody}
            </p>
          </div>
          <ul className="flex flex-wrap gap-2 md:justify-end">
            {cargoFeatures.map((feature) => (
              <li
                key={feature.name}
                className={`rounded-full border px-3 py-1 font-mono text-xs ${
                  feature.default
                    ? "border-waku-teal/60 bg-waku-teal/15"
                    : "border-fd-border bg-fd-card"
                }`}
              >
                {feature.name}
                {feature.default && (
                  <span className="ml-1.5 font-sans text-fd-muted-foreground">
                    · {t.defaultFeature}
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>
        <div className="mt-6 min-w-0">
          <Code code={installCode} lang="toml" title="Cargo.toml" />
        </div>
      </section>

      {/* Proof-driven */}
      <section className="border-y border-fd-border bg-fd-card/50">
        <div className="mx-auto w-full max-w-5xl px-6 py-16">
          <h2 className={sectionTitle}>{t.proofTitle}</h2>
          <p className="mt-3 max-w-2xl text-fd-muted-foreground">
            {t.proofBody}
          </p>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <div className={`rounded-2xl border p-6 ${accents.indigo}`}>
              <h3 className="font-rounded text-xl font-extrabold">
                {t.macroTitle}
              </h3>
              <p className="mt-2 text-sm leading-relaxed">{t.macroBody}</p>
            </div>
            <div className={`rounded-2xl border p-6 ${accents.pink}`}>
              <h3 className="font-rounded text-xl font-extrabold">
                {t.microTitle}
              </h3>
              <p className="mt-2 text-sm leading-relaxed">{t.microBody}</p>
            </div>
          </div>
          <Link
            href={`/${lang}/docs/core/proof-driven`}
            className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-fd-primary hover:underline"
          >
            {t.proofLink}
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto w-full max-w-5xl px-6 py-16">
        <h2 className={sectionTitle}>{t.featuresTitle}</h2>
        <p className="mt-3 max-w-2xl text-fd-muted-foreground">
          {t.featuresBody}
        </p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map(({ key, icon: Icon, accent, href }) => {
            const feature = t.feature[key];
            return (
              <Link
                key={key}
                href={`/${lang}${href}`}
                className="group flex flex-col rounded-2xl border border-fd-border bg-fd-card p-5 transition-colors hover:border-fd-primary/50 hover:bg-fd-accent/60"
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`flex size-10 shrink-0 items-center justify-center rounded-xl border ${accent}`}
                  >
                    <Icon className="size-5" />
                  </span>
                  <h3 className="font-semibold leading-snug">
                    {feature.title}
                  </h3>
                </div>
                <code className="mt-4 self-start rounded-md bg-fd-muted px-1.5 py-0.5 font-mono text-xs text-fd-muted-foreground">
                  {feature.tag}
                </code>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-fd-muted-foreground">
                  {feature.body}
                </p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-fd-primary">
                  {t.learnMore}
                  <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Example */}
      <section className="border-y border-fd-border bg-fd-card/50">
        <div className="mx-auto w-full max-w-5xl px-6 py-16">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between md:gap-10">
            <div className="max-w-2xl">
              <h2 className={sectionTitle}>{t.exampleTitle}</h2>
              <p className="mt-3 text-fd-muted-foreground [&_code]:font-mono [&_code]:text-fd-foreground">
                {t.exampleBody}
              </p>
            </div>
            <Link
              href={`/${lang}/docs/getting-started/quick-start`}
              className="inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold text-fd-primary hover:underline"
            >
              {t.exampleLink}
              <ArrowRight className="size-4" />
            </Link>
          </div>
          <div className="mt-6 min-w-0">
            <Code code={exampleCode} lang="rust" title="src/main.rs" />
          </div>
        </div>
      </section>

      {/* Roadmap */}
      <section className="mx-auto w-full max-w-5xl px-6 py-16">
        <h2 className={sectionTitle}>{t.roadmapTitle}</h2>
        <p className="mt-3 max-w-2xl text-fd-muted-foreground">
          {t.roadmapBody}
        </p>
        <div className="relative mt-10">
          <div
            aria-hidden
            className="absolute top-5 right-[12%] left-[12%] hidden h-1 rounded-full bg-linear-to-r from-waku-teal via-waku-indigo to-waku-pink opacity-60 md:block"
          />
          <ol className="relative grid gap-6 md:grid-cols-4 md:gap-4">
            {t.roadmap.map((step, index) => (
              <li
                key={step.version}
                className="flex flex-col items-center text-center"
              >
                <span className="rounded-full bg-fd-background">
                  <span
                    className={`block rounded-full border-2 px-4 py-1.5 font-mono text-sm font-semibold ${roadmapAccents[index]}`}
                  >
                    {step.version}
                  </span>
                </span>
                <span className="mt-3 font-rounded text-lg font-extrabold">
                  {step.label}
                </span>
                <p className="mt-1 max-w-64 text-sm text-fd-muted-foreground">
                  {step.body}
                </p>
              </li>
            ))}
          </ol>
        </div>
        <div className="mt-8 text-center">
          <Link
            href={`/${lang}/docs/roadmap`}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-fd-primary hover:underline"
          >
            {t.roadmapLink}
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </section>

      {/* Call to action */}
      <section className="mx-auto w-full max-w-5xl px-6 pb-20">
        <div className="relative overflow-hidden rounded-3xl border border-fd-border bg-linear-to-br from-waku-blue/25 via-waku-purple/25 to-waku-pink/25 px-6 dark:from-waku-blue/10 dark:via-waku-purple/10 dark:to-waku-pink/10 py-12 text-center">
          <h2 className={sectionTitle}>{t.ctaTitle}</h2>
          <p className="mx-auto mt-3 max-w-xl text-fd-muted-foreground">
            {t.ctaBody}
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link
              href={`/${lang}/docs/getting-started/quick-start`}
              className={primaryButton}
            >
              {t.getStarted}
              <ArrowRight className="size-4" />
            </Link>
            <Link href={`/${lang}/docs`} className={secondaryButton}>
              {t.documentation}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export async function generateMetadata(
  props: PageProps<"/[lang]">,
): Promise<Metadata> {
  const { lang } = await props.params;
  const t = lang === "ja" ? text.ja : text.en;

  return {
    title: { absolute: t.metaTitle },
    description: t.metaDescription,
    alternates: {
      languages: Object.fromEntries(
        i18n.languages.map((language) => [language, `/${language}`]),
      ),
    },
  };
}
