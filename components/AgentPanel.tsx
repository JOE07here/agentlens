import type { Access, CorrelatedAgent, Credential, Source } from "@/lib/model/types";
import { AgentTypeChip, MatchBadge, SourcePills } from "@/components/badges";
import { formatDate } from "@/lib/util/date";

function RoleList({ access }: { access: Access[] }) {
  if (access.length === 0) return <span className="text-sm text-ink-soft">No roles</span>;
  return (
    <div className="flex flex-wrap gap-1.5">
      {access.map((a) => (
        <span
          key={`${a.kind}:${a.name}`}
          className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-xs text-slate-700"
          title={a.kind}
        >
          {a.name}
        </span>
      ))}
    </div>
  );
}

function CredentialList({ credentials }: { credentials: Credential[] }) {
  if (credentials.length === 0) return <span className="text-sm text-ink-soft">None</span>;
  return (
    <ul className="space-y-1 text-sm">
      {credentials.map((c) => {
        const neverExpires = c.expiresAt === null;
        return (
          <li key={c.id} className="flex flex-wrap items-baseline gap-x-2">
            <span className="font-medium text-ink">{c.type}</span>
            <span className="text-xs text-ink-soft">created {formatDate(c.createdAt)}</span>
            <span
              className={`text-xs font-medium ${neverExpires ? "text-red-700" : "text-ink-soft"}`}
            >
              {neverExpires ? "never expires" : `expires ${formatDate(c.expiresAt)}`}
            </span>
          </li>
        );
      })}
    </ul>
  );
}

function Side({
  system,
  present,
  children,
}: {
  system: "MidPoint" | "Keycloak";
  present: boolean;
  children: React.ReactNode;
}) {
  const accent = system === "MidPoint" ? "text-brand" : "text-moat";
  return (
    <div className="flex-1 rounded-lg border border-hairline bg-canvas/60 p-3">
      <div className={`mb-2 text-xs font-bold uppercase tracking-wide ${accent}`}>
        {system}
        <span className="ml-1.5 font-normal text-ink-soft">
          {system === "MidPoint" ? "· governance" : "· authentication"}
        </span>
      </div>
      {present ? (
        children
      ) : (
        <p className="text-sm italic text-ink-soft">Not present in {system}.</p>
      )}
    </div>
  );
}

export function AgentPanel({ agent }: { agent: CorrelatedAgent }) {
  const correlated = agent.sources.length > 1;
  const bySource = (source: Source) => agent.access.filter((a) => a.source === source);
  const credsBySource = (source: Source) =>
    agent.credentials.filter((c) => c.source === source);

  return (
    <article
      className={`rounded-xl border bg-surface p-4 shadow-sm ${
        correlated ? "border-moat/40 ring-1 ring-moat/20" : "border-hairline"
      }`}
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <h3 className="font-mono text-base font-semibold text-ink">{agent.name}</h3>
          <AgentTypeChip type={agent.type} />
        </div>
        <div className="flex items-center gap-2">
          <SourcePills sources={agent.sources} />
          <MatchBadge confidence={agent.matchConfidence} />
        </div>
      </div>

      {agent.matchReason && (
        <p className="mt-1 text-xs text-ink-soft">{agent.matchReason}</p>
      )}

      <div className="mt-3 flex flex-col gap-3 md:flex-row">
        <Side system="MidPoint" present={Boolean(agent.midpoint)}>
          <dl className="space-y-2">
            <div>
              <dt className="text-xs font-semibold text-ink-soft">Roles</dt>
              <dd className="mt-1">
                <RoleList access={bySource("midpoint")} />
              </dd>
            </div>
            <div className="flex gap-6 text-xs text-ink-soft">
              <span>Owner: {agent.owner ?? "—"}</span>
              <span>Last active: {formatDate(agent.lastActivityAt)}</span>
            </div>
            {credsBySource("midpoint").length > 0 && (
              <div>
                <dt className="text-xs font-semibold text-ink-soft">Credentials</dt>
                <dd className="mt-1">
                  <CredentialList credentials={credsBySource("midpoint")} />
                </dd>
              </div>
            )}
          </dl>
        </Side>

        <Side system="Keycloak" present={Boolean(agent.keycloak)}>
          <dl className="space-y-2">
            <div>
              <dt className="text-xs font-semibold text-ink-soft">OAuth client</dt>
              <dd className="mt-1 font-mono text-sm text-ink">{agent.keycloak?.name ?? "—"}</dd>
            </div>
            <div>
              <dt className="text-xs font-semibold text-ink-soft">Client roles</dt>
              <dd className="mt-1">
                <RoleList access={bySource("keycloak")} />
              </dd>
            </div>
            <div>
              <dt className="text-xs font-semibold text-ink-soft">Secret</dt>
              <dd className="mt-1">
                <CredentialList credentials={credsBySource("keycloak")} />
              </dd>
            </div>
          </dl>
        </Side>
      </div>
    </article>
  );
}
