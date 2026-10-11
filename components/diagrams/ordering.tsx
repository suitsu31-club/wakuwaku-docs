import type { ReactNode } from "react";

const text = {
  en: {
    title: "How the planner splits a polled batch into keys, segments and runs",
    caption:
      "Keys run concurrently. A key’s segments run one after another; inside a segment the head run goes first, the body runs concurrently, and the tail run last.",
    batch:
      "Polled batch, in log order (A, B, C are event types; the number is the log position)",
    plan: "planned by key",
    key: "key",
    segment: "segment",
    head: "head",
    body: "body · concurrent",
    tail: "tail",
    inOrder: "then",
    concurrent: "keys run concurrently",
    rules: [
      {
        code: "Acquire / AcqRel",
        fence: "acquire",
        desc: ["starts a new segment; its type’s run becomes the head"],
      },
      {
        code: "Release",
        fence: "release",
        desc: [
          "ends the segment; its type’s run becomes the tail (if that type already heads a",
          "segment holding other types, the Release event gets a segment of its own)",
        ],
      },
      {
        code: "Relaxed",
        fence: null,
        desc: [
          "joins the open segment; a run always keeps its events in log order",
        ],
      },
    ],
  },
  ja: {
    title:
      "プランナーがポーリングしたバッチをキー・セグメント・run に分ける様子",
    caption:
      "キー同士は並行に処理されます。1 つのキーのセグメントは順番に処理され、セグメント内では head の run、並行な body の run、tail の run の順に進みます。",
    batch:
      "ポーリングしたバッチ（ログ順。A・B・C はイベント型、数字はログ上の位置）",
    plan: "キーごとに計画",
    key: "キー",
    segment: "セグメント",
    head: "head",
    body: "body・並行",
    tail: "tail",
    inOrder: "次に",
    concurrent: "キー同士は並行",
    rules: [
      {
        code: "Acquire / AcqRel",
        fence: "acquire",
        desc: ["新しいセグメントを開始し、その型の run が head になります"],
      },
      {
        code: "Release",
        fence: "release",
        desc: [
          "セグメントを閉じ、その型の run が tail になります（その型が他の型を含む",
          "セグメントの head である場合、Release イベントは単独のセグメントになります）",
        ],
      },
      {
        code: "Relaxed",
        fence: null,
        desc: [
          "開いているセグメントに入ります。run 内のイベントは常にログ順を保ちます",
        ],
      },
    ],
  },
} as const;

const mono = "var(--font-mono, ui-monospace, monospace)";
const fg = "var(--color-fd-foreground)";
const muted = "var(--color-fd-muted-foreground)";
const border = "var(--color-fd-border)";
const card = "var(--color-fd-card)";
const teal = "var(--color-waku-teal)";
const purple = "var(--color-waku-purple)";
const acquire = "var(--color-fd-info)";
const release = "var(--color-fd-warning)";

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

type Fence = "acquire" | "release" | null;

/** The polled batch: key, type, and fence of every record in log order. */
const batch: { key: 0 | 1; type: string; fence: Fence }[] = [
  { key: 0, type: "A", fence: null },
  { key: 0, type: "B", fence: null },
  { key: 1, type: "A", fence: null },
  { key: 0, type: "A", fence: null },
  { key: 0, type: "C", fence: null },
  { key: 0, type: "B", fence: "release" },
  { key: 1, type: "C", fence: null },
  { key: 0, type: "A", fence: "acquire" },
  { key: 0, type: "B", fence: null },
  { key: 0, type: "C", fence: null },
  { key: 1, type: "A", fence: null },
  { key: 0, type: "A", fence: null },
  { key: 0, type: "B", fence: null },
];

const keyColors = [teal, purple];

type StageKind = "head" | "body" | "tail";
type Stage = { kind: StageKind; runs: string[][] };

/** The plan `Plan::new` builds for `batch` (see `partition/plan.rs`). */
const plan: Stage[][][] = [
  [
    [
      { kind: "body", runs: [["A1", "A4"], ["C5"]] },
      { kind: "tail", runs: [["B2", "B6"]] },
    ],
    [
      { kind: "head", runs: [["A8", "A12"]] },
      { kind: "body", runs: [["B9", "B13"], ["C10"]] },
    ],
  ],
  [[{ kind: "body", runs: [["A3", "A11"], ["C7"]] }]],
];

