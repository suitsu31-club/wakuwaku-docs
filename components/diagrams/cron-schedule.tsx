const text = {
  en: {
    title:
      "Cron schedule: runs start on the grid start + k · INTERVAL; an overrunning run skips the grid points it covers, and errors or panics are logged without changing the schedule",
    grid: "Grid:",
    noOverlap: "Runs of one job never overlap",
    time: "time",
    errLogged: "Err → logged",
    panicLogged: "panic → logged",
    overrun: "longer than INTERVAL",
    skipped: "skipped",
    next: "next run: first grid point not before the end",
    legendRun: "run",
    legendFailed: "Err or panic, logged with tracing",
    legendStart: "run starts",
    legendSkipped: "skipped grid point",
    caption:
      "The first run is at start. Consecutive runs start a whole, non-zero number of intervals apart.",
  },
  ja: {
    title:
      "cron のスケジュール: 実行は start + k · INTERVAL の格子点で始まり、長引いた実行が覆った格子点はスキップされ、エラーやパニックはログに残るだけでスケジュールは変わらない",
    grid: "格子点:",
    noOverlap: "同じジョブの実行は重ならない",
    time: "時間",
    errLogged: "Err → ログ",
    panicLogged: "panic → ログ",
    overrun: "INTERVAL より長い",
    skipped: "スキップ",
    next: "次の実行: 終了時刻より前でない最初の格子点",
    legendRun: "実行",
    legendFailed: "Err やパニック (tracing でログ)",
    legendStart: "実行開始",
    legendSkipped: "スキップした格子点",
    caption:
      "最初の実行は start の時点です。連続する実行の開始は、必ず 1 以上の整数個の間隔だけ離れます。",
  },
} as const;

const fg = "var(--color-fd-foreground)";
const muted = "var(--color-fd-muted-foreground)";
const card = "var(--color-fd-card)";
const mono = "var(--font-mono, ui-monospace, monospace)";
const teal = "var(--color-waku-teal)";
const error = "var(--color-fd-error)";
const warning = "var(--color-fd-warning)";
const primary = "var(--color-fd-primary)";
const axisY = 190;
const barY = 140;
const legendY = 334;
const barH = 26;
const gx = (k: number) => 80 + 90 * k;

type Run = { k: number; end: number; failed?: "err" | "panic" };

/** End x positions are drawn to scale against the 90-unit interval. */
const runs: Run[] = [
  { k: 0, end: gx(0) + 44 },
  { k: 1, end: gx(1) + 34, failed: "err" },
  { k: 2, end: gx(4) + 36 },
  { k: 5, end: gx(5) + 46 },
  { k: 6, end: gx(6) + 28, failed: "panic" },
  { k: 7, end: gx(7) + 42 },
];
const started = new Set(runs.map((r) => r.k));
const skipped = new Set([3, 4]);

