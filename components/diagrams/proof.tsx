const text = {
  en: {
    title: "prove turns a subject into Proven<T, P> or an error",
    effect: "async, may do I/O",
    deny: "decided: P does not hold",
    io: "P could not be decided",
    dropped: "On an error the subject is dropped.",
    downstream: "Downstream code",
    accepts: "is all it accepts",
    notBare: "not a bare T or P",
    deriveHeader: "Change the proposition without rechecking",
    deriveNote: "No recheck, no I/O, cannot fail.",
    evidenceHeader: "What the evidence holds",
    unknown: "nothing known",
    caption:
      "The predicate type is its own evidence. Proven<T, P> can only come from prove or from another proof, so a function that takes it cannot receive an unchecked value.",
  },
  ja: {
    title: "prove は subject を Proven<T, P> かエラーに変える",
    effect: "非同期、I/O を伴ってよい",
    deny: "判定済み：P は成り立たない",
    io: "P を判定できなかった",
    dropped: "エラー時は subject を破棄します。",
    downstream: "下流のコードは",
    accepts: "だけを受け取る",
    notBare: "T や P 単体は不可",
    deriveHeader: "再検査せずに命題を変換",
    deriveNote: "再検査も I/O もなく、失敗しません。",
    evidenceHeader: "証拠の中身",
    unknown: "情報なし",
    caption:
      "述語の型そのものが証拠です。Proven<T, P> は prove か既存の証明からしか作れないため、それを受け取る関数に未検査の値は渡りません。",
  },
} as const;

const mono = "var(--font-mono, ui-monospace, monospace)";
const fg = "var(--color-fd-foreground)";
const muted = "var(--color-fd-muted-foreground)";
const arrow = "url(#proof-arrow)";

function Chip({
  x,
  y,
  w,
  label,
  color,
}: {
  x: number;
  y: number;
  w: number;
  label: string;
  color: string;
}) {
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={w}
        height={34}
        rx={8}
        fill={color}
        fillOpacity={0.25}
        stroke={color}
        strokeWidth={1.5}
      />
      <text
        x={x + w / 2}
        y={y + 22}
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

function Outcome({
  y,
  h,
  title,
  lines,
  color,
}: {
  y: number;
  h: number;
  title: string;
  lines: { text: string; mono: boolean }[];
  color: string;
}) {
  return (
    <g>
      <rect
        x={480}
        y={y}
        width={230}
        height={h}
        rx={10}
        fill={color}
        fillOpacity={0.15}
        stroke={color}
        strokeWidth={1.5}
      />
      <text
        x={494}
        y={y + 23}
        fontFamily={mono}
        fontSize={14}
        fontWeight={700}
        fill={fg}
      >
        {title}
      </text>
      {lines.map((line, i) => (
        <text
          key={line.text}
          x={494}
          y={y + 45 + i * 21}
          fontFamily={line.mono ? mono : undefined}
          fontSize={13}
          fill={line.mono ? fg : muted}
        >
          {line.text}
        </text>
      ))}
    </g>
  );
}

function Slot({
  x,
  y,
  label,
  filled,
}: {
  x: number;
  y: number;
  label: string;
  filled: boolean;
}) {
  const color = "var(--color-waku-indigo)";
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={140}
        height={30}
        rx={6}
        fill={filled ? color : "none"}
        fillOpacity={filled ? 0.3 : undefined}
        stroke={filled ? color : muted}
        strokeWidth={1.5}
        strokeDasharray={filled ? undefined : "4 4"}
      />
      <text
        x={x + 70}
        y={y + 20}
        textAnchor="middle"
        fontFamily={filled ? mono : undefined}
        fontSize={13}
        fill={filled ? fg : muted}
      >
        {label}
      </text>
    </g>
  );
}