const chipW = 40;
const chipH = 28;
const stageW = 140;
const stageGap = 30;
const segPad = 14;
const segW = segPad * 2 + stageW * 2 + stageGap;
const segGap = 44;
const segH = 146;
const runH = 40;

function Chip({
  x,
  y,
  label,
  color,
}: {
  x: number;
  y: number;
  label: string;
  color: string;
}) {
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={chipW}
        height={chipH}
        rx={6}
        fill={color}
        fillOpacity={0.3}
        stroke={color}
        strokeWidth={1.5}
      />
      <T x={x + chipW / 2} y={y + chipH / 2 + 5} anchor="middle" code size={13}>
        {label}
      </T>
    </g>
  );
}

function StageColumn({
  x,
  y,
  stage,
  color,
  label,
}: {
  x: number;
  y: number;
  stage: Stage;
  color: string;
  label: string;
}) {
  const areaTop = y + 22;
  const areaH = runH * 2 + 8;
  const total = stage.runs.length * runH + (stage.runs.length - 1) * 8;
  const top = areaTop + (areaH - total) / 2;
  return (
    <g>
      <T x={x + stageW / 2} y={y + 12} anchor="middle" size={13} color={muted}>
        {label}
      </T>
      {stage.runs.map((run, i) => {
        const w = run.length * (chipW + 6) + 10;
        const rx = x + (stageW - w) / 2;
        const ry = top + i * (runH + 8);
        return (
          <g key={i}>
            <rect
              x={rx}
              y={ry}
              width={w}
              height={runH}
              rx={8}
              fill="none"
              stroke={muted}
              strokeDasharray="4 3"
            />
            {run.map((label, j) => (
              <Chip
                key={label}
                x={rx + 8 + j * (chipW + 6)}
                y={ry + (runH - chipH) / 2}
                label={label}
                color={color}
              />
            ))}
          </g>
        );
      })}
    </g>
  );
}

