const text = {
  en: {
    title: "A query declares its effect; a Db handle must cover it",
    queries: "Queries declare an Effect",
    handles: "Handles carry a capability",
    databases: "Databases",
    readKind: "ReadKind: only reads",
    writeKind: "WriteKind: writes",
    readOnlyNote: "may read every entity",
    readWriteNote: "may read and write every entity",
    replica: "Replica",
    replicaNote: "read-only",
    primary: "Primary",
    primaryNote: "read-write",
    compiles: "holds, so the call compiles",
    rejected: "does not compile:",
    error: "error: `ReadOnly: CanWrite<Post>` is not satisfied",
    guard:
      "The types prove routing only. Keep the replica’s own read-only guard as well.",
    caption:
      "Every query names the entities it reads and writes. Db<S, C> implements Processor<Q> only when C covers Q::Effect.",
  },
  ja: {
    title: "クエリが作用を宣言し、Db ハンドルがそれを包含する",
    queries: "クエリが Effect を宣言",
    handles: "ハンドルが能力を持つ",
    databases: "データベース",
    readKind: "ReadKind：読み取りのみ",
    writeKind: "WriteKind：書き込みあり",
    readOnlyNote: "すべてのエンティティを読める",
    readWriteNote: "すべてを読み書きできる",
    replica: "レプリカ",
    replicaNote: "読み取り専用",
    primary: "プライマリ",
    primaryNote: "読み書き可",
    compiles: "が成り立つのでコンパイルできる",
    rejected: "コンパイルエラー：",
    error: "error: `ReadOnly: CanWrite<Post>` is not satisfied",
    guard:
      "型が証明するのはルーティングだけです。レプリカ側の読み取り専用設定も残してください。",
    caption:
      "クエリは読み書きするエンティティを宣言します。Db<S, C> は C が Q::Effect を包含するときだけ Processor<Q> を実装します。",
  },
} as const;

const mono = "var(--font-mono, ui-monospace, monospace)";
const fg = "var(--color-fd-foreground)";
const muted = "var(--color-fd-muted-foreground)";

function Cylinder({
  x,
  y,
  w,
  h,
  color,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  color: string;
}) {
  const rx = w / 2;
  const ry = 10;
  return (
    <g>
      <path
        d={`M${x},${y + ry} a${rx},${ry} 0 0 1 ${w},0 v${h - 2 * ry} a${rx},${ry} 0 0 1 ${-w},0 z`}
        fill={color}
        fillOpacity={0.25}
        stroke={color}
        strokeWidth={1.5}
      />
      <path
        d={`M${x},${y + ry} a${rx},${ry} 0 0 0 ${w},0`}
        fill="none"
        stroke={color}
        strokeWidth={1.5}
      />
    </g>
  );
}

function Mark({ x, y, ok }: { x: number; y: number; ok: boolean }) {
  const color = ok ? "var(--color-fd-success)" : "var(--color-fd-error)";
  return (
    <g>
      <circle
        cx={x}
        cy={y}
        r={11}
        fill="var(--color-fd-card)"
        stroke={color}
        strokeWidth={2}
      />
      {ok ? (
        <path
          d={`M${x - 5},${y} l3.5,4 l6.5,-8`}
          fill="none"
          stroke={color}
          strokeWidth={2.4}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ) : (
        <path
          d={`M${x - 4.5},${y - 4.5} l9,9 M${x + 4.5},${y - 4.5} l-9,9`}
          stroke={color}
          strokeWidth={2.4}
          strokeLinecap="round"
        />
      )}
    </g>
  );
}

