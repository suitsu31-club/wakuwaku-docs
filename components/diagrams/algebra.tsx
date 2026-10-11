import type { ReactNode } from "react";

const text = {
  en: {
    title:
      "How each algebra marker reduces a run before it reaches the handler",
    caption:
      "A run holds the events of one type, for one key, inside one segment. Applying the reduced run has the same effect as applying the original run.",
    marker: "Marker and law",
    before: "Run, in log order",
    after: "Passed to the handler",
    requires: "requires",
    noBound: "no extra bound",
    notes: {
      NonAssociative: "unchanged, applied in log order",
      Commutative: "unchanged, may be applied in any order",
      Idempotent: "adjacent equal events collapse",
      IdempotentCommutative: "sorted, then every duplicate collapses",
      Associative: "folded into one event",
    },
  },
  ja: {
    title: "各代数マーカーがハンドラーに渡す前の run をどう縮約するか",
    caption:
      "run は 1 つのセグメント内の、1 つのキー・1 つの型のイベントの並びです。縮約後の run を適用した結果は、元の run を適用した結果と同じです。",
    marker: "マーカーと法則",
    before: "run（ログ順）",
    after: "ハンドラーに渡される run",
    requires: "トレイト境界:",
    noBound: "追加のトレイト境界なし",
    notes: {
      NonAssociative: "そのまま。ログ順に適用",
      Commutative: "そのまま。任意の順序で適用可能",
      Idempotent: "隣り合う等しいイベントを 1 つに",
      IdempotentCommutative: "ソートしてすべての重複を 1 つに",
      Associative: "1 つのイベントに畳み込み",
    },
  },
} as const;

const mono = "var(--font-mono, ui-monospace, monospace)";
const fg = "var(--color-fd-foreground)";
const muted = "var(--color-fd-muted-foreground)";
const border = "var(--color-fd-border)";
const card = "var(--color-fd-card)";

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

type Marker = keyof (typeof text)["en"]["notes"];

/** Before/after of each marker's `Algebra::reduce`, as in `partition/algebra.rs` tests. */
const rows: {
  marker: Marker;
  law: string;
  bound: string | null;
  before: string[];
  after: string[];
  color: string;
}[] = [
  {
    marker: "NonAssociative",
    law: "no law",
    bound: null,
    before: ["1", "1", "2", "1", "1"],
    after: ["1", "1", "2", "1", "1"],
    color: "var(--color-waku-blue)",
  },
  {
    marker: "Commutative",
    law: "s·a·b = s·b·a",
    bound: null,
    before: ["1", "1", "2", "1", "1"],
    after: ["1", "1", "2", "1", "1"],
    color: "var(--color-waku-indigo)",
  },
  {
    marker: "Idempotent",
    law: "s·a·a = s·a",
    bound: "Eq",
    before: ["1", "1", "2", "1", "1"],
    after: ["1", "2", "1"],
    color: "var(--color-waku-purple)",
  },
  {
    marker: "IdempotentCommutative",
    law: "both of the above",
    bound: "Ord",
    before: ["1", "1", "2", "1", "1"],
    after: ["1", "2"],
    color: "var(--color-waku-pink)",
  },
  {
    marker: "Associative",
    law: "s·a·b = s·combine(a, b)",
    bound: "EventSemigroup",
    before: ["+10", "+5", "+3"],
    after: ["+18"],
    color: "var(--color-waku-teal)",
  },
];

const lawJa: Record<string, string> = {
  "no law": "法則なし",
  "both of the above": "上の 2 つの両方",
};

const chipW = 38;
const chipGap = 6;
const rowH = 86;
const top = 50;
const beforeX = 290;
const afterX = 600;

function Chips({
  x,
  y,
  values,
  color,
}: {
  x: number;
  y: number;
  values: readonly string[];
  color: string;
}) {
  return (
    <g>
      {values.map((value, i) => (
        <g key={i}>
          <rect
            x={x + i * (chipW + chipGap)}
            y={y}
            width={chipW}
            height={32}
            rx={6}
            fill={color}
            fillOpacity={0.3}
            stroke={color}
            strokeWidth={1.5}
          />
          <T
            x={x + i * (chipW + chipGap) + chipW / 2}
            y={y + 21}
            anchor="middle"
            code
            size={14}
          >
            {value}
          </T>
        </g>
      ))}
    </g>
  );
}

export function AlgebraDiagram({ lang = "en" }: { lang?: "en" | "ja" }) {
  const t = text[lang];
  return (
    <figure className="waku-diagram">
      <svg viewBox="0 0 900 490" role="img" aria-labelledby="algebra-title">
        <title id="algebra-title">{t.title}</title>
        <defs>
          <marker
            id="algebra-arrow"
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

        <T x={32} y={32} size={13} color={muted} weight={600}>
          {t.marker}
        </T>
        <T x={beforeX} y={32} size={13} color={muted} weight={600}>
          {t.before}
        </T>
        <T x={afterX} y={32} size={13} color={muted} weight={600}>
          {t.after}
        </T>

        {rows.map((row, i) => {
          const y = top + i * rowH;
          const law = lang === "ja" ? (lawJa[row.law] ?? row.law) : row.law;
          const lawIsCode = !(row.law in lawJa);
          return (
            <g key={row.marker}>
              <rect
                x={20}
                y={y}
                width={860}
                height={rowH - 8}
                rx={10}
                fill={card}
                stroke={border}
              />
              <rect
                x={20}
                y={y}
                width={5}
                height={rowH - 8}
                rx={2}
                fill={row.color}
              />
              <T x={36} y={y + 24} code weight={600}>
                {row.marker}
              </T>
              <T x={36} y={y + 44} code={lawIsCode} size={13} color={muted}>
                {law}
              </T>
              <T x={36} y={y + 64} size={13} color={muted}>
                {row.bound ? (
                  <>
                    {t.requires} <tspan fontFamily={mono}>{row.bound}</tspan>
                  </>
                ) : (
                  t.noBound
                )}
              </T>

              <Chips
                x={beforeX}
                y={y + 14}
                values={row.before}
                color={row.color}
              />
              <line
                x1={530}
                y1={y + 30}
                x2={580}
                y2={y + 30}
                stroke={muted}
                strokeWidth={1.5}
                markerEnd="url(#algebra-arrow)"
              />
              {row.marker === "Associative" && (
                <T
                  x={555}
                  y={y + 64}
                  anchor="middle"
                  code
                  size={13}
                  color={muted}
                >
                  combine
                </T>
              )}
              <Chips
                x={afterX}
                y={y + 14}
                values={row.after}
                color={row.color}
              />
              <T x={afterX} y={y + 66} size={13} color={muted}>
                {t.notes[row.marker]}
              </T>
            </g>
          );
        })}
      </svg>
      <figcaption>{t.caption}</figcaption>
    </figure>
  );
}
