const text = {
  en: {
    title:
      "gRPC registration: each implementation is built by grpc_service from a dependency cloned out of the ServiceBuilder, or by compose_grpc_service from a closure over the whole builder; it is wrapped in its tonic server and pushed onto a GrpcServiceRegisterCenter; into_router_fn adds every server to a router built by Server::builder, which is then served",
    stage1: "Build each server, once per registration",
    stage2: "Build the router and serve",
    dep: "Dep",
    generated: "tonic-generated",
    layers: "layers apply to every server",
    addsAll: "adds each server in order",
    router: "router",
    register: "register",
    composeSub: "borrows the builder; nothing registered as a service",
    caption:
      "Each server is created when it is registered (grpc_service, or compose_grpc_service for a closure over the whole builder); into_router_fn adds them with add_service in registration order.",
  },
  ja: {
    title:
      "gRPC の登録: 各実装は grpc_service なら ServiceBuilder から clone した依存で、compose_grpc_service ならビルダー全体を借用するクロージャで作られ、tonic のサーバーで包まれて GrpcServiceRegisterCenter に push される。into_router_fn が Server::builder で作ったルーターに全サーバーを追加し、serve する",
    stage1: "各サーバーを作る (登録ごと)",
    stage2: "ルーターを組み立てて serve する",
    dep: "Dep",
    generated: "tonic が生成",
    layers: "レイヤーは全サーバーに適用",
    addsAll: "登録順に各サーバーを追加",
    router: "router",
    register: "register",
    composeSub: "ビルダーを借用。サービスとしては登録されない",
    caption:
      "各サーバーは登録時 (grpc_service、またはビルダー全体を借用する compose_grpc_service) に作られ、into_router_fn が登録順に add_service で追加します。",
  },
} as const;

const fg = "var(--color-fd-foreground)";
const muted = "var(--color-fd-muted-foreground)";
const border = "var(--color-fd-border)";
const card = "var(--color-fd-card)";
const mono = "var(--font-mono, ui-monospace, monospace)";

type Tone = "teal" | "blue" | "indigo" | "purple";

function Box({
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
        rx={9}
        fill={card}
        stroke={border}
      />
      {color && (
        <rect
          x={x}
          y={y}
          width={w}
          height={h}
          rx={9}
          fill={color}
          fillOpacity={0.22}
          stroke={color}
          strokeWidth={1.5}
        />
      )}
    </g>
  );
}

function StepNumber({ x, y, n }: { x: number; y: number; n: number }) {
  return (
    <g>
      <circle cx={x} cy={y - 5} r={11} fill="var(--color-fd-primary)" />
      <text
        x={x}
        y={y}
        fontSize={13}
        fontWeight={700}
        fontFamily="inherit"
        fill="var(--color-fd-background)"
        textAnchor="middle"
      >
        {n}
      </text>
    </g>
  );
}

const lanes = [
  { y: 146, dep: "UserStore", impl: "UserImpl", server: "UserServer" },
  { y: 206, dep: "OrderStore", impl: "OrderImpl", server: "OrderServer" },
];

