const text = {
  en: {
    title:
      "Macro correctness, how components fit, is proven by traits and checked by the compiler; micro correctness, what one component does, is proven by unit tests",
    macro: "Macro correctness",
    macroSub: "How components fit together",
    macroHow: "Proven by traits, checked by the compiler",
    micro: "Micro correctness",
    microSub: "What one component does",
    microHow: "Proven by unit tests, no running service",
    errors: [
      "Dependency never registered",
      "Write through a read-only handle",
      "Cron job with a zero interval",
      "Input that was never validated",
    ],
    rejected: "Each of these fails to build.",
    input: "hand-built input",
    component: "the component, a plain value",
    check: "check the result",
    notNeeded: "not needed",
    notNeededList: "gRPC server · Iggy broker · cron runtime",
  },
  ja: {
    title:
      "マクロな正しさ (コンポーネントの組み合わせ方) はトレイトで証明されコンパイラが検査し、ミクロな正しさ (1 つのコンポーネントの動作) はユニットテストで証明する",
    macro: "マクロな正しさ",
    macroSub: "コンポーネントの組み合わせ方",
    macroHow: "トレイトで証明し、コンパイラが検査",
    micro: "ミクロな正しさ",
    microSub: "1 つのコンポーネントの動作",
    microHow: "ユニットテストで証明、サービスの起動は不要",
    errors: [
      "登録されていない依存",
      "読み取り専用ハンドルでの書き込み",
      "間隔がゼロの cron ジョブ",
      "検証されていない入力",
    ],
    rejected: "どれもビルドが通りません。",
    input: "手で組み立てた入力",
    component: "コンポーネント (ただの値)",
    check: "結果を検証",
    notNeeded: "不要",
    notNeededList: "gRPC サーバー · Iggy ブローカー · cron ランタイム",
  },
} as const;

const fg = "var(--color-fd-foreground)";
const muted = "var(--color-fd-muted-foreground)";
const border = "var(--color-fd-border)";
const card = "var(--color-fd-card)";
const mono = "var(--font-mono, ui-monospace, monospace)";
const error = "var(--color-fd-error)";
const success = "var(--color-fd-success)";

const errorCode = [
  "services.provide::<Mailer, _>()",
  "write query on Db<_, ReadOnly>",
  "const INTERVAL = Duration::ZERO;",
  "expected Proven<T, P>, found T",
];

const flow = [
  { code: "let tick = CronTick { run: 0, .. };", key: "input" },
  { code: "job.process(tick).await", key: "component" },
  { code: "assert_eq!(…)", key: "check" },
] as const;

/** A pill whose right edge sits at `right`. */
function Badge({
  right,
  y,
  label,
  tone,
}: {
  right: number;
  y: number;
  label: string;
  tone: "indigo" | "teal";
}) {
  const color = `var(--color-waku-${tone})`;
  const w = label.length * 8 + 24;
  const x = right - w;
  return (
    <g>
      <rect
        x={x}
        y={y - 15}
        width={w}
        height={22}
        rx={11}
        fill={color}
        fillOpacity={0.3}
        stroke={color}
      />
      <text
        x={x + w / 2}
        y={y}
        fontSize={13}
        fontFamily={mono}
        fontWeight={700}
        fill={fg}
        textAnchor="middle"
      >
        {label}
      </text>
    </g>
  );
}

