/**
 * "Before vs after correlation" — the value proposition in one visual.
 * Before: two systems each see half the picture. After: one high-risk agent.
 */
export function CorrelationBeforeAfter() {
  return (
    <div className="mx-auto max-w-4xl">
      <p className="text-center text-xs font-bold uppercase tracking-wider text-ink-soft">
        Before — two half-pictures
      </p>
      <div className="mt-3 grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-hairline bg-canvas p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-brand-ink">
            MidPoint sees
          </p>
          <p className="mt-2 font-mono text-sm text-ink">svc-payment-bot</p>
          <ul className="mt-2 space-y-1 text-sm text-ink-soft">
            <li>
              · holds role{" "}
              <span className="rounded bg-red-100 px-1.5 py-0.5 font-mono text-xs text-red-800 dark:bg-red-500/15 dark:text-red-300">
                admin
              </span>
            </li>
            <li>· owner: finance-team</li>
            <li className="italic">…but knows nothing about its credentials.</li>
          </ul>
        </div>
        <div className="rounded-2xl border border-hairline bg-canvas p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-moat-ink">
            Keycloak sees
          </p>
          <p className="mt-2 font-mono text-sm text-ink">svc-payment-bot</p>
          <ul className="mt-2 space-y-1 text-sm text-ink-soft">
            <li>
              · client secret:{" "}
              <span className="rounded bg-red-100 px-1.5 py-0.5 font-mono text-xs text-red-800 dark:bg-red-500/15 dark:text-red-300">
                never expires
              </span>
            </li>
            <li>· service account enabled</li>
            <li className="italic">…but knows nothing about its governance roles.</li>
          </ul>
        </div>
      </div>

      <div className="my-4 flex justify-center" aria-hidden="true">
        <span className="text-2xl text-moat-ink">↓ correlate ↓</span>
      </div>

      <p className="text-center text-xs font-bold uppercase tracking-wider text-ink-soft">
        After — one full picture
      </p>
      <div className="mt-3 rounded-2xl border-2 border-red-400 bg-red-50 p-5 dark:border-red-500/50 dark:bg-red-500/10">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="font-mono text-sm font-semibold text-ink">svc-payment-bot</p>
          <span className="inline-flex items-center rounded-md bg-red-100 px-2 py-0.5 text-xs font-bold uppercase tracking-wide text-red-800 ring-1 ring-inset ring-red-300 dark:bg-red-500/15 dark:text-red-300 dark:ring-red-500/40">
            high risk
          </span>
        </div>
        <p className="mt-2 text-sm leading-relaxed text-ink">
          Admin role <span className="text-ink-soft">(from MidPoint)</span> + never-expiring
          secret <span className="text-ink-soft">(from Keycloak)</span> + service account ={" "}
          <strong>a privileged machine identity anyone could impersonate indefinitely.</strong>
        </p>
        <p className="mt-1.5 text-sm text-ink-soft">
          Neither system flags this on its own — the risk only exists in the combined view.
        </p>
      </div>
    </div>
  );
}
