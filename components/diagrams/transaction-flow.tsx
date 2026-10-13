import type { ReactNode } from "react";

const text = {
  en: {
    title:
      "A transaction: wakuwaku's protocol loop around your step() and finished()",
    legendCode: "your code: impl TxFlow",
    legendProtocol: "wakuwaku: the transaction protocol",
    legendAbort: "abort and failure",
    readOnly1: "READ ONLY when the flow's",
    readOnly2: "effect never writes",
    beginFails: "fails: TxError::Begin, no hook",
    terminal: "terminal",
    notTerminal: "not terminal",
    nextState: "next state",
    commitSub: "Commit, not aborted",
    rollbackSub: "Rollback, or aborted",
    runMore: "as often as needed; match on r",
    goOn: "tx.with(next): go on",
    endNow: "tx.end(next): end now if terminal",
    abort: [
      "If a query error ended the",
      "transaction on the server, the",
      "Tx is aborted: later run() calls",
      "are not sent, and a Commit ends",
      "in ROLLBACK + TxError::Aborted.",
    ],
    outcome: "outcome",
    colEnd: "how it ends",
    colCaller: "to the caller",
    colHook: "to the AfterTransaction hook",
    rCommitOk: "COMMIT succeeds",
    rCommitRejected: "COMMIT rejected by the server",
    rCommitLost: "COMMIT result lost",
    rRollback: "ROLLBACK for TxEnd::Rollback",
    rAborted: "ROLLBACK: Commit, but Tx aborted",
    rBeginFails: "acquire or BEGIN fails",
    notCalled: "not called",
    caption:
      "wakuwaku begins the transaction, then loops: tx.end(state) asks your finished() whether the state is terminal and, if it is, sends COMMIT or ROLLBACK; otherwise your step() runs queries with tx.run and hands back the next state with tx.with or tx.end. A query error that ended the transaction on the server marks the Tx aborted, so the flow can only roll back.",
  },
  ja: {
    title:
      "トランザクション：あなたの step() と finished() を囲む wakuwaku のプロトコルのループ",
    legendCode: "あなたのコード（impl TxFlow）",
    legendProtocol: "wakuwaku：トランザクションのプロトコル",
    legendAbort: "中断と失敗",
    readOnly1: "フローの作用が書き込まなければ",
    readOnly2: "READ ONLY で開始",
    beginFails: "失敗：TxError::Begin（フックなし）",
    terminal: "終端",
    notTerminal: "終端でない",
    nextState: "次の状態",
    commitSub: "Commit・未中断",
    rollbackSub: "Rollback か中断済み",
    runMore: "必要なだけ繰り返し、r で分岐",
    goOn: "tx.with(next)：続ける",
    endNow: "tx.end(next)：終端なら終了",
    abort: [
      "クエリのエラーがサーバー側で",
      "トランザクションを終わらせると",
      "Tx は中断済みになります。以降の",
      "run() は送信されず、Commit は",
      "ROLLBACK + TxError::Aborted に。",
    ],
    outcome: "結果",
    colEnd: "終わり方",
    colCaller: "呼び出し側へ",
    colHook: "AfterTransaction フックへ",
    rCommitOk: "COMMIT 成功",
    rCommitRejected: "サーバーが COMMIT を拒否",
    rCommitLost: "COMMIT の結果が失われた",
    rRollback: "TxEnd::Rollback による ROLLBACK",
    rAborted: "Commit だが Tx が中断済み → ROLLBACK",
    rBeginFails: "接続取得か BEGIN が失敗",
    notCalled: "呼ばれない",
    caption:
      "wakuwaku がトランザクションを開始し、ループします。tx.end(state) はあなたの finished() で状態が終端かを確かめ、終端なら COMMIT か ROLLBACK を送ります。終端でなければ、あなたの step() が tx.run でクエリを実行し、tx.with か tx.end で次の状態を返します。クエリのエラーがサーバー側でトランザクションを終わらせると Tx は中断済みになり、フローはロールバックしかできません。",
  },
} as const;

const mono = "var(--font-mono, ui-monospace, monospace)";
const fg = "var(--color-fd-foreground)";
const muted = "var(--color-fd-muted-foreground)";
const primary = "var(--color-fd-primary)";
const border = "var(--color-fd-border)";
const card = "var(--color-fd-card)";
const purple = "var(--color-waku-purple)";
const error = "var(--color-fd-error)";

