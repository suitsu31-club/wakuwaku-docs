import type { ReactNode } from "react";

const text = {
  en: {
    title: "What one partition task does with every polled batch",
    caption:
      "Each configured partition runs this loop in its own task. The handler’s ErrorClass decides what happens to a failed chunk.",
    loop: "One partition task, every loop iteration",
    poll: "Poll a batch",
    pollSub: ["up to poll_count records,", "after the due retry keys"],
    plan: "Plan by key",
    keys: "Keys, concurrently",
    key: "key",
    quarantined: "quarantined → retry",
    segments: "Per key, in order",
    segmentsSub: [
      "each segment: head run,",
      "body runs concurrently,",
      "tail run",
    ],
    decode: "Decode the run",
    decodeSub: ["undecodable records", "are dropped and logged"],
    reduce: "Reduce",
    reduceSub: ["with the type’s", "algebra marker"],
    chunk: "Split into chunks",
    chunkSub: ["of at most", "MAX_BATCH events"],
    handle: "Call the handler",
    handleSub: ["one chunk at a time"],
    outcomes: {
      ok: ["next chunk, then", "the next run"],
      transient: ["wait, retry the same chunk;", "the partition waits too"],
      unrecoverable: ["drop the chunk, log it,", "continue with the run"],
      retryable: ["stop the key; its unfinished", "work → retry_<topic>"],
    },
    offsets: "Then the offset is stored, as the DeliveryMode requires",
    noDouble: [
      "right after polling, before processing",
      "at most once: a crash can lose events",
    ],
    noLose: [
      "after every key is done, dropped or in retry",
      "at least once: a crash can replay events",
    ],
    defaultMode: "default",
  },
  ja: {
    title: "1 つのパーティションタスクがポーリングしたバッチを処理する流れ",
    caption:
      "設定した各パーティションが専用のタスクでこのループを回します。失敗したチャンクの扱いはハンドラーが返す ErrorClass で決まります。",
    loop: "1 つのパーティションタスクのループ 1 回分",
    poll: "バッチをポーリング",
    pollSub: ["最大 poll_count 件。期限の", "来たリトライキーの処理後"],
    plan: "キーごとに計画",
    keys: "キー同士は並行",
    key: "キー",
    quarantined: "隔離中 → リトライへ",
    segments: "キー内は順番に",
    segmentsSub: [
      "各セグメントで head の run、",
      "並行に body の run、",
      "最後に tail の run",
    ],
    decode: "run をデコード",
    decodeSub: ["デコードできないレコードは", "破棄してログに記録"],
    reduce: "縮約",
    reduceSub: ["型の代数マーカー", "に従って"],
    chunk: "チャンクに分割",
    chunkSub: ["1 チャンクは最大", "MAX_BATCH 件"],
    handle: "ハンドラーを呼ぶ",
    handleSub: ["1 チャンクずつ"],
    outcomes: {
      ok: ["次のチャンク、", "その後次の run へ"],
      transient: ["待機後に同じチャンクを再試行", "パーティション全体が待機"],
      unrecoverable: ["チャンクを破棄してログに", "記録し、run の続きへ"],
      retryable: ["キーを止め、未完了の処理を", "retry_<topic> へ送る"],
    },
    offsets: "その後、DeliveryMode に従ってオフセットを保存",
    noDouble: [
      "ポーリング直後、処理の前に保存",
      "最大 1 回: クラッシュでイベントを失い得る",
    ],
    noLose: [
      "全キーが完了・破棄・リトライ送りになった後",
      "最低 1 回: クラッシュで再処理され得る",
    ],
    defaultMode: "デフォルト",
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
  /(poll_count|MAX_BATCH|retry_<topic>|DeliveryMode|ErrorClass)/;

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

function Step({
  x,
  y,
  w,
  h,
  title,
  code,
  lines = [],
  color,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  title: string;
  code?: string;
  lines?: readonly string[];
  color?: string;
}) {
  const cx = x + w / 2;
  const ty = y + 24;
  // Detail lines start below the code line when there is one.
  const linesTop = code ? ty + 20 : ty;
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx={10}
        fill={color ?? card}
        fillOpacity={color ? 0.18 : 1}
        stroke={color ?? border}
        strokeWidth={color ? 1.5 : 1}
      />
      <T x={cx} y={ty} anchor="middle" weight={600}>
        {title}
      </T>
      {code && (
        <T x={cx} y={ty + 20} anchor="middle" code size={13} color={muted}>
          {code}
        </T>
      )}
      {lines.map((line, i) => (
        <T
          key={i}
          x={cx}
          y={linesTop + 20 + i * 18}
          anchor="middle"
          size={13}
          color={muted}
        >
          <Rich line={line} />
        </T>
      ))}
    </g>
  );
}

function Arrow({ d }: { d: string }) {
  return (
    <path
      d={d}
      fill="none"
      stroke={muted}
      strokeWidth={1.5}
      markerEnd="url(#consumer-pipeline-arrow)"
    />
  );
}

export function ConsumerPipelineDiagram({
  lang = "en",
}: {
  lang?: "en" | "ja";
}) {
  const t = text[lang];
  const outcomes = [
    { code: "Ok(())", lines: t.outcomes.ok, color: "var(--color-fd-success)" },
    {
      code: "Transient",
      lines: t.outcomes.transient,
      color: "var(--color-fd-warning)",
    },
    {
      code: "Unrecoverable",
      lines: t.outcomes.unrecoverable,
      color: "var(--color-fd-error)",
    },
    {
      code: "Retryable",
      lines: t.outcomes.retryable,
      color: "var(--color-fd-info)",
    },
  ];
  return (
    <figure className="waku-diagram">
      <svg
        viewBox="0 0 900 600"
        role="img"
        aria-labelledby="consumer-pipeline-title"
      >
        <title id="consumer-pipeline-title">{t.title}</title>
        <defs>
          <marker
            id="consumer-pipeline-arrow"
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

        <T x={20} y={22} size={13} color={muted} weight={600}>
          {t.loop}
        </T>

        {/* Row 1: poll, plan, keys, segments */}
        <Step x={20} y={36} w={190} h={110} title={t.poll} lines={t.pollSub} />
        <Arrow d="M 212 91 H 236" />
        <Step x={240} y={36} w={150} h={110} title={t.plan} code="Plan::new" />
        <Arrow d="M 392 91 H 416" />
        <rect
          x={420}
          y={36}
          width={200}
          height={110}
          rx={10}
          fill={card}
          stroke={border}
        />
        <T x={520} y={60} anchor="middle" weight={600}>
          {t.keys}
        </T>
        {[0, 1].map((k) => (
          <g key={k}>
            <rect
              x={436 + k * 88}
              y={74}
              width={80}
              height={26}
              rx={13}
              fill={k === 0 ? teal : purple}
              fillOpacity={0.3}
              stroke={k === 0 ? teal : purple}
              strokeWidth={1.5}
            />
            <T x={476 + k * 88} y={92} anchor="middle" size={13}>
              {`${t.key} ${k + 1}`}
            </T>
          </g>
        ))}
        <rect
          x={436}
          y={108}
          width={168}
          height={26}
          rx={13}
          fill="none"
          stroke={muted}
          strokeDasharray="4 3"
        />
        <T x={520} y={126} anchor="middle" size={13} color={muted}>
          {t.quarantined}
        </T>
        <Arrow d="M 622 91 H 646" />
        <Step
          x={650}
          y={36}
          w={230}
          h={110}
          title={t.segments}
          lines={t.segmentsSub}
        />

        {/* Row 2: decode, reduce, chunk, handle */}
        <Arrow d="M 765 148 V 168 H 115 V 190" />
        <Step
          x={20}
          y={194}
          w={190}
          h={92}
          title={t.decode}
          lines={t.decodeSub}
        />
        <Arrow d="M 212 240 H 236" />
        <Step
          x={240}
          y={194}
          w={170}
          h={92}
          title={t.reduce}
          lines={t.reduceSub}
        />
        <Arrow d="M 412 240 H 436" />
        <Step
          x={440}
          y={194}
          w={190}
          h={92}
          title={t.chunk}
          lines={t.chunkSub}
        />
        <Arrow d="M 632 240 H 656" />
        <Step
          x={660}
          y={194}
          w={220}
          h={92}
          title={t.handle}
          code="EventHandler::handle"
          lines={t.handleSub}
          color={primary}
        />

        {/* Row 3: outcomes */}
        <path
          d="M 770 288 V 322"
          stroke={muted}
          strokeWidth={1.5}
          fill="none"
        />
        <path
          d="M 115 322 H 775"
          stroke={muted}
          strokeWidth={1.5}
          fill="none"
        />
        <T x={450} y={312} anchor="middle" code size={13} color={muted}>
          HandleError::class()
        </T>
        {outcomes.map((o, i) => {
          const x = 20 + i * 220;
          return (
            <g key={o.code}>
              <Arrow d={`M ${x + 95} 322 V 338`} />
              <rect
                x={x}
                y={342}
                width={200}
                height={92}
                rx={10}
                fill={o.color}
                fillOpacity={0.12}
                stroke={o.color}
                strokeWidth={1.5}
              />
              <T x={x + 100} y={366} anchor="middle" code weight={600}>
                {o.code}
              </T>
              {o.lines.map((line, j) => (
                <T
                  key={j}
                  x={x + 100}
                  y={390 + j * 19}
                  anchor="middle"
                  size={13}
                >
                  <Rich line={line} />
                </T>
              ))}
            </g>
          );
        })}

        {/* Row 4: offsets */}
        <T x={20} y={474} weight={600}>
          <Rich line={t.offsets} />
        </T>
        {[
          { mode: "NoDoubleConsume", lines: t.noDouble, isDefault: false },
          { mode: "NoEventLose", lines: t.noLose, isDefault: true },
        ].map((m, i) => {
          const x = 20 + i * 440;
          return (
            <g key={m.mode}>
              <rect
                x={x}
                y={486}
                width={420}
                height={96}
                rx={10}
                fill={card}
                stroke={border}
              />
              <T x={x + 16} y={510} code weight={600}>
                {m.mode}
              </T>
              {m.isDefault && (
                <T x={x + 124} y={510} size={13} color={muted}>
                  {`(${t.defaultMode})`}
                </T>
              )}
              <T x={x + 16} y={534} size={13}>
                {m.lines[0]}
              </T>
              <T x={x + 16} y={556} size={13} color={muted}>
                {m.lines[1]}
              </T>
            </g>
          );
        })}
      </svg>
      <figcaption>{t.caption}</figcaption>
    </figure>
  );
}
