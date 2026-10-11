type Segment = string | { code: string };

const text = {
  en: {
    title: "Keeping a Meilisearch index in sync with its source of truth",
    delivery: "Delivery",
    outbox: "or outbox + queue",
    source: "Source of truth",
    sourceSub: "PostgreSQL, …",
    afterCommit: "after commit",
    keysOnly: "keys only",
    indexer: [
      [{ code: "load(&keys)" }, ": read the rows"],
      [{ code: "project(row)" }, " → ", { code: "Some(doc)" }, ": upsert"],
      ["no row, or ", { code: "None" }, ": delete"],
      [{ code: "WaitTask" }, " per write (30 s)"],
      ["skipped with ", { code: "without_waiting()" }],
    ] as Segment[][],
    indexerNote: [
      "Only the keys are trusted, so late or",
      "duplicate changes do no harm.",
    ],
    rebuild: [
      ["recreate the copy, apply the settings"],
      [{ code: "page(after, limit)" }, " → ", { code: "project" }],
      ["→ upsert into the copy"],
      ["repeat until a page comes back short"],
      ["create live if missing, ", { code: "swap" }, ","],
      ["delete the copy (it holds the old docs)"],
    ] as Segment[][],
    rebuildNote: "Run it periodically to repair drift.",
    live: "live index",
    liveSub: "searches read here",
    copy: "copy being filled",
    swapSub: "in one step",
    documents: "documents",
    caption:
      "Changes carry keys; the Indexer reloads those keys from the source and writes or deletes their documents. rebuild() fills a fresh copy from a full scan and swaps it with the live index.",
  },
  ja: {
    title: "Meilisearch のインデックスを信頼できる情報源と同期させる",
    delivery: "変更の配送",
    outbox: "アウトボックス経由も可",
    source: "信頼できる情報源",
    sourceSub: "PostgreSQL など",
    afterCommit: "コミット後",
    keysOnly: "キーのみ",
    indexer: [
      [{ code: "load(&keys)" }, " で行を読む"],
      [{ code: "project(row)" }, " が ", { code: "Some" }, " なら upsert"],
      ["行がない、または ", { code: "None" }, " なら delete"],
      ["書き込みごとに ", { code: "WaitTask" }, "（30 秒）"],
      [{ code: "without_waiting()" }, " なら待たない"],
    ] as Segment[][],
    indexerNote: [
      "キーしか信頼しないので、遅れて",
      "届いた変更や重複した変更も無害です。",
    ],
    rebuild: [
      ["コピーを作り直して設定を適用"],
      [{ code: "page(after, limit)" }, " → ", { code: "project" }],
      ["→ コピーへ upsert"],
      ["短いページが返るまで繰り返す"],
      ["ライブがなければ作成して ", { code: "swap" }],
      ["旧ドキュメントを持つコピーを削除"],
    ] as Segment[][],
    rebuildNote: "定期的に実行してずれを修復します。",
    live: "ライブインデックス",
    liveSub: "検索はここを読む",
    copy: "構築中のコピー",
    swapSub: "一度に切り替え",
    documents: "ドキュメント",
    caption:
      "変更が運ぶのはキーだけです。Indexer はそのキーをソースから読み直し、ドキュメントを書き込むか削除します。rebuild() は全件スキャンで新しいコピーを埋め、ライブインデックスと入れ替えます。",
  },
} as const;

const mono = "var(--font-mono, ui-monospace, monospace)";
const fg = "var(--color-fd-foreground)";
const muted = "var(--color-fd-muted-foreground)";
const arrow = "url(#meili-sync-arrow)";
const arrowStart = "url(#meili-sync-arrow-start)";

function Line({
  x,
  y,
  segments,
  fill = fg,
}: {
  x: number;
  y: number;
  segments: readonly Segment[];
  fill?: string;
}) {
  return (
    <text x={x} y={y} fontSize={13} fill={fill} xmlSpace="preserve">
      {segments.map((segment, i) =>
        typeof segment === "string" ? (
          <tspan key={i}>{segment}</tspan>
        ) : (
          <tspan key={i} fontFamily={mono}>
            {segment.code}
          </tspan>
        ),
      )}
    </text>
  );
}

function StepNumber({ x, y, n }: { x: number; y: number; n: number }) {
  return (
    <g>
      <circle
        cx={x}
        cy={y - 4.5}
        r={9}
        fill="none"
        stroke={muted}
        strokeWidth={1.2}
      />
      <text x={x} y={y} textAnchor="middle" fontSize={13} fill={fg}>
        {n}
      </text>
    </g>
  );
}

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

