const text = {
  en: {
    title:
      "ServiceBuilder as a type-level linked list: provide::<B, _>() is resolved at compile time to position There<Here>; a component is built either by cloning one dependency (ServiceCreation) or by a compose_* closure that borrows the whole builder",
    exA: "e.g. DB pool",
    exB: "e.g. Redis",
    exC: "e.g. Iggy client",
    end: "end of the list",
    newest: "most recent",
    oldest: "first registered",
    noMatch: "C ≠ B: step into that",
    solver1: "The trait solver walks the list at compile time and infers",
    solver2:
      "A type that was never registered has no ProvideAt impl: a compile error, not a panic.",
    step1: "resolved at compile time",
    step2: "cheap: Arc, pool, handle",
    step3: "ServiceCreation | compose_*",
    step4: "component",
    step4sub: "cron · gRPC · Iggy",
    caption:
      "Each push wraps the builder in a new node; lookup is by type, with no Any, no downcast and no runtime map. A compose_* closure borrows the whole builder and can provide several services.",
  },
  ja: {
    title:
      "型レベルの連結リストとしての ServiceBuilder: provide::<B, _>() はコンパイル時に位置 There<Here> へ解決される。コンポーネントは 1 つの依存を clone して作る (ServiceCreation) か、ビルダー全体を借用する compose_* クロージャで作る",
    exA: "例: DB プール",
    exB: "例: Redis",
    exC: "例: Iggy クライアント",
    end: "リストの終端",
    newest: "最後に登録",
    oldest: "最初に登録",
    noMatch: "C ≠ B: that へ進む",
    solver1: "トレイトソルバーがコンパイル時にリストをたどって推論:",
    solver2:
      "登録されていない型には ProvideAt の実装がなく、パニックではなくコンパイルエラーになります。",
    step1: "コンパイル時に解決",
    step2: "Arc・プール・ハンドル",
    step3: "ServiceCreation | compose_*",
    step4: "コンポーネント",
    step4sub: "cron・gRPC・Iggy",
    caption:
      "push のたびにビルダーが新しいノードで包まれます。型で検索し、Any もダウンキャストも実行時マップも使いません。compose_* クロージャはビルダー全体を借用し、複数のサービスを取り出せます。",
  },
} as const;

const fg = "var(--color-fd-foreground)";
const muted = "var(--color-fd-muted-foreground)";
const border = "var(--color-fd-border)";
const card = "var(--color-fd-card)";
const mono = "var(--font-mono, ui-monospace, monospace)";
const success = "var(--color-fd-success)";
const error = "var(--color-fd-error)";

const nodes = [
  { x: 20, y: 90, w: 860, h: 196, label: "ServiceBuilder<C, …>", tone: "teal" },
  {
    x: 222,
    y: 120,
    w: 640,
    h: 154,
    label: "that: ServiceBuilder<B, …>",
    tone: "blue",
  },
  {
    x: 424,
    y: 150,
    w: 420,
    h: 112,
    label: "that: ServiceBuilder<A, ()>",
    tone: "indigo",
  },
] as const;

const slotY = 180;
const slotH = 66;

