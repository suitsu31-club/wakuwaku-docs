const text = {
  en: {
    title:
      "The same cron job under the three CronJobInterval variants, on a common time axis in units of the interval d",
    header:
      "Same job in every row: the first run takes 2.5·d, later runs 0.25·d",
    rules: {
      AfterFinish: "d after the previous end",
      AtLeast: "≥ d between starts",
      AfterStart: "grid start + k·d",
    },
    noOverlap: "no overlap",
    overlap: "runs may overlap",
    firstRun: "first run",
    errKept: "Err → logged, schedule kept",
    atOnce: "longer than d → next starts at once",
    overlapping: "the runs at d and 2d overlap the first run",
    time: "time",
    legendRun: "run",
    legendFailed: "Err or panic: logged with tracing, schedule kept",
    caption:
      "One job, three INTERVAL variants. AfterFinish waits d after each run ends; AtLeast keeps starts at least d apart and starts the next run at once after a run longer than d; AfterStart starts on the grid however long a run takes, so the runs at d and 2d run concurrently with the first one. Every variant runs first at start.",
  },
  ja: {
    title:
      "同じ cron ジョブを 3 種類の CronJobInterval で動かした場合の比較（時間軸は間隔 d 単位）",
    header: "各行は同じジョブ: 初回の実行は 2.5·d、以降の実行は 0.25·d",
    rules: {
      AfterFinish: "前回の終了から d 後",
      AtLeast: "開始の間隔は d 以上",
      AfterStart: "格子 start + k·d",
    },
    noOverlap: "重ならない",
    overlap: "重なりうる",
    firstRun: "初回",
    errKept: "Err → ログに記録、スケジュールは継続",
    atOnce: "d より長い → 終了後すぐ次を開始",
    overlapping: "d と 2d の実行が初回の実行と重なる",
    time: "時間",
    legendRun: "実行",
    legendFailed: "Err やパニック: tracing でログに記録し、スケジュールは継続",
    caption:
      "同じジョブを 3 種類の INTERVAL で動かした場合です。AfterFinish は各実行の終了から d 待ち、AtLeast は開始の間隔を d 以上に保ちつつ、d より長い実行の後はすぐに次を始めます。AfterStart は実行の長さにかかわらず格子どおりに始めるので、d と 2d の実行は初回の実行と並行に動きます。どの種類でも最初の実行は start の時点です。",
  },
} as const;

const fg = "var(--color-fd-foreground)";
const muted = "var(--color-fd-muted-foreground)";
const border = "var(--color-fd-border)";
const mono = "var(--font-mono, ui-monospace, monospace)";
const teal = "var(--color-waku-teal)";
const error = "var(--color-fd-error)";
const warning = "var(--color-fd-warning)";
const success = "var(--color-fd-success)";

/** Time axis: 120 px per interval d, starting at x = 200. */
const x = (t: number) => 200 + 120 * t;
const long = 2.5;
const short = 0.25;
const barH = 24;
const axisY = 380;
const legendY = 432;

type Run = { at: number; len: number; lane: 0 | 1; failed?: boolean };
type Span = { from: number; to: number; label: string };
type Variant = "AfterFinish" | "AtLeast" | "AfterStart";
type Row = {
  name: Variant;
  top: number;
  overlaps: boolean;
  runs: Run[];
  spans: Span[];
};

const rows: Row[] = [
  {
    // Next start = previous end + d.
    name: "AfterFinish",
    top: 50,
    overlaps: false,
    runs: [
      { at: 0, len: long, lane: 0 },
      { at: 3.5, len: short, lane: 0, failed: true },
      { at: 4.75, len: short, lane: 0 },
    ],
    spans: [
      { from: 2.5, to: 3.5, label: "d" },
      { from: 3.75, to: 4.75, label: "d" },
    ],
  },
  {
    // Next start = previous start + max(d, run time).
    name: "AtLeast",
    top: 140,
    overlaps: false,
    runs: [
      { at: 0, len: long, lane: 0 },
      { at: 2.5, len: short, lane: 0 },
      { at: 3.5, len: short, lane: 0 },
      { at: 4.5, len: short, lane: 0 },
    ],
    spans: [
      { from: 0, to: 2.5, label: "max(d, 2.5·d)" },
      { from: 2.5, to: 3.5, label: "d" },
      { from: 3.5, to: 4.5, label: "d" },
    ],
  },
  {
    // Starts on the grid start + k·d; each run in its own task.
    name: "AfterStart",
    top: 230,
    overlaps: true,
    runs: [
      { at: 0, len: long, lane: 0 },
      { at: 1, len: short, lane: 1 },
      { at: 2, len: short, lane: 1 },
      { at: 3, len: short, lane: 0 },
      { at: 4, len: short, lane: 0 },
      { at: 5, len: short, lane: 0 },
    ],
    spans: [0, 1, 2, 3, 4].map((k) => ({ from: k, to: k + 1, label: "d" })),
  },
];

const laneY = (row: Row, lane: 0 | 1) => row.top + 38 + lane * 34;

function SpanMark({ span, y }: { span: Span; y: number }) {
  const x1 = x(span.from) + 1;
  const x2 = x(span.to) - 1;
  return (
    <g>
      <path
        d={`M${x1},${y + 5} L${x1},${y} L${x2},${y} L${x2},${y + 5}`}
        fill="none"
        stroke={muted}
        strokeWidth={1.2}
      />
      <text
        x={(x1 + x2) / 2}
        y={y - 5}
        fontSize={12}
        fontFamily={mono}
        fill={muted}
        textAnchor="middle"
      >
        {span.label}
      </text>
    </g>
  );
}

