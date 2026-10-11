import type { ReactNode } from "react";

const text = {
  en: {
    title: "What the consumer does for each ErrorClass a handler returns",
    caption:
      "Transient blocks the partition and retries in place, Unrecoverable drops one chunk, and Retryable moves the key to the retry topic so its order is kept.",
    chunk: "chunk",
    again: "wait, then again",
    transient: [
      "retries the same chunk in place,",
      "waiting retry_delays between tries;",
      "the last delay repeats until success.",
      "The whole partition waits meanwhile.",
    ],
    unrecoverable: [
      "the chunk is dropped and logged;",
      "the rest of the run continues.",
      "Use it for events that can never",
      "succeed.",
    ],
    retryable: [
      "the key’s unfinished work moves to",
      "retry_<topic> and the key is",
      "quarantined; it is retried after",
      "each retry_delays entry (below).",
    ],
    dropped: "dropped",
    detail: "Retryable, step by step (key UserId(7), partition 2)",
    main: "main partition",
    retry: "retry partition",
    nextPoll: "next poll",
    done: "done",
    failed: "fails",
    notRun: "not run",
    diverted: "diverted",
    unfinished: "unfinished work, already reduced",
    follows: "quarantined: later events follow",
    attempts: "attempts",
    failure: "failure",
    attempt: "attempt",
    drop: "drop failed runs",
    success: "any attempt that succeeds resolves its records",
    notes: [
      "Each attempt plans and runs every pending retry record of the key again, in log order.",
      "A successful attempt resolves its records; once none are left, the key leaves quarantine.",
      "If the last attempt fails, the failed runs are dropped and logged; the key’s later records go on.",
      "Default retry_delays = DEFAULT_RETRY_DELAYS (2 s, 4 s, 8 s, 16 s). Past max_pending_retry, new failures are dropped.",
    ],
  },
  ja: {
    title: "ハンドラーが返す ErrorClass ごとのコンシューマの動作",
    caption:
      "Transient はパーティションを止めてその場で再試行し、Unrecoverable は 1 チャンクだけ破棄し、Retryable は順序を保ったままキーをリトライトピックへ移します。",
    chunk: "チャンク",
    again: "待って再試行",
    transient: [
      "同じチャンクをその場で再試行。",
      "試行の間に retry_delays だけ待ち、",
      "最後の遅延を成功まで繰り返します。",
      "その間パーティション全体が止まります。",
    ],
    unrecoverable: [
      "チャンクを破棄してログに記録し、",
      "run の残りは続行します。",
      "何度試しても成功しないイベント",
      "に使います。",
    ],
    retryable: [
      "キーの未完了の処理を retry_<topic>",
      "へ移し、キーを隔離します。",
      "retry_delays の各値の後に",
      "再試行します（下図）。",
    ],
    dropped: "破棄",
    detail: "Retryable の流れ（キー UserId(7)、パーティション 2）",
    main: "メインパーティション",
    retry: "リトライパーティション",
    nextPoll: "次のポーリング",
    done: "完了",
    failed: "失敗",
    notRun: "未実行",
    diverted: "迂回",
    unfinished: "未完了の処理（縮約済み）",
    follows: "隔離中: 後続イベントも続く",
    attempts: "再試行",
    failure: "失敗",
    attempt: "試行",
    drop: "失敗した run を破棄",
    success: "どの試行でも成功すればレコードは解決済み",
    notes: [
      "各試行では、そのキーの保留中のリトライレコードをすべてログ順に計画し直して実行します。",
      "成功した試行のレコードは解決済みになり、残りがなくなるとキーの隔離が解除されます。",
      "最後の試行も失敗すると、失敗した run を破棄してログに記録し、キーの後続レコードは続行します。",
      "retry_delays の既定値は DEFAULT_RETRY_DELAYS（2・4・8・16 秒）。max_pending_retry を超えた新しい失敗は破棄されます。",
    ],
  },
} as const;