export function CapabilityDiagram({ lang = "en" }: { lang?: "en" | "ja" }) {
  const t = text[lang];
  const ok = "var(--color-fd-success)";
  const bad = "var(--color-fd-error)";
  return (
    <figure className="waku-diagram">
      <svg
        viewBox="0 0 900 470"
        role="img"
        aria-labelledby="capability-title"
        fontFamily="inherit"
      >
        <title id="capability-title">{t.title}</title>
        <defs>
          <marker
            id="capability-arrow-ok"
            viewBox="0 0 10 10"
            refX="9"
            refY="5"
            markerWidth="7"
            markerHeight="7"
            orient="auto"
          >
            <path d="M0,0 L10,5 L0,10 z" fill={ok} />
          </marker>
          <marker
            id="capability-arrow-bad"
            viewBox="0 0 10 10"
            refX="9"
            refY="5"
            markerWidth="7"
            markerHeight="7"
            orient="auto"
          >
            <path d="M0,0 L10,5 L0,10 z" fill={bad} />
          </marker>
          <marker
            id="capability-arrow"
            viewBox="0 0 10 10"
            refX="9"
            refY="5"
            markerWidth="7"
            markerHeight="7"
            orient="auto"
          >
            <path d="M0,0 L10,5 L0,10 z" fill={muted} />
          </marker>
        </defs>

        {/* Column headers */}
        <g fontSize={14} fontWeight={600} fill={muted} textAnchor="middle">
          <text x={135} y={34}>
            {t.queries}
          </text>
          <text x={520} y={34}>
            {t.handles}
          </text>
          <text x={800} y={34}>
            {t.databases}
          </text>
        </g>

        {/* Queries */}
        {[
          {
            y: 60,
            name: "FindUser",
            effect: "type Effect = Read<User>;",
            kind: t.readKind,
            color: "var(--color-waku-blue)",
          },
          {
            y: 250,
            name: "DeletePost",
            effect: "type Effect = Write<Post>;",
            kind: t.writeKind,
            color: "var(--color-waku-pink)",
          },
        ].map((q) => (
          <g key={q.name}>
            <rect
              x={20}
              y={q.y}
              width={230}
              height={90}
              rx={10}
              fill={q.color}
              fillOpacity={0.22}
              stroke={q.color}
              strokeWidth={1.5}
            />
            <text
              x={36}
              y={q.y + 28}
              fontFamily={mono}
              fontSize={15}
              fontWeight={700}
              fill={fg}
            >
              {q.name}
            </text>
            <text x={36} y={q.y + 52} fontFamily={mono} fontSize={13} fill={fg}>
              {q.effect}
            </text>
            <text x={36} y={q.y + 75} fontSize={13} fill={muted}>
              {q.kind}
            </text>
          </g>
        ))}

        {/* Handles */}
        {[
          {
            y: 60,
            name: "Db<PgSource, ReadOnly>",
            impls: "impl CanRead<E> for every E",
            note: t.readOnlyNote,
            color: "var(--color-waku-teal)",
          },
          {
            y: 250,
            name: "Db<PgSource, ReadWrite>",
            impls: "CanRead<E> + CanWrite<E>",
            note: t.readWriteNote,
            color: "var(--color-waku-indigo)",
          },
        ].map((h) => (
          <g key={h.name}>
            <rect
              x={400}
              y={h.y}
              width={240}
              height={90}
              rx={10}
              fill={h.color}
              fillOpacity={0.22}
              stroke={h.color}
              strokeWidth={1.5}
            />
            <text
              x={416}
              y={h.y + 28}
              fontFamily={mono}
              fontSize={14}
              fontWeight={700}
              fill={fg}
            >
              {h.name}
            </text>
            <text
              x={416}
              y={h.y + 52}
              fontFamily={mono}
              fontSize={13}
              fill={fg}
            >
              {h.impls}
            </text>
            <text x={416} y={h.y + 75} fontSize={13} fill={muted}>
              {h.note}
            </text>
          </g>
        ))}

        {/* Databases */}
        <Cylinder
          x={720}
          y={60}
          w={160}
          h={90}
          color="var(--color-waku-teal)"
        />
        <text
          x={800}
          y={104}
          textAnchor="middle"
          fontSize={15}
          fontWeight={600}
          fill={fg}
        >
          {t.replica}
        </text>
        <text x={800} y={126} textAnchor="middle" fontSize={13} fill={muted}>
          {t.replicaNote}
        </text>
        <Cylinder
          x={720}
          y={250}
          w={160}
          h={90}
          color="var(--color-waku-indigo)"
        />
        <text
          x={800}
          y={294}
          textAnchor="middle"
          fontSize={15}
          fontWeight={600}
          fill={fg}
        >
          {t.primary}
        </text>
        <text x={800} y={316} textAnchor="middle" fontSize={13} fill={muted}>
          {t.primaryNote}
        </text>
        <line
          x1={640}
          y1={105}
          x2={716}
          y2={105}
          stroke={muted}
          strokeWidth={1.5}
          markerEnd="url(#capability-arrow)"
        />
        <line
          x1={640}
          y1={295}
          x2={716}
          y2={295}
          stroke={muted}
          strokeWidth={1.5}
          markerEnd="url(#capability-arrow)"
        />

        {/* Query → handle */}
        <line
          x1={250}
          y1={100}
          x2={396}
          y2={100}
          stroke={ok}
          strokeWidth={2}
          markerEnd="url(#capability-arrow-ok)"
        />
        <line
          x1={250}
          y1={300}
          x2={396}
          y2={300}
          stroke={ok}
          strokeWidth={2}
          markerEnd="url(#capability-arrow-ok)"
        />
        <line
          x1={250}
          y1={124}
          x2={396}
          y2={274}
          stroke={ok}
          strokeWidth={2}
          markerEnd="url(#capability-arrow-ok)"
        />
        <line
          x1={250}
          y1={276}
          x2={396}
          y2={126}
          stroke={bad}
          strokeWidth={2}
          strokeDasharray="6 5"
          markerEnd="url(#capability-arrow-bad)"
        />
        <Mark x={322} y={100} ok />
        <Mark x={322} y={300} ok />
        <Mark x={366} y={243} ok />
        <Mark x={366} y={157} ok={false} />

        {/* Legend and the compile error */}
        <g fontSize={13}>
          <line x1={20} y1={384} x2={60} y2={384} stroke={ok} strokeWidth={2} />
          <text x={72} y={389} fill={fg}>
            <tspan fontFamily={mono}>C: Covers&lt;Q::Effect&gt;</tspan>
            <tspan dx={5}>{t.compiles}</tspan>
          </text>
          <line
            x1={20}
            y1={414}
            x2={60}
            y2={414}
            stroke={bad}
            strokeWidth={2}
            strokeDasharray="6 5"
          />
          <text x={72} y={419} fill={fg}>
            <tspan fill={bad} fontWeight={600}>
              {t.rejected}
            </tspan>
            <tspan dx={lang === "en" ? 6 : 2} fontFamily={mono}>
              {t.error}
            </tspan>
          </text>
          <text x={20} y={452} fill={muted}>
            {t.guard}
          </text>
        </g>
      </svg>
      <figcaption>{t.caption}</figcaption>
    </figure>
  );
}