export function GrpcRegistrationDiagram({
  lang = "en",
}: {
  lang?: "en" | "ja";
}) {
  const t = text[lang];
  const arrow = "url(#grpc-registration-arrow)";

  return (
    <figure className="waku-diagram">
      <svg
        viewBox="0 0 900 510"
        role="img"
        aria-labelledby="grpc-registration-title"
      >
        <title id="grpc-registration-title">{t.title}</title>
        <defs>
          <marker
            id="grpc-registration-arrow"
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

        {/* Stage 1 */}
        <StepNumber x={31} y={31} n={1} />
        <text
          x={50}
          y={31}
          fontSize={15}
          fontWeight={700}
          fontFamily="inherit"
          fill={fg}
        >
          {t.stage1}
        </text>
        <text x={50} y={56} fontSize={13} fontFamily={mono} fill={muted}>
          {".grpc_service::<UserServer<_>, UserImpl, _>(UserServer::new)"}
        </text>

        <Box x={20} y={76} w={140} h={220} tone="teal" />
        <text
          x={90}
          y={104}
          fontSize={13}
          fontWeight={700}
          fontFamily={mono}
          fill={fg}
          textAnchor="middle"
        >
          ServiceBuilder
        </text>

        <Box x={700} y={76} w={180} h={220} tone="blue" />
        <text
          x={790}
          y={98}
          fontSize={13}
          fontWeight={700}
          fontFamily={mono}
          fill={fg}
          textAnchor="middle"
        >
          GrpcService
        </text>
        <text
          x={790}
          y={115}
          fontSize={13}
          fontWeight={700}
          fontFamily={mono}
          fill={fg}
          textAnchor="middle"
        >
          RegisterCenter
        </text>

        {lanes.map((l) => (
          <g key={l.impl}>
            <rect
              x={30}
              y={l.y - 18}
              width={120}
              height={36}
              rx={6}
              fill={card}
              stroke={border}
            />
            <text
              x={90}
              y={l.y + 5}
              fontSize={13}
              fontFamily={mono}
              fill={fg}
              textAnchor="middle"
            >
              {l.dep}
            </text>
            <path
              d={`M150,${l.y} L186,${l.y}`}
              stroke={muted}
              strokeWidth={1.5}
              markerEnd={arrow}
            />

            <Box x={188} y={l.y - 23} w={90} h={46} />
            <text
              x={233}
              y={l.y - 3}
              fontSize={13}
              fontWeight={700}
              fontFamily={mono}
              fill={fg}
              textAnchor="middle"
            >
              .clone()
            </text>
            <text
              x={233}
              y={l.y + 15}
              fontSize={13}
              fontFamily={mono}
              fill={muted}
              textAnchor="middle"
            >
              {t.dep}
            </text>
            <path
              d={`M278,${l.y} L304,${l.y}`}
              stroke={muted}
              strokeWidth={1.5}
              markerEnd={arrow}
            />

            <Box x={306} y={l.y - 23} w={180} h={46} />
            <text
              x={396}
              y={l.y - 3}
              fontSize={13}
              fontWeight={700}
              fontFamily={mono}
              fill={fg}
              textAnchor="middle"
            >
              create_service(dep)
            </text>
            <text
              x={396}
              y={l.y + 15}
              fontSize={13}
              fontFamily={mono}
              fill={muted}
              textAnchor="middle"
            >
              {`→ ${l.impl}`}
            </text>
            <path
              d={`M486,${l.y} L512,${l.y}`}
              stroke={muted}
              strokeWidth={1.5}
              markerEnd={arrow}
            />

            <Box x={514} y={l.y - 23} w={158} h={46} />
            <text
              x={593}
              y={l.y - 3}
              fontSize={13}
              fontWeight={700}
              fontFamily={mono}
              fill={fg}
              textAnchor="middle"
            >
              {`${l.server}::new`}
            </text>
            <text
              x={593}
              y={l.y + 15}
              fontSize={13}
              fontFamily="inherit"
              fill={muted}
              textAnchor="middle"
            >
              {t.generated}
            </text>
            <path
              d={`M672,${l.y} L710,${l.y}`}
              stroke={muted}
              strokeWidth={1.5}
              markerEnd={arrow}
            />

            <rect
              x={712}
              y={l.y - 18}
              width={156}
              height={36}
              rx={6}
              fill={card}
              stroke={border}
            />
            <text
              x={790}
              y={l.y + 5}
              fontSize={13}
              fontFamily={mono}
              fill={fg}
              textAnchor="middle"
            >
              {l.server}
            </text>
          </g>
        ))}

        {/* compose path: one closure borrows the whole builder */}
        {[
          { y: 252, dep: "AdminStore" },
          { y: 280, dep: "AuditLayer" },
        ].map((d) => (
          <g key={d.dep}>
            <rect
              x={30}
              y={d.y - 12}
              width={120}
              height={24}
              rx={6}
              fill={card}
              stroke={border}
            />
            <text
              x={90}
              y={d.y + 5}
              fontSize={13}
              fontFamily={mono}
              fill={fg}
              textAnchor="middle"
            >
              {d.dep}
            </text>
            <path
              d={`M150,${d.y} L186,266`}
              stroke={muted}
              strokeWidth={1.5}
              markerEnd={arrow}
            />
          </g>
        ))}
        <Box x={188} y={238} w={484} h={56} tone="indigo" />
        <text
          x={430}
          y={255}
          fontSize={13}
          fontWeight={700}
          fontFamily={mono}
          fill={fg}
          textAnchor="middle"
        >
          {"compose_grpc_service(|s| …)"}
        </text>
        <text
          x={430}
          y={271}
          fontSize={12}
          fontFamily={mono}
          fill={fg}
          textAnchor="middle"
        >
          {"AdminServer::new(AdminImpl { … s.provide() … })"}
        </text>
        <text
          x={430}
          y={287}
          fontSize={12}
          fontFamily="inherit"
          fill={muted}
          textAnchor="middle"
        >
          {t.composeSub}
        </text>
        <path
          d="M672,266 L710,266"
          stroke={muted}
          strokeWidth={1.5}
          markerEnd={arrow}
        />
        <rect
          x={712}
          y={248}
          width={156}
          height={36}
          rx={6}
          fill={card}
          stroke={border}
        />
        <text
          x={790}
          y={271}
          fontSize={13}
          fontFamily={mono}
          fill={fg}
          textAnchor="middle"
        >
          AdminServer
        </text>

        {/* Stage 2 */}
        <StepNumber x={31} y={327} n={2} />
        <text
          x={50}
          y={327}
          fontSize={15}
          fontWeight={700}
          fontFamily="inherit"
          fill={fg}
        >
          {t.stage2}
        </text>

        <path
          d="M790,296 L790,342"
          stroke={muted}
          strokeWidth={1.5}
          markerEnd={arrow}
        />
        <Box x={700} y={344} w={180} h={52} tone="blue" />
        <text
          x={790}
          y={366}
          fontSize={13}
          fontWeight={700}
          fontFamily={mono}
          fill={fg}
          textAnchor="middle"
        >
          .into_router_fn()
        </text>
        <text
          x={790}
          y={385}
          fontSize={13}
          fontFamily={mono}
          fill={muted}
          textAnchor="middle"
        >
          {"FnOnce(Router<L>)"}
        </text>

        <Box x={20} y={344} w={310} h={100} />
        <g fontSize={13} fontFamily={mono} fill={fg}>
          <text x={36} y={368}>
            Server::builder()
          </text>
          <text x={52} y={388}>
            .layer(..)
          </text>
          <text x={52} y={408}>
            .add_routes(Routes::default())
          </text>
        </g>
        <text x={36} y={432} fontSize={13} fontFamily="inherit" fill={muted}>
          {t.layers}
        </text>

        <path
          d="M330,370 L408,370"
          stroke={muted}
          strokeWidth={1.5}
          markerEnd={arrow}
        />
        <text
          x={369}
          y={362}
          fontSize={13}
          fontFamily={mono}
          fill={muted}
          textAnchor="middle"
        >
          {t.router}
        </text>
        <path
          d="M700,370 L622,370"
          stroke={muted}
          strokeWidth={1.5}
          markerEnd={arrow}
        />
        <text
          x={661}
          y={362}
          fontSize={13}
          fontFamily={mono}
          fill={muted}
          textAnchor="middle"
        >
          {t.register}
        </text>

        <Box x={410} y={344} w={210} h={52} tone="teal" />
        <text
          x={515}
          y={366}
          fontSize={13}
          fontWeight={700}
          fontFamily={mono}
          fill={fg}
          textAnchor="middle"
        >
          register(router)
        </text>
        <text
          x={515}
          y={385}
          fontSize={13}
          fontFamily="inherit"
          fill={muted}
          textAnchor="middle"
        >
          {t.addsAll}
        </text>

        <path
          d="M515,396 L515,440"
          stroke={muted}
          strokeWidth={1.5}
          markerEnd={arrow}
        />
        <Box x={410} y={442} w={210} h={46} />
        <text
          x={515}
          y={470}
          fontSize={13}
          fontWeight={700}
          fontFamily={mono}
          fill={fg}
          textAnchor="middle"
        >
          .serve(addr).await
        </text>
      </svg>
      <figcaption>{t.caption}</figcaption>
    </figure>
  );
}
