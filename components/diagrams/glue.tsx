const text = {
  en: {
    title:
      "A full-stack framework owns the project and leaves slots for your code; in a wakuwaku service you use the libraries directly and wakuwaku only proves how they connect",
    framework: "FRAMEWORK-SHAPED",
    frameworkSub: "the framework is the project",
    slots: [
      "Router · controllers",
      "ORM (Ecto, Eloquent)",
      "Jobs · queues",
      "Directory layout",
    ],
    yourCode: "your code",
    library: "LIBRARY-SHAPED: WAKUWAKU",
    service: "Your service",
    serviceSub: "your layout, your main",
    libs: {
      axum: "HTTP routes",
      tonic: "gRPC",
      iggy: "event stream",
      sqlx: "PostgreSQL · MySQL",
      redis: "cache · lock · …",
      meili: "full-text search",
    },
    glue: "wakuwaku: proof-driven glue",
    frameworkMotto: "Your code fills the framework's slots.",
    libraryMotto: "You pick the libraries; wakuwaku proves the joints.",
    caption:
      "A full-stack framework such as Phoenix or Laravel defines the project and leaves slots for your code. wakuwaku leaves the project to you: you call axum, tonic, sqlx and the rest directly, and wakuwaku adds only the types that prove how they fit together.",
  },
  ja: {
    title:
      "フルスタックフレームワークはプロジェクトそのものを決め、コードを埋める枠を用意する。wakuwaku のサービスではライブラリを直接使い、wakuwaku はそのつなぎ方だけを証明する",
    framework: "フレームワークが形を決める",
    frameworkSub: "フレームワークがプロジェクトそのもの",
    slots: [
      "ルーター・コントローラー",
      "ORM (Ecto, Eloquent)",
      "ジョブ・キュー",
      "ディレクトリ構成",
    ],
    yourCode: "あなたのコード",
    library: "ライブラリを組み合わせる: WAKUWAKU",
    service: "あなたのサービス",
    serviceSub: "構成も main もあなたのもの",
    libs: {
      axum: "HTTP ルート",
      tonic: "gRPC",
      iggy: "イベントストリーム",
      sqlx: "PostgreSQL · MySQL",
      redis: "キャッシュ・ロック・…",
      meili: "全文検索",
    },
    glue: "wakuwaku: 証明でつなぐグルー",
    frameworkMotto: "あなたのコードがフレームワークの枠を埋める",
    libraryMotto: "ライブラリを選ぶのはあなた。継ぎ目は wakuwaku が証明する",
    caption:
      "Phoenix や Laravel のようなフルスタックフレームワークは、プロジェクトの形を決め、そこにコードを埋める枠を用意します。wakuwaku はプロジェクトの形をあなたに任せます。axum・tonic・sqlx などは直接呼び出し、wakuwaku はそれらの組み合わせ方を証明する型だけを加えます。",
  },
} as const;

const fg = "var(--color-fd-foreground)";
const muted = "var(--color-fd-muted-foreground)";
const border = "var(--color-fd-border)";
const card = "var(--color-fd-card)";
const mono = "var(--font-mono, ui-monospace, monospace)";
const framework = "var(--color-waku-indigo)";
const glue = "var(--color-waku-pink)";

/** Library boxes of the right-hand side: three above the glue, three below. */
const libs = [
  { name: "axum", key: "axum", col: 0, row: 0 },
  { name: "tonic", key: "tonic", col: 1, row: 0 },
  { name: "iggy", key: "iggy", col: 2, row: 0 },
  { name: "sqlx", key: "sqlx", col: 0, row: 1 },
  { name: "redis", key: "redis", col: 1, row: 1 },
  { name: "meilisearch-sdk", key: "meili", col: 2, row: 1 },
] as const;

const libW = 136;
const libH = 60;
const rowY = [108, 288];
const glueY = 200;
const glueH = 56;