function T({
  x,
  y,
  children,
  size = 13,
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
  /(TxError::\w+|TxEnd::\w+|tx\.with\(next\)|tx\.end\(next\)|run\(\)|READ ONLY|COMMIT|ROLLBACK|BEGIN|\bCommit\b|\bRollback\b|\bTx\b)/;

function Rich({ line }: { line: string }) {
  return (
    <>
      {line.split(codeWords).map((part, i) =>
        i % 2 === 1 ? (
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

type Kind = "code" | "protocol" | "abort";

function Box({
  x,
  y,
  w,
  h,
  kind,
  rx = 10,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  kind: Kind;
  rx?: number;
}) {
  const style = {
    code: { fill: purple, fillOpacity: 0.25, stroke: purple, dash: undefined },
    protocol: { fill: card, fillOpacity: 1, stroke: primary, dash: "5 3" },
    abort: { fill: error, fillOpacity: 0.08, stroke: error, dash: undefined },
  }[kind];
  return (
    <rect
      x={x}
      y={y}
      width={w}
      height={h}
      rx={rx}
      fill={style.fill}
      fillOpacity={style.fillOpacity}
      stroke={style.stroke}
      strokeWidth={1.5}
      strokeDasharray={style.dash}
    />
  );
}

function Arrow({ d }: { d: string }) {
  return (
    <path
      d={d}
      fill="none"
      stroke={muted}
      strokeWidth={1.5}
      markerEnd="url(#transaction-flow-arrow)"
    />
  );
}

export function TransactionFlowDiagram({
  lang = "en",
}: {
  lang?: "en" | "ja";
}) {
  const t = text[lang];
  const legend: { kind: Kind; label: string; x: number }[] = [
    { kind: "code", label: t.legendCode, x: 20 },
    { kind: "protocol", label: t.legendProtocol, x: 300 },
    { kind: "abort", label: t.legendAbort, x: 640 },
  ];
  const rows: { end: string; caller: string; hook: string; failed: boolean }[] =
    [
      {
        end: t.rCommitOk,
        caller: "Ok(Committed(commit))",
        hook: "Committed(report)",
        failed: false,
      },
      {
        end: t.rCommitRejected,
        caller: "Err(CommitRejected(e))",
        hook: "RolledBack(report)",
        failed: true,
      },
      {
        end: t.rCommitLost,
        caller: "Err(CommitUnknown(e))",
        hook: "CommitUnknown(report)",
        failed: true,
      },
      {
        end: t.rRollback,
        caller: "Ok(RolledBack(abort))",
        hook: "RolledBack(report)",
        failed: false,
      },
      {
        end: t.rAborted,
        caller: "Err(Aborted)",
        hook: "RolledBack(report)",
        failed: true,
      },
      {
        end: t.rBeginFails,
        caller: "Err(Begin(e))",
        hook: "",
        failed: true,
      },
    ];
  const col = { end: 40, caller: 330, hook: 640 };
  return (
    <figure className="waku-diagram">
      <svg
        viewBox="0 0 900 720"
        role="img"
        aria-labelledby="transaction-flow-title"
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
            orient="auto-start-reverse"
          >
            <path d="M0 0 L10 5 L0 10 z" fill={muted} />
          </marker>
        </defs>

        {/* Legend */}
        {legend.map((item) => (
          <g key={item.kind}>
            <Box x={item.x} y={14} w={32} h={20} kind={item.kind} rx={5} />
            <T x={item.x + 42} y={29}>
              {item.label}
            </T>
          </g>
        ))}

        {/* Acquire a connection and BEGIN */}
        <T x={20} y={64} size={12} color={muted} code>
          process(Transaction(flow))
        </T>
        <Box x={20} y={76} w={180} h={38} kind="protocol" rx={19} />
        <T x={110} y={100} anchor="middle" code>
          acquire + BEGIN
        </T>
        <T x={20} y={140} size={12} color={muted} code>
          isolation: F::ISOLATION
        </T>
        <T x={20} y={158} size={12} color={muted}>
          <Rich line={t.readOnly1} />
        </T>
        <T x={20} y={175} size={12} color={muted}>
          <Rich line={t.readOnly2} />
        </T>
        <T x={20} y={198} size={12} color={error}>
          <Rich line={t.beginFails} />
        </T>
        <Arrow d="M 200 95 H 266" />
        <T x={233} y={87} anchor="middle" size={12} code>
          Tx
        </T>

        {/* The check: tx.end(state) asks finished() */}
        <Box x={270} y={58} w={220} h={74} kind="protocol" />
        <T x={380} y={82} anchor="middle" size={14} weight={700} code>
          tx.end(state)
        </T>
        <Box x={300} y={94} w={160} h={28} kind="code" rx={6} />
        <T x={380} y={113} anchor="middle" code>
          state.finished()
        </T>

        {/* Terminal: COMMIT or ROLLBACK */}
        <Arrow d="M 490 95 H 620 V 146" />
        <Arrow d="M 620 95 H 800 V 146" />
        <T x={498} y={88} size={12} code>
          Right(end)
        </T>
        <T x={498} y={112} size={12} color={muted}>
          {t.terminal}
        </T>
        <Box x={540} y={150} w={160} h={56} kind="protocol" />
        <T x={620} y={174} anchor="middle" size={14} weight={700} code>
          COMMIT
        </T>
        <T x={620} y={194} anchor="middle" size={12} color={muted}>
          <Rich line={t.commitSub} />
        </T>
        <Box x={720} y={150} w={160} h={56} kind="protocol" />
        <T x={800} y={174} anchor="middle" size={14} weight={700} code>
          ROLLBACK
        </T>
        <T x={800} y={194} anchor="middle" size={12} color={muted}>
          <Rich line={t.rollbackSub} />
        </T>
        <Arrow d="M 620 206 V 502" />
        <Arrow d="M 800 206 V 502" />
        <T x={710} y={480} anchor="middle" size={12} color={muted}>
          {t.outcome}
        </T>

        {/* Not terminal: step, then back to the check */}
        <Arrow d="M 340 132 V 186" />
        <T x={332} y={156} anchor="end" size={12} code>
          Left(state)
        </T>
        <T x={332} y={173} anchor="end" size={12} color={muted}>
          {t.notTerminal}
        </T>
        <Arrow d="M 420 190 V 136" />
        <T x={428} y={156} size={12} code>
          tx.with(next)
        </T>
        <T x={428} y={173} size={12} color={muted}>
          {t.nextState}
        </T>

        <Box x={250} y={190} w={260} h={132} kind="code" />
        <T x={380} y={214} anchor="middle" size={14} weight={700} code>
          TxFlow::step(tx, state)
        </T>
        <T x={266} y={242} size={12} code>
          let (tx, r) = tx.run(q).await;
        </T>
        <T x={266} y={260} size={12} color={muted}>
          {t.runMore}
        </T>
        <T x={266} y={286} size={12}>
          <Rich line={t.goOn} />
        </T>
        <T x={266} y={306} size={12}>
          <Rich line={t.endNow} />
        </T>

        {/* Each query runs through tx.run */}
        <Arrow d="M 420 322 V 376" />
        <T x={428} y={354} size={12} code>
          query
        </T>
        <Arrow d="M 340 380 V 326" />
        <T x={332} y={354} anchor="end" size={12} code>
          (tx, Result&lt;Output, Error&gt;)
        </T>
        <Box x={280} y={380} w={200} h={36} kind="protocol" rx={18} />
        <T x={380} y={403} anchor="middle" code>
          tx.run(query)
        </T>

        {/* Abort tracking */}
        <Box x={20} y={372} w={242} h={112} kind="abort" />
        {t.abort.map((line, i) => (
          <T key={i} x={32} y={392 + i * 18} size={12}>
            <Rich line={line} />
          </T>
        ))}
        <line
          x1={262}
          y1={398}
          x2={280}
          y2={398}
          stroke={error}
          strokeWidth={1.5}
          strokeDasharray="4 3"
        />

        {/* Outcomes */}
        <rect
          x={20}
          y={506}
          width={860}
          height={200}
          rx={10}
          fill="none"
          stroke={border}
          strokeWidth={1.5}
        />
        <T x={col.end} y={530} weight={600}>
          {t.colEnd}
        </T>
        <T x={col.caller} y={530} weight={600}>
          {t.colCaller}
        </T>
        <T x={col.hook} y={530} weight={600}>
          {t.colHook}
        </T>
        <T x={col.caller} y={548} size={12} color={muted} code>
          Result&lt;TxOutput&lt;C, A&gt;, TxError&gt;
        </T>
        <T x={col.hook} y={548} size={12} color={muted} code>
          TxFinalState&lt;Report&gt;
        </T>
        <line x1={30} y1={560} x2={870} y2={560} stroke={border} />
        {rows.map((row, i) => {
          const y = 582 + i * 22;
          return (
            <g key={row.end}>
              <T x={col.end} y={y}>
                <Rich line={row.end} />
              </T>
              <T
                x={col.caller}
                y={y}
                size={12}
                code
                color={row.failed ? error : fg}
              >
                {row.caller}
              </T>
              {row.hook ? (
                <T x={col.hook} y={y} size={12} code>
                  {row.hook}
                </T>
              ) : (
                <T x={col.hook} y={y} size={12} color={muted}>
                  {t.notCalled}
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