export function ProofDiagram({ lang = "en" }: { lang?: "en" | "ja" }) {
  const t = text[lang];
  const derivations = [
    {
      from: "Proven<T, And<A, B>>",
      via: "derive()",
      law: "Commute",
      to: "Proven<T, And<B, A>>",
    },
    {
      from: "Proven<T, And<A, B>>",
      via: "into_a()",
      law: "",
      to: "Proven<T, A>",
    },
    {
      from: "Proven<T, A>",
      via: "from_a()",
      law: "",
      to: "Proven<T, Or<A, B>>",
    },
  ];
  const orRows = [
    { name: "Or::Left", a: true, b: false },
    { name: "Or::Right", a: false, b: true },
    { name: "Or::Both", a: true, b: true },
  ];
  return (
    <figure className="waku-diagram">
      <svg
        viewBox="0 0 900 540"
        role="img"
        aria-labelledby="proof-title"
        fontFamily="inherit"
      >
        <title id="proof-title">{t.title}</title>
        <defs>
          <marker
            id="proof-arrow"
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
        <g transform="translate(0 -20)">
          {/* Inputs */}
          {[
            { y: 72, label: "subject: T" },
            { y: 118, label: "P: Predicate<T>" },
            { y: 164, label: "ctx: &P::Ctx" },
            { y: 210, label: "order: CheckOrder" },
          ].map((input) => (
            <g key={input.label}>
              <Chip
                x={20}
                y={input.y}
                w={170}
                label={input.label}
                color="var(--color-waku-blue)"
              />
              <line
                x1={190}
                y1={input.y + 17}
                x2={236}
                y2={145 + (input.y - 141) / 6}
                stroke={muted}
                strokeWidth={1.5}
                markerEnd={arrow}
              />
            </g>
          ))}

          {/* prove */}
          <rect
            x={240}
            y={105}
            width={200}
            height={90}
            rx={10}
            fill="var(--color-waku-purple)"
            fillOpacity={0.25}
            stroke="var(--color-waku-purple)"
            strokeWidth={1.5}
          />
          <text
            x={340}
            y={132}
            textAnchor="middle"
            fontFamily={mono}
            fontSize={15}
            fontWeight={700}
            fill={fg}
          >
            prove::&lt;T, P&gt;
          </text>
          <text
            x={340}
            y={155}
            textAnchor="middle"
            fontFamily={mono}
            fontSize={13}
            fill={fg}
          >
            P::check(&amp;s, ctx, order)
          </text>
          <text x={340} y={178} textAnchor="middle" fontSize={13} fill={muted}>
            {t.effect}
          </text>

          {/* Outcomes */}
          <line
            x1={440}
            y1={140}
            x2={476}
            y2={95}
            stroke={muted}
            strokeWidth={1.5}
            markerEnd={arrow}
          />
          <line
            x1={440}
            y1={155}
            x2={476}
            y2={186}
            stroke={muted}
            strokeWidth={1.5}
            markerEnd={arrow}
          />
          <line
            x1={440}
            y1={170}
            x2={476}
            y2={252}
            stroke={muted}
            strokeWidth={1.5}
            markerEnd={arrow}
          />
          <Outcome
            y={40}
            h={86}
            title="Ok(Proven<T, P>)"
            lines={[
              { text: "subject()  → &T", mono: true },
              { text: "evidence() → &P", mono: true },
            ]}
            color="var(--color-fd-success)"
          />
          <Outcome
            y={160}
            h={54}
            title="Err(Deny(DeniedReason))"
            lines={[{ text: t.deny, mono: false }]}
            color="var(--color-fd-warning)"
          />
          <Outcome
            y={226}
            h={54}
            title="Err(IoError(E))"
            lines={[{ text: t.io, mono: false }]}
            color="var(--color-fd-error)"
          />
          <text x={480} y={302} fontSize={13} fill={muted}>
            {t.dropped}
          </text>

          {/* Downstream */}
          <line
            x1={710}
            y1={90}
            x2={746}
            y2={90}
            stroke={muted}
            strokeWidth={1.5}
            markerEnd={arrow}
          />
          <rect
            x={750}
            y={40}
            width={135}
            height={110}
            rx={10}
            fill="var(--color-waku-teal)"
            fillOpacity={0.22}
            stroke="var(--color-waku-teal)"
            strokeWidth={1.5}
          />
          <text x={817} y={64} textAnchor="middle" fontSize={13} fill={fg}>
            {t.downstream}
          </text>
          <text
            x={817}
            y={88}
            textAnchor="middle"
            fontFamily={mono}
            fontSize={14}
            fontWeight={700}
            fill={fg}
          >
            Proven&lt;T, P&gt;
          </text>
          <text x={817} y={110} textAnchor="middle" fontSize={13} fill={fg}>
            {t.accepts}
          </text>
          <text x={817} y={134} textAnchor="middle" fontSize={13} fill={muted}>
            {t.notBare}
          </text>

          <line
            x1={20}
            y1={324}
            x2={880}
            y2={324}
            stroke="var(--color-fd-border)"
            strokeWidth={1}
          />

          {/* Derivation */}
          <text x={20} y={352} fontSize={14} fontWeight={600} fill={muted}>
            {t.deriveHeader}
          </text>
          {derivations.map((d, i) => {
            const y = 370 + i * 54;
            return (
              <g key={d.via}>
                <Chip
                  x={20}
                  y={y}
                  w={168}
                  label={d.from}
                  color="var(--color-waku-teal)"
                />
                <line
                  x1={188}
                  y1={y + 17}
                  x2={278}
                  y2={y + 17}
                  stroke={muted}
                  strokeWidth={1.5}
                  markerEnd={arrow}
                />
                <text
                  x={235}
                  y={y + 10}
                  textAnchor="middle"
                  fontFamily={mono}
                  fontSize={13}
                  fill={fg}
                >
                  {d.via}
                </text>
                {d.law && (
                  <text
                    x={235}
                    y={y + 34}
                    textAnchor="middle"
                    fontFamily={mono}
                    fontSize={13}
                    fill={muted}
                  >
                    {d.law}
                  </text>
                )}
                <Chip
                  x={282}
                  y={y}
                  w={168}
                  label={d.to}
                  color="var(--color-waku-teal)"
                />
              </g>
            );
          })}
          <text x={20} y={545} fontSize={13} fill={muted}>
            {t.deriveNote}
          </text>

          {/* Evidence shapes */}
          <text x={480} y={352} fontSize={14} fontWeight={600} fill={muted}>
            {t.evidenceHeader}
          </text>
          <text
            x={480}
            y={390}
            fontFamily={mono}
            fontSize={13}
            fontWeight={700}
            fill={fg}
          >
            And
          </text>
          <Slot x={590} y={370} label="Evidence<A>" filled />
          <Slot x={740} y={370} label="Evidence<B>" filled />
          {orRows.map((row, i) => {
            const y = 420 + i * 40;
            return (
              <g key={row.name}>
                <text
                  x={480}
                  y={y + 20}
                  fontFamily={mono}
                  fontSize={13}
                  fontWeight={700}
                  fill={fg}
                >
                  {row.name}
                </text>
                <Slot
                  x={590}
                  y={y}
                  label={row.a ? "Evidence<A>" : t.unknown}
                  filled={row.a}
                />
                <Slot
                  x={740}
                  y={y}
                  label={row.b ? "Evidence<B>" : t.unknown}
                  filled={row.b}
                />
              </g>
            );
          })}
        </g>
      </svg>
      <figcaption>{t.caption}</figcaption>
    </figure>
  );
}