export function MeiliSyncDiagram({ lang = "en" }: { lang?: "en" | "ja" }) {
  const t = text[lang];
  // Indexer steps: the fourth step spans two lines.
  const indexerRows = [
    { n: 1, y: 98 },
    { n: 2, y: 122 },
    { n: 3, y: 146 },
    { n: 4, y: 170 },
    { n: 0, y: 188 },
  ];
  const rebuildRows = [
    { n: 1, y: 348 },
    { n: 2, y: 372 },
    { n: 0, y: 390 },
    { n: 3, y: 414 },
    { n: 4, y: 438 },
    { n: 0, y: 456 },
  ];
  return (
    <figure className="waku-diagram">
      <svg
        viewBox="0 0 900 545"
        role="img"
        aria-labelledby="meili-sync-title"
        fontFamily="inherit"
      >
        <title id="meili-sync-title">{t.title}</title>
        <defs>
          <marker
            id="meili-sync-arrow"
            viewBox="0 0 10 10"
            refX="9"
            refY="5"
            markerWidth="7"
            markerHeight="7"
            orient="auto"
          >
            <path d="M0,0 L10,5 L0,10 z" fill={muted} />
          </marker>
          <marker
            id="meili-sync-arrow-start"
            viewBox="0 0 10 10"
            refX="1"
            refY="5"
            markerWidth="7"
            markerHeight="7"
            orient="auto"
          >
            <path d="M10,0 L0,5 L10,10 z" fill={muted} />
          </marker>
        </defs>

        {/* Delivery */}
        <rect
          x={20}
          y={40}
          width={170}
          height={110}
          rx={10}
          fill="var(--color-waku-yellow)"
          fillOpacity={0.25}
          stroke="var(--color-waku-yellow)"
          strokeWidth={1.5}
        />
        <text x={36} y={64} fontSize={14} fontWeight={600} fill={fg}>
          {t.delivery}
        </text>
        <text x={36} y={88} fontFamily={mono} fontSize={13} fill={fg}>
          AfterWrite
        </text>
        <text x={36} y={108} fontFamily={mono} fontSize={13} fill={fg}>
          AfterTransaction
        </text>
        <text x={36} y={132} fontSize={13} fill={muted}>
          {t.outbox}
        </text>

        {/* Source of truth */}
        <Cylinder
          x={20}
          y={215}
          w={170}
          h={110}
          color="var(--color-waku-blue)"
        />
        <text
          x={105}
          y={272}
          textAnchor="middle"
          fontSize={15}
          fontWeight={600}
          fill={fg}
        >
          {t.source}
        </text>
        <text x={105} y={294} textAnchor="middle" fontSize={13} fill={muted}>
          {t.sourceSub}
        </text>
        <line
          x1={105}
          y1={213}
          x2={105}
          y2={154}
          stroke={muted}
          strokeWidth={1.5}
          markerEnd={arrow}
        />
        <text x={113} y={189} fontSize={13} fill={muted}>
          {t.afterCommit}
        </text>

        {/* Indexer */}
        <rect
          x={280}
          y={40}
          width={300}
          height={210}
          rx={10}
          fill="var(--color-waku-teal)"
          fillOpacity={0.2}
          stroke="var(--color-waku-teal)"
          strokeWidth={1.5}
        />
        <text
          x={296}
          y={66}
          fontFamily={mono}
          fontSize={15}
          fontWeight={700}
          fill={fg}
        >
          Indexer
        </text>
        {indexerRows.map((row, i) => (
          <g key={i}>
            {row.n > 0 && <StepNumber x={305} y={row.y} n={row.n} />}
            <Line x={322} y={row.y} segments={t.indexer[i]} />
          </g>
        ))}
        <text x={296} y={218} fontSize={13} fill={muted}>
          {t.indexerNote[0]}
        </text>
        <text x={296} y={236} fontSize={13} fill={muted}>
          {t.indexerNote[1]}
        </text>

        <line
          x1={190}
          y1={90}
          x2={276}
          y2={90}
          stroke={muted}
          strokeWidth={1.5}
          markerEnd={arrow}
        />
        <text
          x={233}
          y={82}
          textAnchor="middle"
          fontFamily={mono}
          fontSize={13}
          fill={fg}
        >
          Reindex
        </text>
        <text x={233} y={108} textAnchor="middle" fontSize={13} fill={muted}>
          {t.keysOnly}
        </text>
        <line
          x1={278}
          y1={205}
          x2={194}
          y2={252}
          stroke={muted}
          strokeWidth={1.5}
          markerStart={arrowStart}
          markerEnd={arrow}
        />

        {/* Rebuild */}
        <rect
          x={280}
          y={290}
          width={300}
          height={240}
          rx={10}
          fill="var(--color-waku-purple)"
          fillOpacity={0.22}
          stroke="var(--color-waku-purple)"
          strokeWidth={1.5}
        />
        <text
          x={296}
          y={316}
          fontFamily={mono}
          fontSize={15}
          fontWeight={700}
          fill={fg}
        >
          rebuild()
        </text>
        {rebuildRows.map((row, i) => (
          <g key={i}>
            {row.n > 0 && <StepNumber x={305} y={row.y} n={row.n} />}
            <Line x={322} y={row.y} segments={t.rebuild[i]} />
          </g>
        ))}
        <text x={296} y={488} fontFamily={mono} fontSize={13} fill={fg}>
          → Rebuilt {"{ started_at, documents }"}
        </text>
        <text x={296} y={512} fontSize={13} fill={muted}>
          {t.rebuildNote}
        </text>
        <line
          x1={190}
          y1={300}
          x2={276}
          y2={360}
          stroke={muted}
          strokeWidth={1.5}
          markerEnd={arrow}
        />

        {/* Meilisearch */}
        <rect
          x={670}
          y={40}
          width={215}
          height={490}
          rx={10}
          fill="var(--color-fd-card)"
          stroke="var(--color-fd-border)"
          strokeWidth={1.5}
        />
        <text
          x={777}
          y={66}
          textAnchor="middle"
          fontSize={14}
          fontWeight={600}
          fill={fg}
        >
          Meilisearch
        </text>
        <rect
          x={680}
          y={85}
          width={195}
          height={95}
          rx={8}
          fill="var(--color-waku-teal)"
          fillOpacity={0.22}
          stroke="var(--color-waku-teal)"
          strokeWidth={1.5}
        />
        <text
          x={777}
          y={112}
          textAnchor="middle"
          fontFamily={mono}
          fontSize={15}
          fontWeight={700}
          fill={fg}
        >
          posts
        </text>
        <text x={777} y={136} textAnchor="middle" fontSize={13} fill={fg}>
          {t.live}
        </text>
        <text x={777} y={158} textAnchor="middle" fontSize={13} fill={muted}>
          {t.liveSub}
        </text>
        <rect
          x={680}
          y={410}
          width={195}
          height={80}
          rx={8}
          fill="var(--color-waku-purple)"
          fillOpacity={0.22}
          stroke="var(--color-waku-purple)"
          strokeWidth={1.5}
        />
        <text
          x={777}
          y={440}
          textAnchor="middle"
          fontFamily={mono}
          fontSize={13}
          fontWeight={700}
          fill={fg}
        >
          posts__wakuwaku_rebuild
        </text>
        <text x={777} y={466} textAnchor="middle" fontSize={13} fill={muted}>
          {t.copy}
        </text>

        <line
          x1={777}
          y1={186}
          x2={777}
          y2={404}
          stroke={muted}
          strokeWidth={1.5}
          markerStart={arrowStart}
          markerEnd={arrow}
        />
        <rect
          x={712}
          y={269}
          width={130}
          height={52}
          rx={6}
          fill="var(--color-fd-card)"
        />
        <text
          x={777}
          y={291}
          textAnchor="middle"
          fontFamily={mono}
          fontSize={13}
          fontWeight={700}
          fill={fg}
        >
          swap_indexes
        </text>
        <text x={777} y={311} textAnchor="middle" fontSize={13} fill={muted}>
          {t.swapSub}
        </text>

        <line
          x1={580}
          y1={130}
          x2={676}
          y2={130}
          stroke={muted}
          strokeWidth={1.5}
          markerEnd={arrow}
        />
        <text
          x={628}
          y={122}
          textAnchor="middle"
          fontFamily={mono}
          fontSize={13}
          fill={fg}
        >
          Upsert
        </text>
        <text
          x={628}
          y={148}
          textAnchor="middle"
          fontFamily={mono}
          fontSize={13}
          fill={fg}
        >
          Delete
        </text>
        <line
          x1={580}
          y1={450}
          x2={676}
          y2={450}
          stroke={muted}
          strokeWidth={1.5}
          markerEnd={arrow}
        />
        <text x={628} y={442} textAnchor="middle" fontSize={13} fill={fg}>
          {t.documents}
        </text>
      </svg>
      <figcaption>{t.caption}</figcaption>
    </figure>
  );
}