export function GlueDiagram({ lang = "en" }: { lang?: "en" | "ja" }) {
  const t = text[lang];

  return (
    <figure className="waku-diagram">
      <svg viewBox="0 0 900 420" role="img" aria-labelledby="glue-title">
        <title id="glue-title">{t.title}</title>

        {/* Framework-shaped */}
        <text x={20} y={30} fontSize={13} fontWeight={600} fill={muted}>
          {t.framework}
        </text>
        <rect
          x={20}
          y={44}
          width={340}
          height={330}
          rx={10}
          fill={framework}
          fillOpacity={0.22}
          stroke={framework}
          strokeWidth={1.5}
        />
        <text
          x={190}
          y={72}
          fontSize={15}
          fontWeight={700}
          fill={fg}
          textAnchor="middle"
        >
          Phoenix · Laravel
        </text>
        <text x={190} y={92} fontSize={13} fill={muted} textAnchor="middle">
          {t.frameworkSub}
        </text>
        {t.slots.map((slot, i) => {
          const y = 108 + i * 64;
          return (
            <g key={slot}>
              <rect
                x={36}
                y={y}
                width={308}
                height={50}
                rx={8}
                fill={card}
                stroke={framework}
              />
              <text x={50} y={y + 30} fontSize={13} fill={fg}>
                {slot}
              </text>
              <rect
                x={236}
                y={y + 10}
                width={98}
                height={30}
                rx={6}
                fill="none"
                stroke={muted}
                strokeDasharray="4 3"
              />
              <text
                x={285}
                y={y + 30}
                fontSize={12}
                fill={muted}
                textAnchor="middle"
              >
                {t.yourCode}
              </text>
            </g>
          );
        })}
        <text x={190} y={402} fontSize={13} fill={muted} textAnchor="middle">
          {t.frameworkMotto}
        </text>

        {/* Library-shaped */}
        <text x={390} y={30} fontSize={13} fontWeight={600} fill={muted}>
          {t.library}
        </text>
        <rect
          x={390}
          y={44}
          width={490}
          height={330}
          rx={10}
          fill="none"
          stroke={border}
          strokeWidth={1.5}
          strokeDasharray="6 4"
        />
        <text
          x={635}
          y={72}
          fontSize={15}
          fontWeight={700}
          fill={fg}
          textAnchor="middle"
        >
          {t.service}
        </text>
        <text x={635} y={92} fontSize={13} fill={muted} textAnchor="middle">
          {t.serviceSub}
        </text>

        {libs.map((lib) => {
          // Three columns of `libW`, 21 apart, starting inside the dashed frame.
          const x = 410 + lib.col * 157;
          const y = rowY[lib.row];
          const cx = x + libW / 2;
          // The joint runs from the box edge that faces the glue.
          const [from, to] =
            lib.row === 0 ? [y + libH, glueY] : [glueY + glueH, y];
          return (
            <g key={lib.name}>
              <line
                x1={cx}
                y1={from}
                x2={cx}
                y2={to}
                stroke={glue}
                strokeWidth={2}
              />
              <circle cx={cx} cy={from} r={3.5} fill={glue} />
              <circle cx={cx} cy={to} r={3.5} fill={glue} />
              <rect
                x={x}
                y={y}
                width={libW}
                height={libH}
                rx={8}
                fill={card}
                stroke={border}
              />
              <text
                x={cx}
                y={y + 26}
                fontSize={14}
                fontWeight={700}
                fill={fg}
                textAnchor="middle"
                fontFamily={mono}
              >
                {lib.name}
              </text>
              <text
                x={cx}
                y={y + 46}
                fontSize={12}
                fill={muted}
                textAnchor="middle"
              >
                {t.libs[lib.key]}
              </text>
            </g>
          );
        })}

        <rect
          x={410}
          y={glueY}
          width={450}
          height={glueH}
          rx={8}
          fill={glue}
          fillOpacity={0.22}
          stroke={glue}
          strokeWidth={1.5}
        />
        <text
          x={635}
          y={glueY + 22}
          fontSize={14}
          fontWeight={700}
          fill={fg}
          textAnchor="middle"
        >
          {t.glue}
        </text>
        <text
          x={635}
          y={glueY + 42}
          fontSize={13}
          fill={fg}
          textAnchor="middle"
          fontFamily={mono}
        >
          ProvideAt · Covers&lt;Effect&gt; · Proven&lt;T, P&gt; · Algebra
        </text>
        <text x={635} y={402} fontSize={13} fill={muted} textAnchor="middle">
          {t.libraryMotto}
        </text>
      </svg>
      <figcaption>{t.caption}</figcaption>
    </figure>
  );
}
