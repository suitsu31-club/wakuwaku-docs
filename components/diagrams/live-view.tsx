type Segment = string | { code: string };

const text = {
  en: {
    title: "A live view: a head hash and a history stream in Redis",
    redis: "Redis: two keys, one hash slot",
    head: "head (hash)",
    latestBody: "latest body",
    history: "history (stream)",
    squash: [
      "Past max_diffs diffs, the next commit",
      "trims the history and writes a base",
      "holding both the body and its diff.",
    ],
    writer: "Writer",
    atomic: ["one atomic Lua script,", "applied only if"],
    reader: "Reader",
    latest: "latest body in O(1)",
    subscriber: "Subscriber",
    steps: [
      [{ code: "subscribe(&name, conn)" }],
      ["reads the head: version v"],
      [{ code: "XREAD BLOCK" }, " after v-0"],
      ["on a dedicated connection"],
      [{ code: "view.update(event)" }],
      ["applies a Diff, takes a Snapshot"],
    ] as Segment[][],
    diff: ": the next entry holds the diff from the current version",
    snapshot:
      ": the diffs were squashed into a base, so the whole body is sent",
    caption:
      "A commit moves the head and appends its diff in one script, so racing writers get Conflict instead of overwriting each other. Subscribers block on the stream and catch up on every entry after their version.",
  },
  ja: {
    title: "ライブビュー：Redis 上のヘッドのハッシュと履歴のストリーム",
    redis: "Redis：同じスロットの 2 つのキー",
    head: "ヘッド（ハッシュ）",
    latestBody: "最新の本文",
    history: "履歴（ストリーム）",
    squash: [
      "diff が max_diffs 件を超えると、",
      "次の commit が履歴を切り詰めて、",
      "本文と diff を持つ base を書きます。",
    ],
    writer: "書き込み側",
    atomic: ["1 つの Lua スクリプトで", "アトミックに適用。条件："],
    reader: "読み取り側",
    latest: "最新の本文を O(1) で取得",
    subscriber: "購読側",
    steps: [
      [{ code: "subscribe(&name, conn)" }],
      ["ヘッドを読み、版 v から開始"],
      [{ code: "XREAD BLOCK" }, " で v-0 の後を待つ"],
      ["専用の接続を使う"],
      [{ code: "view.update(event)" }],
      ["Diff は適用、Snapshot は置換"],
    ] as Segment[][],
    diff: "：次のエントリが現在の版からの diff を持つ",
    snapshot: "：diff が base にまとめられたので本文全体を送る",
    caption:
      "commit はヘッドの更新と diff の追記を 1 つのスクリプトで行うため、競合した書き込みは上書きせず Conflict になります。購読側はストリームでブロックし、自分の版より後のエントリをすべて受け取ります。",
  },
} as const;

const mono = "var(--font-mono, ui-monospace, monospace)";
const fg = "var(--color-fd-foreground)";
const muted = "var(--color-fd-muted-foreground)";
const arrow = "url(#live-view-arrow)";

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

function Entry({
  x,
  id,
  field,
  ghost = false,
}: {
  x: number;
  id: string;
  field: string;
  ghost?: boolean;
}) {
  const color =
    field === "base" ? "var(--color-waku-yellow)" : "var(--color-waku-pink)";
  return (
    <g>
      <rect
        x={x}
        y={256}
        width={60}
        height={52}
        rx={6}
        fill={ghost ? "none" : color}
        fillOpacity={ghost ? undefined : 0.3}
        stroke={ghost ? muted : color}
        strokeWidth={1.5}
        strokeDasharray={ghost ? "4 4" : undefined}
      />
      <text
        x={x + 30}
        y={277}
        textAnchor="middle"
        fontFamily={mono}
        fontSize={13}
        fontWeight={700}
        fill={ghost ? muted : fg}
      >
        {id}
      </text>
      <text
        x={x + 30}
        y={297}
        textAnchor="middle"
        fontFamily={mono}
        fontSize={13}
        fill={ghost ? muted : fg}
      >
        {field}
      </text>
    </g>
  );
}