export function CorrectnessDiagram({ lang = "en" }: { lang?: "en" | "ja" }) {
  const t = text[lang];
  const flowLabel = { input: t.input, component: t.component, check: t.check };

  return (
    <figure className="waku-diagram">
      <svg viewBox="0 0 900 430" role="img" aria-labelledby="correctness-title">
        <title id="correctness-title">{t.title}</title>
        <defs>
          <marker
            id="correctness-arrow"
            viewBox="0 0 10 10"
            refX={9}
            refY={5}
            markerWidth={7}
            markerHeight={7}
            orient="auto-start-reverse"
          >
            <path d="M0,0 L10,5 L0,10 z" fill={muted} />
          </marker>
        </defs>

        {/* Macro */}
        <rect
          x={20}
          y={20}
          width={440}
          height={390}
          rx={12}
          fill={card}
          stroke={border}
        />
        <rect
          x={20}
          y={20}
          width={440}
          height={390}
          rx={12}
          fill="var(--color-waku-indigo)"
          fillOpacity={0.18}
          stroke="var(--color-waku-indigo)"
          strokeWidth={1.5}
        />
        <text
          x={40}
          y={52}
          fontSize={19}
          fontWeight={700}
          fontFamily="inherit"
          fill={fg}
        >
          {t.macro}
        </text>
        <text x={40} y={75} fontSize={14} fontFamily="inherit" fill={muted}>
          {t.macroSub}
        </text>
        <text x={40} y={102} fontSize={13} fontFamily="inherit" fill={fg}>
          {t.macroHow}
        </text>
        <Badge right={444} y={52} label="cargo build" tone="indigo" />

        {t.errors.map((label, i) => {
          const y = 122 + i * 62;
          return (
            <g key={label}>
              <rect
                x={36}
                y={y}
                width={408}
                height={52}
                rx={8}
                fill={card}
                stroke={border}
              />
              <circle
                cx={58}
                cy={y + 26}
                r={10}
                fill="none"
                stroke={error}
                strokeWidth={2}
              />
              <path
                d={`M54,${y + 22} L62,${y + 30} M62,${y + 22} L54,${y + 30}`}
                stroke={error}
                strokeWidth={2}
              />
              <text
                x={78}
                y={y + 21}
                fontSize={14}
                fontFamily="inherit"
                fill={fg}
              >
                {label}
              </text>
              <text
                x={78}
                y={y + 41}
                fontSize={13}
                fontFamily={mono}
                fill={muted}
              >
                {errorCode[i]}
              </text>
            </g>
          );
        })}
        <text
          x={240}
          y={392}
          fontSize={13}
          fontFamily="inherit"
          fill={muted}
          textAnchor="middle"
        >
          {t.rejected}
        </text>

        {/* Micro */}
        <rect
          x={480}
          y={20}
          width={400}
          height={390}
          rx={12}
          fill={card}
          stroke={border}
        />
        <rect
          x={480}
          y={20}
          width={400}
          height={390}
          rx={12}
          fill="var(--color-waku-teal)"
          fillOpacity={0.18}
          stroke="var(--color-waku-teal)"
          strokeWidth={1.5}
        />
        <text
          x={500}
          y={52}
          fontSize={19}
          fontWeight={700}
          fontFamily="inherit"
          fill={fg}
        >
          {t.micro}
        </text>
        <text x={500} y={75} fontSize={14} fontFamily="inherit" fill={muted}>
          {t.microSub}
        </text>
        <text x={500} y={102} fontSize={13} fontFamily="inherit" fill={fg}>
          {t.microHow}
        </text>
        <Badge right={864} y={52} label="cargo test" tone="teal" />

        {flow.map((f, i) => {
          const y = 122 + i * 72;
          const highlighted = f.key === "component";
          return (
            <g key={f.key}>
              <rect
                x={496}
                y={y}
                width={368}
                height={52}
                rx={8}
                fill={card}
                stroke={highlighted ? "var(--color-waku-teal)" : border}
                strokeWidth={highlighted ? 2 : 1}
              />
              <text
                x={680}
                y={y + 21}
                fontSize={13}
                fontFamily={mono}
                fill={fg}
                textAnchor="middle"
              >
                {f.code}
              </text>
              <text
                x={680}
                y={y + 41}
                fontSize={13}
                fontFamily="inherit"
                fill={muted}
                textAnchor="middle"
              >
                {flowLabel[f.key]}
              </text>
              {i < flow.length - 1 && (
                <path
                  d={`M680,${y + 53} L680,${y + 70}`}
                  stroke={muted}
                  strokeWidth={1.5}
                  markerEnd="url(#correctness-arrow)"
                />
              )}
            </g>
          );
        })}
        <circle
          cx={520}
          cy={292}
          r={10}
          fill={card}
          stroke={success}
          strokeWidth={2}
        />
        <path
          d="M515,292 L519,296.5 L526,287.5"
          fill="none"
          stroke={success}
          strokeWidth={2}
        />

        <rect
          x={496}
          y={338}
          width={368}
          height={56}
          rx={8}
          fill="none"
          stroke={muted}
          strokeDasharray="4 3"
        />
        <text
          x={680}
          y={360}
          fontSize={13}
          fontWeight={600}
          fontFamily="inherit"
          fill={muted}
          textAnchor="middle"
        >
          {t.notNeeded}
        </text>
        <text
          x={680}
          y={381}
          fontSize={13}
          fontFamily="inherit"
          fill={muted}
          textAnchor="middle"
          textDecoration="line-through"
        >
          {t.notNeededList}
        </text>
      </svg>
    </figure>
  );
}