export function ServiceBuilderDiagram({ lang = "en" }: { lang?: "en" | "ja" }) {
  const t = text[lang];
  const slots = [
    { x: 40, name: "C", ex: t.exC, pos: "Here", note: t.newest },
    { x: 242, name: "B", ex: t.exB, pos: "There<Here>", note: "" },
    { x: 444, name: "A", ex: t.exA, pos: "There<There<Here>>", note: t.oldest },
  ];
  const steps = [
    { code: "provide::<B, _>()", sub: t.step1 },
    { code: ".clone()", sub: t.step2 },
    { code: "create_service(b)", sub: t.step3 },
    { code: null, sub: t.step4sub },
  ];

  return (
    <figure className="waku-diagram">
      <svg
        viewBox="0 0 900 520"
        role="img"
        aria-labelledby="service-builder-title"
      >
        <title id="service-builder-title">{t.title}</title>
        <defs>
          <marker
            id="service-builder-arrow"
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

        <text x={20} y={30} fontSize={15} fontFamily={mono} fill={fg}>
          <tspan fill={muted}>let</tspan>
          {"\u00a0services = ServiceBuilder::new(a).push(b).push(c);"}
        </text>
        <text x={20} y={56} fontSize={14} fontFamily={mono} fill={muted}>
          {"//\u00a0"}
          <tspan fill={fg}>
            {"ServiceBuilder<C, ServiceBuilder<B, ServiceBuilder<A, ()>>>"}
          </tspan>
        </text>

        {nodes.map((n) => {
          const color = `var(--color-waku-${n.tone})`;
          return (
            <g key={n.label}>
              <rect
                x={n.x}
                y={n.y}
                width={n.w}
                height={n.h}
                rx={12}
                fill={card}
                stroke={border}
              />
              <rect
                x={n.x}
                y={n.y}
                width={n.w}
                height={n.h}
                rx={12}
                fill={color}
                fillOpacity={0.2}
                stroke={color}
                strokeWidth={1.5}
              />
              <text
                x={n.x + n.w - 14}
                y={n.y + 21}
                fontSize={13}
                fontFamily={mono}
                fill={muted}
                textAnchor="end"
              >
                {n.label}
              </text>
            </g>
          );
        })}

        {slots.map((s) => (
          <g key={s.name}>
            <rect
              x={s.x}
              y={slotY}
              width={164}
              height={slotH}
              rx={8}
              fill={card}
              stroke={border}
            />
            <text
              x={s.x + 82}
              y={slotY + 28}
              fontSize={15}
              fontWeight={700}
              fontFamily={mono}
              fill={fg}
              textAnchor="middle"
            >
              {`this: ${s.name}`}
            </text>
            <text
              x={s.x + 82}
              y={slotY + 50}
              fontSize={13}
              fontFamily="inherit"
              fill={muted}
              textAnchor="middle"
            >
              {s.ex}
            </text>
            <line
              x1={s.x + 82}
              y1={slotY + slotH}
              x2={s.x + 82}
              y2={306}
              stroke={muted}
              strokeDasharray="3 3"
            />
            <rect
              x={s.x + 2}
              y={306}
              width={160}
              height={28}
              rx={14}
              fill={card}
              stroke={muted}
            />
            <text
              x={s.x + 82}
              y={325}
              fontSize={13}
              fontFamily={mono}
              fill={fg}
              textAnchor="middle"
            >
              {s.pos}
            </text>
            {s.note && (
              <text
                x={s.x + 82}
                y={352}
                fontSize={13}
                fontFamily="inherit"
                fill={muted}
                textAnchor="middle"
              >
                {s.note}
              </text>
            )}
          </g>
        ))}

        <rect
          x={646}
          y={slotY}
          width={176}
          height={slotH}
          rx={8}
          fill="none"
          stroke={muted}
          strokeDasharray="4 3"
        />
        <text
          x={734}
          y={slotY + 28}
          fontSize={15}
          fontWeight={700}
          fontFamily={mono}
          fill={fg}
          textAnchor="middle"
        >
          that: ()
        </text>
        <text
          x={734}
          y={slotY + 50}
          fontSize={13}
          fontFamily="inherit"
          fill={muted}
          textAnchor="middle"
        >
          {t.end}
        </text>

        {/* Resolution marks for provide::<B, _>() */}
        <circle
          cx={196}
          cy={slotY}
          r={11}
          fill={card}
          stroke={error}
          strokeWidth={2}
        />
        <path
          d={`M191,${slotY - 5} L201,${slotY + 5} M201,${slotY - 5} L191,${slotY + 5}`}
          stroke={error}
          strokeWidth={2}
        />
        <circle
          cx={398}
          cy={slotY}
          r={11}
          fill={card}
          stroke={success}
          strokeWidth={2}
        />
        <path
          d={`M392,${slotY} L396.5,${slotY + 5} L404,${slotY - 5}`}
          fill="none"
          stroke={success}
          strokeWidth={2}
        />
        <path
          d={`M196,${slotY - 13} C196,${slotY - 30} 398,${slotY - 30} 398,${slotY - 15}`}
          fill="none"
          stroke={muted}
          strokeWidth={1.5}
          markerEnd="url(#service-builder-arrow)"
        />
        <text
          x={234}
          y={slotY - 34}
          fontSize={13}
          fontFamily="inherit"
          fill={muted}
        >
          {t.noMatch}
        </text>

        <text
          x={450}
          y={388}
          fontSize={14}
          fontFamily="inherit"
          fill={fg}
          textAnchor="middle"
        >
          {`${t.solver1}\u00a0`}
          <tspan fontFamily={mono} fontWeight={700}>
            {"_ = There<Here>"}
          </tspan>
        </text>
        <text
          x={450}
          y={410}
          fontSize={13}
          fontFamily="inherit"
          fill={muted}
          textAnchor="middle"
        >
          {t.solver2}
        </text>

        {steps.map((s, i) => {
          const x = 20 + i * 222;
          const last = i === steps.length - 1;
          const color = last ? "var(--color-waku-teal)" : undefined;
          return (
            <g key={s.sub}>
              <rect
                x={x}
                y={436}
                width={196}
                height={64}
                rx={10}
                fill={card}
                stroke={border}
              />
              {color && (
                <rect
                  x={x}
                  y={436}
                  width={196}
                  height={64}
                  rx={10}
                  fill={color}
                  fillOpacity={0.22}
                  stroke={color}
                  strokeWidth={1.5}
                />
              )}
              <text
                x={x + 98}
                y={462}
                fontSize={14}
                fontWeight={700}
                fontFamily={s.code ? mono : "inherit"}
                fill={fg}
                textAnchor="middle"
              >
                {s.code ?? t.step4}
              </text>
              <text
                x={x + 98}
                y={484}
                fontSize={13}
                fontFamily="inherit"
                fill={muted}
                textAnchor="middle"
              >
                {s.sub}
              </text>
              {!last && (
                <path
                  d={`M${x + 198},468 L${x + 220},468`}
                  stroke={muted}
                  strokeWidth={1.5}
                  markerEnd="url(#service-builder-arrow)"
                />
              )}
            </g>
          );
        })}
      </svg>
      <figcaption>{t.caption}</figcaption>
    </figure>
  );
}