export function CronScheduleDiagram({ lang = "en" }: { lang?: "en" | "ja" }) {
  const t = text[lang];
  const overrun = runs[2];

  return (
    <figure className="waku-diagram">
      <svg
        viewBox="0 0 900 350"
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

        <text x={20} y={32} fontSize={15} fontFamily="inherit" fill={fg}>
          <tspan fontWeight={700}>{t.grid}</tspan>
          <tspan fontFamily={mono}>{"\u00a0start + k · INTERVAL"}</tspan>
        </text>
        <text
          x={880}
          y={32}
          fontSize={14}
          fontFamily="inherit"
          fill={muted}
          textAnchor="end"
        >
          {t.noOverlap}
        </text>

        {/* Axis */}
        <path
          d={`M50,${axisY} L866,${axisY}`}
          stroke={muted}
          strokeWidth={1.5}
          markerEnd="url(#cron-schedule-arrow)"
        />
        <text
          x={866}
          y={axisY - 10}
          fontSize={13}
          fontFamily="inherit"
          fill={muted}
          textAnchor="end"
        >
          {t.time}
        </text>

        {/* Grid points */}
        {Array.from({ length: 9 }, (_, k) => {
          const x = gx(k);
          const isSkipped = skipped.has(k);
          const isStart = started.has(k);
          return (
            <g key={k}>
              {isStart && (
                <line
                  x1={x}
                  y1={barY + barH}
                  x2={x}
                  y2={axisY}
                  stroke={muted}
                  strokeDasharray="3 3"
                />
              )}
              <circle
                cx={x}
                cy={axisY}
                r={6}
                fill={isStart ? primary : card}
                stroke={isSkipped ? warning : isStart ? primary : muted}
                strokeWidth={2}
              />
              <text
                x={x}
                y={axisY + 24}
                fontSize={13}
                fontFamily={mono}
                fill={muted}
                textAnchor="middle"
              >
                {k === 0 ? "start" : `k=${k}`}
              </text>
              {isSkipped && (
                <text
                  x={x}
                  y={axisY + 44}
                  fontSize={13}
                  fontFamily="inherit"
                  fill={warning}
                  textAnchor="middle"
                >
                  {t.skipped}
                </text>
              )}
            </g>
          );
        })}

        {/* Runs */}
        {runs.map((r, i) => {
          const x = gx(r.k);
          const color = r.failed ? error : teal;
          return (
            <g key={r.k}>
              <rect
                x={x}
                y={barY}
                width={r.end - x}
                height={barH}
                rx={5}
                fill={color}
                fillOpacity={0.3}
                stroke={color}
                strokeWidth={1.5}
              />
              <text
                x={x + (r.end - x) / 2}
                y={barY - 8}
                fontSize={13}
                fontFamily={mono}
                fill={fg}
                textAnchor="middle"
              >
                {`run ${i}`}
              </text>
              {r.failed && (
                <text
                  x={x + (r.end - x) / 2}
                  y={barY - 28}
                  fontSize={13}
                  fontFamily="inherit"
                  fill={error}
                  textAnchor="middle"
                >
                  {r.failed === "err" ? t.errLogged : t.panicLogged}
                </text>
              )}
            </g>
          );
        })}

        {/* Overrun bracket */}
        <path
          d={`M${gx(overrun.k)},${barY - 30} L${gx(overrun.k)},${barY - 36} L${overrun.end},${barY - 36} L${overrun.end},${barY - 30}`}
          fill="none"
          stroke={warning}
          strokeWidth={1.5}
        />
        <text
          x={(gx(overrun.k) + overrun.end) / 2}
          y={barY - 44}
          fontSize={13}
          fontFamily="inherit"
          fill={warning}
          textAnchor="middle"
        >
          {t.overrun}
        </text>

        {/* Next run after the overrun */}
        <path
          d={`M${overrun.end},${barY + barH} L${overrun.end},${axisY + 66} L${gx(5)},${axisY + 66} L${gx(5)},${axisY + 32}`}
          fill="none"
          stroke={muted}
          strokeWidth={1.5}
          strokeDasharray="4 3"
          markerEnd="url(#cron-schedule-arrow)"
        />
        <text
          x={overrun.end}
          y={axisY + 88}
          fontSize={13}
          fontFamily="inherit"
          fill={fg}
          textAnchor="middle"
        >
          {t.next}
        </text>

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
          <circle
            cx={480}
            cy={legendY - 5}
            r={6}
            fill={primary}
            stroke={primary}
            strokeWidth={2}
          />
          <text x={494} y={legendY}>
            {t.legendStart}
          </text>
          <circle
            cx={640}
            cy={legendY - 5}
            r={6}
            fill={card}
            stroke={warning}
            strokeWidth={2}
          />
          <text x={654} y={legendY}>
            {t.legendSkipped}
          </text>
        </g>
      </svg>
      <figcaption>{t.caption}</figcaption>
    </figure>
  );
}
