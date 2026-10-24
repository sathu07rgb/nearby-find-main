export function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-brand-navy">Terms of Service</h1>
        <p className="text-xs text-brand-muted mt-1">Last updated: October 2026</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-card space-y-6 text-sm text-brand-text leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-base font-bold text-brand-navy">1. Acceptable Use</h2>
          <p>
            FindIt Nearby is intended solely to facilitate the lawful return of lost personal property to its rightful owner. You agree not to post false claims, harass reporters, or list prohibited, stolen, or hazardous materials.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-brand-navy">2. Verification and Claims</h2>
          <p>
            A high similarity match score from our matching engine is an indicator of descriptive similarity, not legal proof of ownership. Finders maintain the right and responsibility to request reasonable verification before handing over property.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-brand-navy">3. Limitation of Liability</h2>
          <p>
            FindIt Nearby serves as an informational platform connecting users. We do not inspect, take custody of, or guarantee the condition or return of any lost belongings. Users are encouraged to conduct all physical handovers in safe, well-lit, public environments or via designated campus security desks.
          </p>
        </section>
      </div>
    </div>
  )
}
