import type { ReactNode } from "react";

const text = {
  en: {
    title:
      "wakuwaku architecture: one ServiceBuilder feeds the cron, gRPC and Iggy register centers; below, the crate layering",
    wiring: "RUNTIME WIRING",
    layering: "CRATE LAYERING",
    shared: "shared dependencies",
    dbPool: "DB pool (sqlx)",
    redis: "Redis connection",
    config: "config, …",
    cronOut: "Tokio task per job",
    grpcOut: "served by tonic",
    iggyOut: "consumer tasks",
    router: "Router",
    tonic: "tonic ",
    built: "clone Dep → create_service, or compose_*",
    componentsUse: "Components use",
    entityDesc: "sqlx · Redis · Meilisearch",
    iggyDesc: "for events",
    proofDesc: "for input",
    app: "Your service",
    appDesc: "depends only on",
    appAfter: "",
    wakuwakuDesc:
      "ServiceBuilder · cron_job · grpc_service · iggy_consumer · compose_* · deps",
    entityCrate: "capability-typed data access",
    iggyCrate: "typed events on Apache Iggy",
    proofCrate: "proof-carrying validation",
    kanauDesc: "Processor",
    thirdParty: "third-party",
    caption:
      "Every component is built from dependencies registered in one ServiceBuilder: a single cloned dependency, or a compose_* closure over the whole builder. The sub-crates are re-exported by wakuwaku.",
  },
  ja: {
    title:
      "wakuwaku のアーキテクチャ: 1 つの ServiceBuilder が cron・gRPC・Iggy の各レジスタセンターに依存を供給し、その下にクレートの階層がある",
    wiring: "実行時の組み立て",
    layering: "クレートの階層",
    shared: "共有する依存",
    dbPool: "DB プール (sqlx)",
    redis: "Redis 接続",
    config: "設定 など",
    cronOut: "ジョブごとの Tokio タスク",
    grpcOut: "tonic で提供",
    iggyOut: "コンシューマタスク",
    router: "Router",
    tonic: "tonic ",
    built: "Dep を clone → create_service、または compose_*",
    componentsUse: "コンポーネントが使う",
    entityDesc: "sqlx · Redis · Meilisearch",
    iggyDesc: "でイベント発行",
    proofDesc: "で入力を検証",
    app: "あなたのサービス",
    appDesc: "依存するのは",
    appAfter: "だけ",
    wakuwakuDesc:
      "ServiceBuilder · cron_job · grpc_service · iggy_consumer · compose_* · deps",
    entityCrate: "権限を型で表すデータアクセス",
    iggyCrate: "Apache Iggy 上の型付きイベント",
    proofCrate: "証明を伴う検証",
    kanauDesc: "Processor",
    thirdParty: "サードパーティ",
    caption:
      "すべてのコンポーネントは 1 つの ServiceBuilder に登録された依存から作られます。1 つの依存を clone するか、ビルダー全体を借用する compose_* クロージャを使います。サブクレートは wakuwaku から再エクスポートされます。",
  },
} as const;

const fg = "var(--color-fd-foreground)";
const muted = "var(--color-fd-muted-foreground)";
const border = "var(--color-fd-border)";
const card = "var(--color-fd-card)";
const mono = "var(--font-mono, ui-monospace, monospace)";

type Tone = "teal" | "blue" | "indigo" | "purple" | "pink" | "yellow";

function Panel({
  x,
  y,
  w,
  h,
  tone,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  tone?: Tone;
}) {
  const color = tone ? `var(--color-waku-${tone})` : undefined;
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx={10}
        fill={card}
        stroke={border}
      />
      {color && (
        <rect
          x={x}
          y={y}
          width={w}
          height={h}
          rx={10}
          fill={color}
          fillOpacity={0.22}
          stroke={color}
          strokeWidth={1.5}
        />
      )}
    </g>
  );
}

function Label({
  x,
  y,
  children,
  code,
  size = 14,
  weight,
  color = fg,
  anchor = "middle",
}: {
  x: number;
  y: number;
  children: ReactNode;
  code?: boolean;
  size?: number;
  weight?: number;
  color?: string;
  anchor?: "start" | "middle" | "end";
}) {
  return (
    <text
      x={x}
      y={y}
      fontSize={size}
      fontWeight={weight}
      fill={color}
      textAnchor={anchor}
      fontFamily={code ? mono : "inherit"}
    >
      {children}
    </text>
  );
}