const mono = "var(--font-mono, ui-monospace, monospace)";
const fg = "var(--color-fd-foreground)";
const muted = "var(--color-fd-muted-foreground)";
const border = "var(--color-fd-border)";
const card = "var(--color-fd-card)";
const teal = "var(--color-waku-teal)";
const warning = "var(--color-fd-warning)";
const error = "var(--color-fd-error)";
const info = "var(--color-fd-info)";
const success = "var(--color-fd-success)";

function T({
  x,
  y,
  children,
  size = 14,
  anchor = "start",
  color = fg,
  code = false,
  weight,
}: {
  x: number;
  y: number;
  children: ReactNode;
  size?: number;
  anchor?: "start" | "middle" | "end";
  color?: string;
  code?: boolean;
  weight?: number;
}) {
  return (
    <text
      x={x}
      y={y}
      fontSize={size}
      textAnchor={anchor}
      fill={color}
      fontFamily={code ? mono : "inherit"}
      fontWeight={weight}
    >
      {children}
    </text>
  );
}

/** Code identifiers inside translated text are set in monospace. */
const codeWords =
  /(retry_delays|retry_<topic>|DEFAULT_RETRY_DELAYS|max_pending_retry|UserId\(7\)|Retryable|Transient|Unrecoverable|ErrorClass)/;

function Rich({ line }: { line: string }) {
  return (
    <>
      {line.split(codeWords).map((part, i) =>
        codeWords.test(part) ? (
          <tspan key={i} fontFamily={mono}>
            {part}
          </tspan>
        ) : (
          part
        ),
      )}
    </>
  );
}

function Chip({
  x,
  y,
  label,
  color,
  w = 44,
  struck = false,
}: {
  x: number;
  y: number;
  label?: string;
  color: string;
  w?: number;
  struck?: boolean;
}) {
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={w}
        height={30}
        rx={6}
        fill={color}
        fillOpacity={label ? 0.3 : 0.15}
        stroke={color}
        strokeWidth={label ? 1.5 : 1}
        strokeDasharray={struck ? "4 3" : undefined}
      />
      {label && (
        <T x={x + w / 2} y={y + 20} anchor="middle" code size={13}>
          {label}
        </T>
      )}
      {struck && (
        <line
          x1={x + 4}
          y1={y + 26}
          x2={x + w - 4}
          y2={y + 4}
          stroke={error}
          strokeWidth={2}
        />
      )}
    </g>
  );
}

function Arrow({ d, color = muted }: { d: string; color?: string }) {
  return (
    <path
      d={d}
      fill="none"
      stroke={color}
      strokeWidth={1.5}
      markerEnd="url(#retry-arrow)"
    />
  );
}

const panelW = 280;
const laneMain = 284;
const laneRetry = 384;
const chipStep = 52;
const chipsX = 210;