export function LiveViewDiagram({ lang = "en" }: { lang?: "en" | "ja" }) {
  const t = text[lang];
  const stepRows = [
    { n: 1, y: 276 },
    { n: 0, y: 294 },
    { n: 2, y: 322 },
    { n: 0, y: 340 },
    { n: 3, y: 368 },
    { n: 0, y: 386 },
  ];
  return (
    <figure className="waku-diagram">
      <svg
        viewBox="0 0 900 505"
        role="img"
        aria-labelledby="live-view-title"
        fontFamily="inherit"
      >
        <title id="live-view-title">{t.title}</title>
        <defs>
          <marker
            id="live-view-arrow"
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

        {/* Redis */}
        <rect
          x={250}
          y={40}
          width={300}
          height={370}
          rx={10}
          fill="var(--color-fd-card)"
          stroke="var(--color-fd-border)"
          strokeWidth={1.5}
        />
        <text x={266} y={64} fontSize={14} fontWeight={600} fill={fg}>
          {t.redis}
        </text>
        <text x={266} y={86} fontFamily={mono} fontSize={13} fill={muted}>
          @@wakuwaku-entity:LiveView:
        </text>
        <text x={266} y={104} fontFamily={mono} fontSize={13} fill={muted}>
          {"{document:7}"}
        </text>

        <rect
          x={260}
          y={118}
          width={280}
          height={86}
          rx={8}
          fill="var(--color-waku-blue)"
          fillOpacity={0.22}
          stroke="var(--color-waku-blue)"
          strokeWidth={1.5}
        />
        <text x={274} y={140} fontSize={13} fill={fg}>
          <tspan fontFamily={mono} fontWeight={700}>
            …:h
          </tspan>
          <tspan dx={8}>{t.head}</tspan>
        </text>
        <text x={274} y={164} fontFamily={mono} fontSize={13} fill={fg}>
          v → 5
        </text>
        <text x={274} y={186} fontSize={13} fill={fg}>
          <tspan fontFamily={mono}>b →</tspan>
          <tspan dx={8} fill={muted}>
            {t.latestBody}
          </tspan>
        </text>

        <rect
          x={260}
          y={222}
          width={280}
          height={100}
          rx={8}
          fill="var(--color-waku-indigo)"
          fillOpacity={0.18}
          stroke="var(--color-waku-indigo)"
          strokeWidth={1.5}
        />
        <text x={274} y={244} fontSize={13} fill={fg}>
          <tspan fontFamily={mono} fontWeight={700}>
            …:l
          </tspan>
          <tspan dx={8}>{t.history}</tspan>
        </text>
        <Entry x={268} id="3-0" field="base" />
        <Entry x={336} id="4-0" field="diff" />
        <Entry x={404} id="5-0" field="diff" />
        <Entry x={472} id="6-0" field="diff" ghost />

        {t.squash.map((line, i) => (
          <text key={line} x={266} y={350 + i * 18} fontSize={13} fill={muted}>
            {line}
          </text>
        ))}

        {/* Writer */}
        <rect
          x={20}
          y={118}
          width={180}
          height={150}
          rx={10}
          fill="var(--color-waku-purple)"
          fillOpacity={0.22}
          stroke="var(--color-waku-purple)"
          strokeWidth={1.5}
        />
        <text x={34} y={142} fontSize={14} fontWeight={600} fill={fg}>
          {t.writer}
        </text>
        <text x={34} y={166} fontFamily={mono} fontSize={13} fill={fg}>
          commit(&amp;name,
        </text>
        <text
          x={34}
          y={184}
          fontFamily={mono}
          fontSize={13}
          fill={fg}
          xmlSpace="preserve"
        >
          {" parent, diff, body)"}
        </text>
        <text x={34} y={212} fontSize={13} fill={muted}>
          {t.atomic[0]}
        </text>
        <text x={34} y={230} fontSize={13} fill={muted}>
          {t.atomic[1]}
        </text>
        <text x={34} y={250} fontFamily={mono} fontSize={13} fill={fg}>
          v == parent
        </text>
        <line
          x1={200}
          y1={161}
          x2={256}
          y2={161}
          stroke={muted}
          strokeWidth={1.5}
          markerEnd={arrow}
        />
        <text
          x={228}
          y={153}
          textAnchor="middle"
          fontFamily={mono}
          fontSize={13}
          fill={fg}
        >
          HSET
        </text>
        <line
          x1={200}
          y1={254}
          x2={256}
          y2={254}
          stroke={muted}
          strokeWidth={1.5}
          markerEnd={arrow}
        />
        <text
          x={228}
          y={246}
          textAnchor="middle"
          fontFamily={mono}
          fontSize={13}
          fill={fg}
        >
          XADD
        </text>

        <g fontFamily={mono} fontSize={13}>
          <text x={20} y={298} fill={muted}>
            → Commit
          </text>
          <text x={34} y={320} fill={fg}>
            Committed {"{ version }"}
          </text>
          <text x={34} y={340} fill={fg}>
            Conflict {"{ head }"}
          </text>
          <text x={34} y={360} fill={fg}>
            Absent
          </text>
        </g>

        {/* Reader */}
        <rect
          x={610}
          y={118}
          width={275}
          height={86}
          rx={10}
          fill="var(--color-waku-teal)"
          fillOpacity={0.22}
          stroke="var(--color-waku-teal)"
          strokeWidth={1.5}
        />
        <text x={624} y={140} fontSize={13} fill={fg}>
          <tspan fontSize={14} fontWeight={600}>
            {t.reader}
          </tspan>
          <tspan dx={10} fontFamily={mono}>
            get(&amp;name)
          </tspan>
        </text>
        <text x={624} y={164} fontFamily={mono} fontSize={13} fill={fg}>
          → Versioned
        </text>
        <text x={624} y={186} fontSize={13} fill={muted}>
          {t.latest}
        </text>
        <line
          x1={540}
          y1={161}
          x2={606}
          y2={161}
          stroke={muted}
          strokeWidth={1.5}
          markerEnd={arrow}
        />
        <text
          x={575}
          y={153}
          textAnchor="middle"
          fontFamily={mono}
          fontSize={13}
          fill={fg}
        >
          HMGET
        </text>

        {/* Subscriber */}
        <rect
          x={610}
          y={224}
          width={275}
          height={180}
          rx={10}
          fill="var(--color-waku-teal)"
          fillOpacity={0.22}
          stroke="var(--color-waku-teal)"
          strokeWidth={1.5}
        />
        <text x={624} y={248} fontSize={14} fontWeight={600} fill={fg}>
          {t.subscriber}
        </text>
        {stepRows.map((row, i) => (
          <g key={i}>
            {row.n > 0 && <StepNumber x={631} y={row.y} n={row.n} />}
            <Line
              x={647}
              y={row.y}
              segments={t.steps[i]}
              fill={row.n > 0 ? fg : muted}
            />
          </g>
        ))}
        <line
          x1={540}
          y1={192}
          x2={606}
          y2={244}
          stroke={muted}
          strokeWidth={1.5}
          markerEnd={arrow}
        />
        <line
          x1={540}
          y1={300}
          x2={606}
          y2={300}
          stroke={muted}
          strokeWidth={1.5}
          markerEnd={arrow}
        />
        <text
          x={575}
          y={292}
          textAnchor="middle"
          fontFamily={mono}
          fontSize={13}
          fill={fg}
        >
          XREAD
        </text>

        {/* Events */}
        <line
          x1={20}
          y1={432}
          x2={880}
          y2={432}
          stroke="var(--color-fd-border)"
          strokeWidth={1}
        />
        <Line
          x={20}
          y={460}
          segments={[{ code: "LiveViewEvent::Diff { version, diff }" }, t.diff]}
        />
        <Line
          x={20}
          y={486}
          segments={[
            { code: "LiveViewEvent::Snapshot(Versioned)" },
            t.snapshot,
          ]}
        />
      </svg>
      <figcaption>{t.caption}</figcaption>
    </figure>
  );
}
