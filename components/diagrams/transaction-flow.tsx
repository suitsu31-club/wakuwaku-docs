const text = {
  en: {
    title: "A transaction as a pure state machine driven by drive()",
    legendPure: "pure value, no I/O",
    legendIo: "I/O performed by drive()",
    readOnly1: "starts READ ONLY when the",
    readOnly2: "flow’s effect never writes",
    toCaller: "to the caller",
    toHook: "to the AfterTransaction hook, if the flow ran",
    caption:
      "TxFlow decides every step; drive() only executes what the machine asks for and feeds the result back. A query error that aborts the transaction goes to aborted(); any other error goes to resume().",
  },
  ja: {
    title: "drive() が駆動する純粋な状態機械としてのトランザクション",
    legendPure: "純粋な値（I/O なし）",
    legendIo: "drive() が行う I/O",
    readOnly1: "作用が書き込みを含まなければ",
    readOnly2: "READ ONLY で開始",
    toCaller: "呼び出し側へ",
    toHook: "AfterTransaction フックへ（フローが走った場合）",
    caption:
      "各ステップを決めるのは TxFlow です。drive() は状態機械が求めたものを実行して結果を返すだけです。トランザクションを中断させるエラーは aborted() へ、それ以外のエラーは resume() へ渡されます。",
  },
} as const;

const mono = "var(--font-mono, ui-monospace, monospace)";
const fg = "var(--color-fd-foreground)";
const muted = "var(--color-fd-muted-foreground)";
const primary = "var(--color-fd-primary)";
const arrow = "url(#transaction-flow-arrow)";

function State({
  x,
  y,
  w,
  h,
  name,
  sub,
  color,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  name: string;
  sub: string;
  color: string;
}) {
  const cx = x + w / 2;
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx={10}
        fill={color}
        fillOpacity={0.25}
        stroke={color}
        strokeWidth={1.5}
      />
      <text
        x={cx}
        y={y + h / 2 - 4}
        textAnchor="middle"
        fontFamily={mono}
        fontSize={15}
        fontWeight={700}
        fill={fg}
      >
        {name}
      </text>
      <text
        x={cx}
        y={y + h / 2 + 16}
        textAnchor="middle"
        fontFamily={mono}
        fontSize={13}
        fill={muted}
      >
        {sub}
      </text>
    </g>
  );
}

function Io({
  cx,
  cy,
  w,
  label,
}: {
  cx: number;
  cy: number;
  w: number;
  label: string;
}) {
  return (
    <g>
      <rect
        x={cx - w / 2}
        y={cy - 17}
        width={w}
        height={34}
        rx={17}
        fill="var(--color-fd-card)"
        stroke={primary}
        strokeWidth={1.5}
        strokeDasharray="5 3"
      />
      <text
        x={cx}
        y={cy + 5}
        textAnchor="middle"
        fontFamily={mono}
        fontSize={13}
        fill={fg}
      >
        {label}
      </text>
    </g>
  );
}

function Label({
  x,
  y,
  children,
  anchor = "start",
}: {
  x: number;
  y: number;
  children: string;
  anchor?: "start" | "end" | "middle";
}) {
  return (
    <text
      x={x}
      y={y}
      textAnchor={anchor}
      fontFamily={mono}
      fontSize={13}
      fill={fg}
    >
      {children}
    </text>
  );
}

