import type { ReactNode } from "react";

const text = {
  en: {
    title:
      "How a published event travels from the Publisher to a consumer task",
    caption:
      "The key type names the topic, the key hash picks the partition, and every configured partition is read by its own task.",
    publisher: "publish(event)",
    route: "picks the partition",
    sameKey: "equal keys ⇒",
    sameKey2: "same partition",
    stream: "stream",
    topic: "topic",
    partition: "partition",
    consumer: "one task per",
    consumer2: "configured partition",
    task: "task",
    message: "Every message carries headers next to its body",
    tag: "event type tag (u32)",
    key: "key hash (u64)",
    props: "ordering + algebra marker",
    body: "event body,",
    body2: "serialized",
  },
  ja: {
    title: "Publisher から発行されたイベントがコンシューマのタスクに届くまで",
    caption:
      "キー型がトピックを、キーのハッシュがパーティションを決め、設定した各パーティションを専用のタスクが読みます。",
    publisher: "publish(event)",
    route: "でパーティションを選択",
    sameKey: "同じキー ⇒",
    sameKey2: "同じパーティション",
    stream: "ストリーム",
    topic: "トピック",
    partition: "パーティション",
    consumer: "設定したパーティション",
    consumer2: "ごとに 1 タスク",
    task: "タスク",
    message: "各メッセージは本文と一緒にヘッダーを持ちます",
    tag: "イベント型タグ (u32)",
    key: "キーのハッシュ (u64)",
    props: "順序 + 代数マーカー",
    body: "シリアライズされた",
    body2: "イベント本文",
  },
} as const;

const mono = "var(--font-mono, ui-monospace, monospace)";
const fg = "var(--color-fd-foreground)";
const muted = "var(--color-fd-muted-foreground)";
const border = "var(--color-fd-border)";
const card = "var(--color-fd-card)";
const primary = "var(--color-fd-primary)";
const teal = "var(--color-waku-teal)";
const purple = "var(--color-waku-purple)";
const blue = "var(--color-waku-blue)";

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

const cell = 26;
const rows = [138, 198, 258];
const logX = 396;
const logW = 266;

/** Cells already in each partition, and which published events land there. */
const logs: { old: number; added: string[] }[] = [
  { old: 3, added: [purple] },
  { old: 4, added: [] },
  { old: 2, added: [teal, teal] },
];

const events = [
  { key: "UserId(7)", color: teal, y: 138, to: 2 },
  { key: "UserId(42)", color: purple, y: 198, to: 0 },
  { key: "UserId(7)", color: teal, y: 258, to: 2 },
];