function Arrow({ d, dashed }: { d: string; dashed?: boolean }) {
  return (
    <path
      d={d}
      fill="none"
      stroke={muted}
      strokeWidth={1.5}
      strokeDasharray={dashed ? "5 4" : undefined}
      markerEnd="url(#architecture-arrow)"
    />
  );
}

const centers = [
  {
    y: 52,
    name: "CronRegisterCenter",
    call: ".cron_job()",
    out: "CronRuntime",
    method: ".start()",
    tone: "yellow",
  },
  {
    y: 138,
    name: "GrpcServiceRegisterCenter",
    call: ".grpc_service()",
    out: null,
    method: ".into_router_fn()",
    tone: "blue",
  },
  {
    y: 224,
    name: "IggyConsumerRegisterCenter",
    call: ".iggy_consumer()",
    out: "ConsumerRuntime",
    method: ".start(client, config)",
    tone: "purple",
  },
] as const;

export function ArchitectureDiagram({ lang = "en" }: { lang?: "en" | "ja" }) {
  const t = text[lang];
  const outDesc = [t.cronOut, t.grpcOut, t.iggyOut];
  const chips = [t.dbPool, t.redis, "Arc<IggyClient>", t.config];
  const uses = [
    { crate: "wakuwaku::entity", desc: t.entityDesc, tone: "teal" as const },
    {
      crate: "wakuwaku::iggy",
      desc: t.iggyDesc,
      code: "Publisher",
      tone: "purple" as const,
    },
    {
      crate: "wakuwaku::proof",
      desc: t.proofDesc,
      code: "Proven<T, P>",
      tone: "pink" as const,
    },
  ];
  const subCrates = [
    {
      name: "wakuwaku-entity",
      path: "wakuwaku::entity",
      desc: t.entityCrate,
      tone: "teal" as const,
    },
    {
      name: "wakuwaku-iggy",
      path: "wakuwaku::iggy",
      desc: t.iggyCrate,
      tone: "purple" as const,
    },
    {
      name: "wakuwaku-proof",
      path: "wakuwaku::proof",
      desc: t.proofCrate,
      tone: "pink" as const,
    },
  ];

  return (
    <figure className="waku-diagram">
      <svg
        viewBox="0 0 900 712"
        role="img"
        aria-labelledby="architecture-title"
      >
        <title id="architecture-title">{t.title}</title>
        <defs>
          <marker
            id="architecture-arrow"
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

        {/* Runtime wiring */}
        <Label
          x={20}
          y={30}
          size={13}
          weight={600}
          color={muted}
          anchor="start"
        >
          {t.wiring}
        </Label>

        <Panel x={20} y={44} w={220} h={240} tone="teal" />
        <Label x={130} y={72} code size={15} weight={700}>
          ServiceBuilder
        </Label>
        <Label x={130} y={92} size={13} color={muted}>
          {t.shared}
        </Label>
        {chips.map((chip, i) => (
          <g key={chip}>
            <rect
              x={36}
              y={106 + i * 42}
              width={188}
              height={32}
              rx={6}
              fill={card}
              stroke={border}
            />
            <Label x={130} y={127 + i * 42} size={13} code={i === 2}>
              {chip}
            </Label>
          </g>
        ))}

        {centers.map((c, i) => (
          <g key={c.name}>
            <Arrow d={`M240,164 C280,164 280,${c.y + 32} 318,${c.y + 32}`} />
            <Panel x={320} y={c.y} w={270} h={64} tone={c.tone} />
            <Label x={455} y={c.y + 27} code size={14} weight={700}>
              {c.name}
            </Label>
            <Label x={455} y={c.y + 48} code size={13} color={muted}>
              {c.call}
            </Label>

            <Arrow d={`M590,${c.y + 32} L658,${c.y + 32}`} />
            <Panel x={660} y={c.y} w={220} h={64} />
            {c.out ? (
              <Label x={770} y={c.y + 22} code size={14} weight={700}>
                {c.out}
              </Label>
            ) : (
              <text
                x={770}
                y={c.y + 22}
                fontSize={14}
                fill={fg}
                textAnchor="middle"
                fontFamily="inherit"
              >
                {t.tonic}
                <tspan fontFamily={mono} fontWeight={700}>
                  {t.router}
                </tspan>
              </text>
            )}
            <Label x={770} y={c.y + 40} code size={13} color={muted}>
              {c.method}
            </Label>
            <Label x={770} y={c.y + 57} size={13} color={muted}>
              {outDesc[i]}
            </Label>
          </g>
        ))}

        <Label x={250} y={306} size={13} color={muted} anchor="start">
          {t.built}
        </Label>

        {/* Components use */}
        <Arrow d="M560,288 L560,318" dashed />
        <Panel x={20} y={320} w={860} h={74} />
        <Label x={36} y={362} size={14} weight={600} anchor="start">
          {t.componentsUse}
        </Label>
        {uses.map((u, i) => {
          const x = 200 + i * 226;
          const color = `var(--color-waku-${u.tone})`;
          return (
            <g key={u.crate}>
              <rect
                x={x}
                y={332}
                width={210}
                height={50}
                rx={8}
                fill={color}
                fillOpacity={0.22}
                stroke={color}
              />
              <Label x={x + 105} y={353} code size={13} weight={700}>
                {u.crate}
              </Label>
              <text
                x={x + 105}
                y={373}
                fontSize={13}
                fill={muted}
                textAnchor="middle"
                fontFamily="inherit"
              >
                {u.code && (
                  <tspan fontFamily={mono} fill={fg}>
                    {u.code}
                  </tspan>
                )}
                {u.code ? `\u00a0${u.desc}` : u.desc}
              </text>
            </g>
          );
        })}

        {/* Crate layering */}
        <Label
          x={20}
          y={432}
          size={13}
          weight={600}
          color={muted}
          anchor="start"
        >
          {t.layering}
        </Label>

        <Panel x={20} y={444} w={860} h={42} />
        <text
          x={450}
          y={470}
          fontSize={14}
          fill={fg}
          textAnchor="middle"
          fontFamily="inherit"
        >
          <tspan fontWeight={700}>{t.app}</tspan>
          <tspan fill={muted}>{`\u00a0— ${t.appDesc}\u00a0`}</tspan>
          <tspan fontFamily={mono}>wakuwaku</tspan>
          {t.appAfter && <tspan fill={muted}>{`\u00a0${t.appAfter}`}</tspan>}
        </text>

        <Panel x={20} y={500} w={860} h={56} tone="teal" />
        <Label x={450} y={524} code size={15} weight={700}>
          wakuwaku
        </Label>
        <Label x={450} y={545} code size={13} color={muted}>
          {t.wakuwakuDesc}
        </Label>

        {subCrates.map((s, i) => {
          const x = 20 + i * 293.33;
          return (
            <g key={s.name}>
              <Panel x={x} y={570} w={273.33} h={76} tone={s.tone} />
              <Label x={x + 136.67} y={594} code size={14} weight={700}>
                {s.name}
              </Label>
              <Label x={x + 136.67} y={614} code size={13} color={muted}>
                {`→ ${s.path}`}
              </Label>
              <Label x={x + 136.67} y={634} size={13}>
                {s.desc}
              </Label>
            </g>
          );
        })}

        <Panel x={20} y={660} w={273.33} h={42} tone="indigo" />
        <text
          x={156.67}
          y={686}
          fontSize={14}
          fill={fg}
          textAnchor="middle"
          fontFamily={mono}
        >
          <tspan fontWeight={700}>kanau</tspan>
          <tspan fill={muted}>{`\u00a0· ${t.kanauDesc}`}</tspan>
        </text>
        <Panel x={313.33} y={660} w={566.67} h={42} />
        <text
          x={596.67}
          y={686}
          fontSize={13}
          fill={muted}
          textAnchor="middle"
          fontFamily="inherit"
        >
          {`${t.thirdParty}:\u00a0`}
          <tspan fontFamily={mono} fill={fg}>
            tokio · tonic · sqlx · redis · meilisearch-sdk · iggy
          </tspan>
        </text>
      </svg>
      <figcaption>{t.caption}</figcaption>
    </figure>
  );
}