export function OrderingDiagram({ lang = "en" }: { lang?: "en" | "ja" }) {
  const t = text[lang];
  const stageLabel = { head: t.head, body: t.body, tail: t.tail };
  const rowsTop = 158;
  const rowStep = segH + 16;
  const legendTop = rowsTop + rowStep * 2 + 24;
  return (
    <figure className="waku-diagram">
      <svg viewBox="0 0 900 600" role="img" aria-labelledby="ordering-title">
        <title id="ordering-title">{t.title}</title>
        <defs>
          <marker
            id="ordering-arrow"
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

        {/* The batch */}
        <T x={20} y={28} size={13} color={muted}>
          {t.batch}
        </T>
        {batch.map((record, i) => {
          const x = 24 + i * 66;
          const color = keyColors[record.key];
          return (
            <g key={i}>
              <rect
                x={x}
                y={42}
                width={50}
                height={34}
                rx={6}
                fill={color}
                fillOpacity={0.3}
                stroke={color}
                strokeWidth={1.5}
              />
              <T x={x + 25} y={64} anchor="middle" code size={14}>
                {`${record.type}${i + 1}`}
              </T>
              {record.fence === "acquire" && (
                <>
                  <line
                    x1={x - 6}
                    y1={36}
                    x2={x - 6}
                    y2={82}
                    stroke={acquire}
                    strokeWidth={3}
                  />
                  <T
                    x={x + 25}
                    y={100}
                    anchor="middle"
                    code
                    size={13}
                    color={acquire}
                  >
                    Acquire
                  </T>
                </>
              )}
              {record.fence === "release" && (
                <>
                  <line
                    x1={x + 56}
                    y1={36}
                    x2={x + 56}
                    y2={82}
                    stroke={release}
                    strokeWidth={3}
                  />
                  <T
                    x={x + 25}
                    y={100}
                    anchor="middle"
                    code
                    size={13}
                    color={release}
                  >
                    Release
                  </T>
                </>
              )}
            </g>
          );
        })}
        <line
          x1={450}
          y1={108}
          x2={450}
          y2={140}
          stroke={muted}
          strokeWidth={1.5}
          markerEnd="url(#ordering-arrow)"
        />
        <T x={462} y={128} size={13} color={muted}>
          {t.plan} <tspan fontFamily={mono}>(Plan::new)</tspan>
        </T>

        {/* One row per key */}
        {plan.map((segments, k) => {
          const y = rowsTop + k * rowStep;
          const color = keyColors[k];
          return (
            <g key={k}>
              <rect
                x={20}
                y={y + segH / 2 - 16}
                width={70}
                height={32}
                rx={16}
                fill={color}
                fillOpacity={0.3}
                stroke={color}
                strokeWidth={1.5}
              />
              <T x={55} y={y + segH / 2 + 5} anchor="middle" size={13}>
                {`${t.key} ${k + 1}`}
              </T>
              {segments.map((stages, s) => {
                const sx = 110 + s * (segW + segGap);
                return (
                  <g key={s}>
                    <rect
                      x={sx}
                      y={y}
                      width={segW}
                      height={segH}
                      rx={10}
                      fill={card}
                      stroke={border}
                    />
                    <T x={sx + segPad} y={y + 20} size={13} weight={600}>
                      {`${t.segment} ${s}`}
                    </T>
                    {stages.map((stage, i) => (
                      <StageColumn
                        key={i}
                        x={sx + segPad + i * (stageW + stageGap)}
                        y={y + 30}
                        stage={stage}
                        color={color}
                        label={stageLabel[stage.kind]}
                      />
                    ))}
                    {stages.length === 2 && (
                      <line
                        x1={sx + segPad + stageW + 4}
                        y1={y + 30 + 22 + runH + 4}
                        x2={sx + segPad + stageW + stageGap - 4}
                        y2={y + 30 + 22 + runH + 4}
                        stroke={muted}
                        strokeWidth={1.5}
                        markerEnd="url(#ordering-arrow)"
                      />
                    )}
                    {s + 1 < segments.length && (
                      <>
                        <line
                          x1={sx + segW + 4}
                          y1={y + segH / 2}
                          x2={sx + segW + segGap - 4}
                          y2={y + segH / 2}
                          stroke={muted}
                          strokeWidth={1.5}
                          markerEnd="url(#ordering-arrow)"
                        />
                        <T
                          x={sx + segW + segGap / 2}
                          y={y + segH / 2 - 8}
                          anchor="middle"
                          size={13}
                          color={muted}
                        >
                          {t.inOrder}
                        </T>
                      </>
                    )}
                  </g>
                );
              })}
            </g>
          );
        })}
        <path
          d={`M ${116 + 2 * segW + segGap} ${rowsTop} h 10 V ${rowsTop + rowStep + segH} h -10`}
          fill="none"
          stroke={muted}
          strokeWidth={1.5}
        />
        <T
          x={110 + 2 * segW + segGap}
          y={rowsTop + rowStep + segH / 2 + 5}
          anchor="end"
          size={13}
          color={muted}
        >
          {t.concurrent}
        </T>

        {/* Rules */}
        {(() => {
          let y = legendTop;
          return t.rules.map((rule) => {
            const top = y;
            y += rule.desc.length * 20 + 8;
            const fenceColor =
              rule.fence === "acquire"
                ? acquire
                : rule.fence === "release"
                  ? release
                  : muted;
            return (
              <g key={rule.code}>
                <rect
                  x={20}
                  y={top - 13}
                  width={4}
                  height={rule.desc.length * 20 - 4}
                  fill={fenceColor}
                />
                <T x={32} y={top} code size={13} weight={600}>
                  {rule.code}
                </T>
                {rule.desc.map((line, i) => (
                  <T key={i} x={180} y={top + i * 20} size={13}>
                    {line}
                  </T>
                ))}
              </g>
            );
          });
        })()}
      </svg>
      <figcaption>{t.caption}</figcaption>
    </figure>
  );
}