export function EventFlowDiagram({ lang = "en" }: { lang?: "en" | "ja" }) {
  const t = text[lang];
  return (
    <figure className="waku-diagram">
      <svg viewBox="0 0 900 480" role="img" aria-labelledby="event-flow-title">
        <title id="event-flow-title">{t.title}</title>
        <defs>
          <marker
            id="event-flow-arrow"
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

        {/* Publisher */}
        <rect
          x={20}
          y={40}
          width={170}
          height={260}
          rx={10}
          fill={card}
          stroke={border}
        />
        <T x={105} y={66} anchor="middle" code weight={600}>
          Publisher
        </T>
        <T x={105} y={86} anchor="middle" code color={muted} size={13}>
          {t.publisher}
        </T>
        {events.map((e, i) => (
          <g key={i}>
            <rect
              x={34}
              y={e.y - 18}
              width={142}
              height={36}
              rx={8}
              fill={e.color}
              fillOpacity={0.28}
              stroke={e.color}
              strokeWidth={1.5}
            />
            <T x={105} y={e.y + 5} anchor="middle" code size={13}>
              {`key: ${e.key}`}
            </T>
          </g>
        ))}

        {/* Routing */}
        <T x={275} y={70} anchor="middle" code size={13}>
          key_hash(&amp;key)
        </T>
        <T x={275} y={88} anchor="middle" color={muted} size={13}>
          {t.route}
        </T>
        {events.map((e, i) => (
          <line
            key={i}
            x1={178}
            y1={e.y}
            x2={logX - 6}
            y2={rows[e.to]}
            stroke={e.color}
            strokeWidth={1.75}
            markerEnd="url(#event-flow-arrow)"
          />
        ))}
        <T x={275} y={306} anchor="middle" color={muted} size={13}>
          {t.sameKey}
        </T>
        <T x={275} y={324} anchor="middle" color={muted} size={13}>
          {t.sameKey2}
        </T>

        {/* Stream and topic */}
        <rect
          x={360}
          y={24}
          width={330}
          height={300}
          rx={12}
          fill="none"
          stroke={muted}
          strokeDasharray="5 4"
        />
        <T x={376} y={45} color={muted} size={13}>
          {t.stream} <tspan fontFamily={mono}>&quot;shop&quot;</tspan>
        </T>
        <rect
          x={378}
          y={58}
          width={298}
          height={250}
          rx={10}
          fill={blue}
          fillOpacity={0.18}
          stroke={blue}
          strokeWidth={1.5}
        />
        <T x={394} y={81}>
          {t.topic} <tspan fontFamily={mono}>&quot;users&quot;</tspan>
        </T>
        <T x={394} y={100} code size={13} color={muted}>
          = UserId::SUPER_PARTITION_NAME
        </T>
        {rows.map((y, p) => {
          const log = logs[p];
          const cells = [
            ...Array.from({ length: log.old }, () => null),
            ...log.added,
          ];
          return (
            <g key={p}>
              <rect
                x={logX}
                y={y - 20}
                width={logW}
                height={40}
                rx={6}
                fill={card}
                stroke={border}
              />
              {cells.map((color, i) => (
                <rect
                  key={i}
                  x={logX + 8 + i * (cell + 4)}
                  y={y - cell / 2}
                  width={cell}
                  height={cell}
                  rx={4}
                  fill={color ?? muted}
                  fillOpacity={color ? 0.45 : 0.2}
                  stroke={color ?? border}
                  strokeWidth={color ? 1.5 : 1}
                />
              ))}
              <T
                x={logX + logW - 10}
                y={y + 5}
                anchor="end"
                size={13}
                color={muted}
              >
                {`${t.partition} ${p}`}
              </T>
            </g>
          );
        })}

        {/* Consumer */}
        <rect
          x={710}
          y={40}
          width={170}
          height={260}
          rx={10}
          fill={card}
          stroke={border}
        />
        <T x={795} y={66} anchor="middle" code size={13} weight={600}>
          ConsumerConfig
        </T>
        <T x={795} y={86} anchor="middle" code size={13} color={muted}>
          partitions:
        </T>
        <T x={795} y={104} anchor="middle" code size={13} color={muted}>
          vec![0, 1, 2]
        </T>
        {rows.map((y, p) => (
          <g key={p}>
            <line
              x1={logX + logW + 2}
              y1={y}
              x2={720}
              y2={y}
              stroke={muted}
              strokeWidth={1.5}
              markerEnd="url(#event-flow-arrow)"
            />
            <rect
              x={724}
              y={y - 17}
              width={142}
              height={34}
              rx={8}
              fill={primary}
              fillOpacity={0.15}
              stroke={primary}
              strokeWidth={1.5}
            />
            <T x={795} y={y + 5} anchor="middle" size={13}>
              {`${t.task} · ${p}`}
            </T>
          </g>
        ))}
        <T x={795} y={322} anchor="middle" size={13} color={muted}>
          {t.consumer}
        </T>
        <T x={795} y={340} anchor="middle" size={13} color={muted}>
          {t.consumer2}
        </T>

        {/* Message anatomy */}
        <path
          d={`M ${logX + 8 + 3 * (cell + 4) + cell / 2} ${rows[2] + cell / 2} V 362`}
          stroke={teal}
          strokeWidth={1.5}
          strokeDasharray="4 3"
          fill="none"
        />
        <T x={20} y={366} weight={600}>
          {t.message}
        </T>
        {[
          { name: "wakuwaku-tag", lines: [t.tag], code: "E::TYPE_TAG" },
          { name: "wakuwaku-key", lines: [t.key], code: "key_hash(&key)" },
          {
            name: "wakuwaku-props",
            lines: [t.props],
            code: "EventAlgebraicProperties",
          },
          { name: "payload", lines: [t.body, t.body2], code: null },
        ].map((h, i) => {
          const x = 20 + i * 218;
          const isBody = h.name === "payload";
          return (
            <g key={h.name}>
              <rect
                x={x}
                y={378}
                width={208}
                height={90}
                rx={8}
                fill={isBody ? teal : card}
                fillOpacity={isBody ? 0.2 : 1}
                stroke={isBody ? teal : border}
                strokeWidth={isBody ? 1.5 : 1}
              />
              <T
                x={x + 104}
                y={402}
                anchor="middle"
                code
                size={13}
                weight={600}
              >
                {h.name}
              </T>
              {h.lines.map((line, j) => (
                <T
                  key={j}
                  x={x + 104}
                  y={426 + j * 20}
                  anchor="middle"
                  size={13}
                >
                  {line}
                </T>
              ))}
              {h.code && (
                <T
                  x={x + 104}
                  y={452}
                  anchor="middle"
                  code
                  size={13}
                  color={muted}
                >
                  {h.code}
                </T>
              )}
            </g>
          );
        })}
      </svg>
      <figcaption>{t.caption}</figcaption>
    </figure>
  );
}