export function RetryDiagram({ lang = "en" }: { lang?: "en" | "ja" }) {
  const t = text[lang];
  const panels = [
    { name: "Transient", color: warning, lines: t.transient },
    { name: "Unrecoverable", color: error, lines: t.unrecoverable },
    { name: "Retryable", color: info, lines: t.retryable },
  ];
  const other = muted;
  // Main partition: batch n, then the next poll.
  const mainChips: {
    label?: string;
    key?: string;
    status?: string;
    statusColor?: string;
  }[] = [
    {},
    { label: "e1", status: t.done, statusColor: success },
    {},
    { label: "e2", status: t.failed, statusColor: error },
    { label: "e3", status: t.notRun, statusColor: muted },
    {},
  ];
  const nextChips: typeof mainChips = [
    {},
    { label: "e4", status: t.diverted, statusColor: info },
    {},
  ];
  const nextX = chipsX + mainChips.length * chipStep + 30;
  const timelineY = 492;
  const nodes = [
    t.failure,
    `${t.attempt} 1`,
    `${t.attempt} 2`,
    `${t.attempt} 3`,
    `${t.attempt} 4`,
    t.drop,
  ];
  const delays = ["2 s", "4 s", "8 s", "16 s"];
  const nodeX = (i: number) => 230 + i * 114;
  return (
    <figure className="waku-diagram">
      <svg viewBox="0 0 900 680" role="img" aria-labelledby="retry-title">
        <title id="retry-title">{t.title}</title>
        <defs>
          <marker
            id="retry-arrow"
            viewBox="0 0 10 10"
            refX="9"
            refY="5"
            markerWidth="7"
            markerHeight="7"
            orient="auto-start-reverse"
          >
            <path d="M0 0 L10 5 L0 10 z" fill={muted} />
          </marker>
        </defs>

        {/* The three classes */}
        {panels.map((panel, i) => {
          const x = 20 + i * (panelW + 10);
          return (
            <g key={panel.name}>
              <rect
                x={x}
                y={16}
                width={panelW}
                height={176}
                rx={10}
                fill={panel.color}
                fillOpacity={0.1}
                stroke={panel.color}
                strokeWidth={1.5}
              />
              <T x={x + 16} y={42} code weight={600}>
                {`ErrorClass::${panel.name}`}
              </T>
              {panel.lines.map((line, j) => (
                <T key={j} x={x + 16} y={110 + j * 19} size={13}>
                  <Rich line={line} />
                </T>
              ))}
            </g>
          );
        })}
        {/* Transient: the same chunk, again and again */}
        <Chip x={20 + 16} y={56} label={t.chunk} color={teal} w={80} />
        <path
          d="M 104 56 C 106 38, 150 40, 148 66 C 147 80, 136 80, 120 80"
          fill="none"
          stroke={warning}
          strokeWidth={1.75}
          markerEnd="url(#retry-arrow)"
        />
        <T x={154} y={76} size={13} color={muted}>
          {t.again}
        </T>
        {/* Unrecoverable: one chunk dropped */}
        {[0, 1, 2].map((i) => (
          <Chip
            key={i}
            x={310 + 16 + i * 60}
            y={56}
            label={i === 1 ? undefined : `#${i + 1}`}
            color={teal}
            w={52}
            struck={i === 1}
          />
        ))}
        <T x={310 + 16 + 180} y={76} size={13} color={error}>
          {t.dropped}
        </T>
        {/* Retryable: points at the detail below */}
        <Chip x={600 + 16} y={56} label={t.chunk} color={teal} w={80} />
        <Arrow d="M 700 71 H 730" color={info} />
        <T x={736} y={76} code size={13}>
          retry_&lt;topic&gt;
        </T>

        {/* Retryable in detail */}
        <rect
          x={20}
          y={210}
          width={860}
          height={456}
          rx={10}
          fill={card}
          stroke={border}
        />
        <T x={36} y={236} weight={600}>
          <Rich line={t.detail} />
        </T>

        <T x={36} y={laneMain + 4} size={13} color={muted}>
          {t.main}
        </T>
        <T x={36} y={laneMain + 22} code size={13}>
          users · 2
        </T>
        <T x={36} y={laneRetry + 4} size={13} color={muted}>
          {t.retry}
        </T>
        <T x={36} y={laneRetry + 22} code size={13}>
          retry_users · 2
        </T>

        {mainChips.map((chip, i) => {
          const x = chipsX + i * chipStep;
          return (
            <g key={i}>
              <Chip
                x={x}
                y={laneMain - 15}
                label={chip.label}
                color={chip.label ? teal : other}
              />
              {chip.status && (
                <T
                  x={x + 22}
                  y={laneMain - 22}
                  anchor="middle"
                  size={13}
                  color={chip.statusColor}
                >
                  {chip.status}
                </T>
              )}
            </g>
          );
        })}
        <line
          x1={nextX - 16}
          y1={laneMain - 60}
          x2={nextX - 16}
          y2={laneMain + 22}
          stroke={muted}
          strokeDasharray="4 3"
        />
        <T x={nextX - 8} y={laneMain - 48} size={13} color={muted}>
          {t.nextPoll}
        </T>
        {nextChips.map((chip, i) => {
          const x = nextX + i * chipStep;
          return (
            <g key={i}>
              <Chip
                x={x}
                y={laneMain - 15}
                label={chip.label}
                color={chip.label ? teal : other}
              />
              {chip.status && (
                <T
                  x={x + 22}
                  y={laneMain - 22}
                  anchor="middle"
                  size={13}
                  color={chip.statusColor}
                >
                  {chip.status}
                </T>
              )}
            </g>
          );
        })}

        {/* Into the retry partition */}
        {["e2", "e3", "e4"].map((label, i) => (
          <Chip
            key={label}
            x={chipsX + (3 + i) * chipStep}
            y={laneRetry - 15}
            label={`${label}′`}
            color={teal}
          />
        ))}
        <Arrow
          d={`M ${chipsX + 3 * chipStep + 22} ${laneMain + 16} V ${laneRetry - 18}`}
        />
        <Arrow
          d={`M ${chipsX + 4 * chipStep + 22} ${laneMain + 16} V ${laneRetry - 18}`}
        />
        <Arrow
          d={`M ${nextX + chipStep + 22} ${laneMain + 16} V ${laneRetry} H ${chipsX + 5 * chipStep + 48}`}
          color={info}
        />
        <T
          x={chipsX + 3 * chipStep - 10}
          y={laneMain + 56}
          anchor="end"
          size={13}
          color={muted}
        >
          {t.unfinished}
        </T>
        <T x={nextX + chipStep + 34} y={laneMain + 56} size={13} color={info}>
          {t.follows}
        </T>

        {/* Attempts */}
        <T x={36} y={timelineY + 5} size={13} color={muted}>
          {t.attempts}
        </T>
        <line
          x1={nodeX(0)}
          y1={timelineY}
          x2={nodeX(5)}
          y2={timelineY}
          stroke={border}
          strokeWidth={2}
        />
        {nodes.map((label, i) => {
          const x = nodeX(i);
          const last = i === nodes.length - 1;
          const color = i === 0 ? error : last ? error : warning;
          return (
            <g key={i}>
              <circle
                cx={x}
                cy={timelineY}
                r={9}
                fill={card}
                stroke={color}
                strokeWidth={2}
              />
              {!last && i > 0 && (
                <path
                  d={`M ${x - 4} ${timelineY - 4} l 8 8 M ${x + 4} ${timelineY - 4} l -8 8`}
                  stroke={color}
                  strokeWidth={1.75}
                />
              )}
              {last && (
                <line
                  x1={x - 4}
                  y1={timelineY}
                  x2={x + 4}
                  y2={timelineY}
                  stroke={color}
                  strokeWidth={2}
                />
              )}
              <T x={x} y={timelineY + 30} anchor="middle" size={13}>
                {label}
              </T>
              {i > 0 && i < 5 && (
                <T
                  x={x - 57}
                  y={timelineY - 14}
                  anchor="middle"
                  code
                  size={13}
                  color={muted}
                >
                  {`+${delays[i - 1]}`}
                </T>
              )}
            </g>
          );
        })}
        <path
          d={`M ${nodeX(1)} ${timelineY - 12} q 0 -30 30 -34`}
          fill="none"
          stroke={success}
          strokeWidth={1.5}
          strokeDasharray="3 3"
          markerEnd="url(#retry-arrow)"
        />
        <T x={nodeX(1) + 36} y={timelineY - 42} size={13} color={success}>
          {t.success}
        </T>
        <T
          x={nodeX(0) - 4}
          y={timelineY - 14}
          anchor="end"
          code
          size={13}
          color={muted}
        >
          retry_delays:
        </T>

        {/* Notes */}
        {t.notes.map((line, i) => (
          <T
            key={i}
            x={36}
            y={572 + i * 22}
            size={13}
            color={i === 3 ? muted : fg}
          >
            <Rich line={line} />
          </T>
        ))}
      </svg>
      <figcaption>{t.caption}</figcaption>
    </figure>
  );
}
