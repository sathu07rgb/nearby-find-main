export function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-brand-navy">Privacy Policy</h1>
        <p className="text-xs text-brand-muted mt-1">Last updated: October 2026</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-card space-y-6 text-sm text-brand-text leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-base font-bold text-brand-navy">1. Information We Collect</h2>
          <p>
            FindIt Nearby collects user-provided account details (display name, email address, optional contact information) and lost/found item reports (item general titles, categories, visual descriptions, approximate dates and locations, and optional photos).
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-brand-navy">2. Protection of Private Item Details</h2>
          <p>
            When a user enters private verification details (such as distinct engraving marks or hidden contents), these details are stored securely and excluded from public search results, public RSS feeds, and AI similarity summaries. They are revealed only during the structured claim verification process between authorized parties.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-brand-navy">3. Communication Security</h2>
          <p>
            All direct messages occur within FindIt Nearby's authenticated platform. Your real email address and telephone numbers remain hidden from other users unless you deliberately choose to share them in private messages.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-brand-navy">4. Data Deletion</h2>
          <p>
            You may request complete removal of your profile and item reports at any time through your account settings or by contacting our administration desk.
          </p>
        </section>
      </div>
    </div>
  )
}