export function TransactionFlowDiagram({
  lang = "en",
}: {
  lang?: "en" | "ja";
}) {
  const t = text[lang];
  return (
    <figure className="waku-diagram">
      <svg
        viewBox="0 0 900 630"
        role="img"
        aria-labelledby="transaction-flow-title"
        fontFamily="inherit"
      >
        <title id="transaction-flow-title">{t.title}</title>
        <defs>
          <marker
            id="transaction-flow-arrow"
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

        {/* Legend */}
        <g fontSize={13} fill={fg}>
          <rect
            x={660}
            y={20}
            width={36}
            height={22}
            rx={6}
            fill="var(--color-waku-purple)"
            fillOpacity={0.25}
            stroke="var(--color-waku-purple)"
            strokeWidth={1.5}
          />
          <text x={706} y={36}>
            {t.legendPure}
          </text>
          <rect
            x={660}
            y={52}
            width={36}
            height={22}
            rx={11}
            fill="var(--color-fd-card)"
            stroke={primary}
            strokeWidth={1.5}
            strokeDasharray="5 3"
          />
          <text x={706} y={68}>
            {t.legendIo}
          </text>
        </g>

        {/* Query loop: TxFlow → Running → execute → Running → TxFlow */}
        <Io cx={500} cy={42} w={220} label="query.execute(&mut tx)" />
        <State
          x={400}
          y={104}
          w={200}
          h={60}
          name="Running"
          sub="TxMachine::Run"
          color="var(--color-waku-blue)"
        />
        <g>
          <rect
            x={390}
            y={214}
            width={220}
            height={84}
            rx={10}
            fill="var(--color-waku-purple)"
            fillOpacity={0.25}
            stroke="var(--color-waku-purple)"
            strokeWidth={1.5}
          />
          <text
            x={500}
            y={240}
            textAnchor="middle"
            fontFamily={mono}
            fontSize={15}
            fontWeight={700}
            fill={fg}
          >
            TxFlow
          </text>
          <text
            x={500}
            y={262}
            textAnchor="middle"
            fontFamily={mono}
            fontSize={13}
            fill={fg}
          >
            start() · resume(result)
          </text>
          <text
            x={500}
            y={282}
            textAnchor="middle"
            fontFamily={mono}
            fontSize={13}
            fill={fg}
          >
            aborted(error)
          </text>
        </g>

        <line
          x1={470}
          y1={104}
          x2={470}
          y2={63}
          stroke={muted}
          strokeWidth={1.5}
          markerEnd={arrow}
        />
        <Label x={462} y={90} anchor="end">
          F::Query
        </Label>
        <line
          x1={530}
          y1={59}
          x2={530}
          y2={100}
          stroke={muted}
          strokeWidth={1.5}
          markerEnd={arrow}
        />
        <Label x={538} y={90}>
          Result&lt;FlowOutput, sqlx::Error&gt;
        </Label>

        <line
          x1={470}
          y1={214}
          x2={470}
          y2={168}
          stroke={muted}
          strokeWidth={1.5}
          markerEnd={arrow}
        />
        <Label x={462} y={196} anchor="end">
          Step::Run
        </Label>
        <line
          x1={530}
          y1={164}
          x2={530}
          y2={210}
          stroke={muted}
          strokeWidth={1.5}
          markerEnd={arrow}
        />
        <Label x={538} y={196}>
          ran(result)
        </Label>

        {/* Begin */}
        <State
          x={20}
          y={226}
          w={130}
          h={60}
          name="Begin"
          sub="mode()"
          color="var(--color-waku-yellow)"
        />
        <line
          x1={150}
          y1={256}
          x2={168}
          y2={256}
          stroke={muted}
          strokeWidth={1.5}
          markerEnd={arrow}
        />
        <Io cx={245} cy={256} w={146} label="acquire + BEGIN" />
        <line
          x1={318}
          y1={256}
          x2={386}
          y2={256}
          stroke={muted}
          strokeWidth={1.5}
          markerEnd={arrow}
        />
        <Label x={352} y={246} anchor="middle">
          begun()
        </Label>
        <text x={20} y={312} fontSize={13} fill={muted}>
          {t.readOnly1}
        </text>
        <text x={20} y={330} fontSize={13} fill={muted}>
          {t.readOnly2}
        </text>
        <line
          x1={245}
          y1={273}
          x2={245}
          y2={521}
          stroke={muted}
          strokeWidth={1.5}
          markerEnd={arrow}
        />
        <Label x={237} y={440} anchor="end">
          failed()
        </Label>

        {/* Commit and rollback */}
        <line
          x1={450}
          y1={298}
          x2={420}
          y2={356}
          stroke={muted}
          strokeWidth={1.5}
          markerEnd={arrow}
        />
        <Label x={428} y={330} anchor="end">
          Step::Commit
        </Label>
        <line
          x1={560}
          y1={298}
          x2={622}
          y2={356}
          stroke={muted}
          strokeWidth={1.5}
          markerEnd={arrow}
        />
        <Label x={604} y={322}>
          Step::Rollback
        </Label>
        <Label x={622} y={340}>
          | aborted()
        </Label>

        <State
          x={320}
          y={360}
          w={180}
          h={56}
          name="Committing"
          sub="TxMachine::Commit"
          color="var(--color-waku-teal)"
        />
        <State
          x={550}
          y={360}
          w={180}
          h={56}
          name="RollingBack"
          sub="TxMachine::Rollback"
          color="var(--color-waku-pink)"
        />

        <line
          x1={410}
          y1={416}
          x2={410}
          y2={431}
          stroke={muted}
          strokeWidth={1.5}
          markerEnd={arrow}
        />
        <Io cx={410} cy={452} w={140} label="tx.commit()" />
        <line
          x1={410}
          y1={469}
          x2={410}
          y2={521}
          stroke={muted}
          strokeWidth={1.5}
          markerEnd={arrow}
        />
        <Label x={418} y={500}>
          committed(result)
        </Label>

        <line
          x1={640}
          y1={416}
          x2={640}
          y2={431}
          stroke={muted}
          strokeWidth={1.5}
          markerEnd={arrow}
        />
        <Io cx={640} cy={452} w={150} label="tx.rollback()" />
        <line
          x1={640}
          y1={469}
          x2={640}
          y2={521}
          stroke={muted}
          strokeWidth={1.5}
          markerEnd={arrow}
        />
        <Label x={648} y={500}>
          rolled_back()
        </Label>

        {/* Done */}
        <rect
          x={20}
          y={525}
          width={860}
          height={95}
          rx={10}
          fill="var(--color-fd-card)"
          stroke="var(--color-fd-border)"
          strokeWidth={1.5}
        />
        <text
          x={40}
          y={556}
          fontFamily={mono}
          fontSize={15}
          fontWeight={700}
          fill={fg}
        >
          Done
        </text>
        <text x={110} y={552} fontSize={13} fill={muted}>
          {t.toCaller}
        </text>
        <Label x={110} y={575}>
          Result&lt;TxOutput&lt;Commit, Abort&gt;, TxError&gt;
        </Label>
        <text x={110} y={598} fontFamily={mono} fontSize={13} fill={muted}>
          TxError::Begin | CommitRejected | CommitUnknown
        </text>
        <text x={510} y={552} fontSize={13} fill={muted}>
          {t.toHook}
        </text>
        <Label x={510} y={575}>
          Option&lt;TxFinalState&lt;Report&gt;&gt;
        </Label>
        <text x={510} y={598} fontFamily={mono} fontSize={13} fill={muted}>
          Committed | RolledBack | CommitUnknown
        </text>
      </svg>
      <figcaption>{t.caption}</figcaption>
    </figure>
  );
}