export function CronScheduleDiagram({ lang = "en" }: { lang?: "en" | "ja" }) {
  const t = text[lang];
  const afterStart = rows[2];
  const overlapY = laneY(afterStart, 1) + barH + 10;

  return (
    <figure className="waku-diagram">
      <svg
        viewBox="0 0 900 450"
        role="img"
        aria-labelledby="cron-schedule-title"
      >
        <title id="cron-schedule-title">{t.title}</title>
        <defs>
          <marker
            id="cron-schedule-arrow"
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

        <text x={20} y={28} fontSize={14} fontFamily="inherit" fill={fg}>
          {t.header}
        </text>

        {/* Row separators */}
        {[140, 230].map((y) => (
          <line
            key={y}
            x1={20}
            y1={y}
            x2={880}
            y2={y}
            stroke={border}
            strokeWidth={1}
          />
        ))}

        {/* Grid lines at k·d, shared by all rows */}
        {[0, 1, 2, 3, 4, 5].map((k) => (
          <line
            key={k}
            x1={x(k)}
            y1={50}
            x2={x(k)}
            y2={axisY}
            stroke={muted}
            strokeOpacity={0.45}
            strokeDasharray="3 4"
          />
        ))}

        {rows.map((row) => (
          <g key={row.name}>
            {/* Variant, its rule, and whether runs overlap */}
            <text
              x={20}
              y={row.top + 26}
              fontSize={14}
              fontFamily={mono}
              fontWeight={700}
              fill={fg}
            >
              {`${row.name}(d)`}
            </text>
            <text
              x={20}
              y={row.top + 46}
              fontSize={12}
              fontFamily="inherit"
              fill={muted}
            >
              {t.rules[row.name]}
            </text>
            <text
              x={20}
              y={row.top + 66}
              fontSize={12}
              fontFamily="inherit"
              fontWeight={700}
              fill={row.overlaps ? warning : success}
            >
              {row.overlaps ? t.overlap : t.noOverlap}
            </text>

            {row.spans.map((span) => (
              <SpanMark key={span.from} span={span} y={row.top + 28} />
            ))}

            {row.runs.map((run) => {
              const color = run.failed ? error : teal;
              const y = laneY(row, run.lane);
              return (
                <g key={run.at}>
                  <rect
                    x={x(run.at)}
                    y={y}
                    width={x(run.at + run.len) - x(run.at)}
                    height={barH}
                    rx={4}
                    fill={color}
                    fillOpacity={0.3}
                    stroke={color}
                    strokeWidth={1.5}
                  />
                  {run.len === long && (
                    <text
                      x={x(run.at + run.len / 2)}
                      y={y + 16}
                      fontSize={12}
                      fontFamily="inherit"
                      fill={fg}
                      textAnchor="middle"
                    >
                      {`${t.firstRun} · 2.5·d`}
                    </text>
                  )}
                </g>
              );
            })}
          </g>
        ))}

        {/* AfterFinish: a failed run does not move the schedule */}
        <text
          x={x(3.625)}
          y={laneY(rows[0], 0) + barH + 17}
          fontSize={12}
          fontFamily="inherit"
          fill={error}
          textAnchor="middle"
        >
          {t.errKept}
        </text>

        {/* AtLeast: a long run is followed at once */}
        <text
          x={x(2.5)}
          y={laneY(rows[1], 0) + barH + 17}
          fontSize={12}
          fontFamily="inherit"
          fill={fg}
          textAnchor="middle"
        >
          {t.atOnce}
        </text>

        {/* AfterStart: overlapping runs on a second lane */}
        <path
          d={`M${x(1)},${overlapY - 5} L${x(1)},${overlapY} L${x(long)},${overlapY} L${x(long)},${overlapY - 5}`}
          fill="none"
          stroke={warning}
          strokeWidth={1.5}
        />
        <text
          x={x((1 + long) / 2)}
          y={overlapY + 16}
          fontSize={12}
          fontFamily="inherit"
          fill={warning}
          textAnchor="middle"
        >
          {t.overlapping}
        </text>

        {/* Time axis in units of d */}
        <path
          d={`M${x(0) - 20},${axisY} L870,${axisY}`}
          stroke={muted}
          strokeWidth={1.5}
          markerEnd="url(#cron-schedule-arrow)"
        />
        <text
          x={870}
          y={axisY - 8}
          fontSize={13}
          fontFamily="inherit"
          fill={muted}
          textAnchor="end"
        >
          {t.time}
        </text>
        {[0, 1, 2, 3, 4, 5].map((k) => (
          <g key={k}>
            <line
              x1={x(k)}
              y1={axisY - 5}
              x2={x(k)}
              y2={axisY + 5}
              stroke={muted}
              strokeWidth={1.5}
            />
            <text
              x={x(k)}
              y={axisY + 22}
              fontSize={13}
              fontFamily={mono}
              fill={muted}
              textAnchor="middle"
            >
              {k === 0 ? "start" : k === 1 ? "d" : `${k}d`}
            </text>
          </g>
        ))}

        {/* Legend */}
        <g fontSize={13} fontFamily="inherit" fill={muted}>
          <rect
            x={20}
            y={legendY - 12}
            width={26}
            height={14}
            rx={3}
            fill={teal}
            fillOpacity={0.3}
            stroke={teal}
          />
          <text x={54} y={legendY}>
            {t.legendRun}
          </text>
          <rect
            x={120}
            y={legendY - 12}
            width={26}
            height={14}
            rx={3}
            fill={error}
            fillOpacity={0.3}
            stroke={error}
          />
          <text x={154} y={legendY}>
            {t.legendFailed}
          </text>
        </g>
      </svg>
      <figcaption>{t.caption}</figcaption>
    </figure>
  );
}
