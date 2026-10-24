import { Link } from 'react-router-dom'
import {
  FileText,
  Search,
  CheckCircle,
  Shield,
  HelpCircle,
  ArrowRight,
  Lock,
} from 'lucide-react'
import { Button } from '../components/ui/Button'

export function HowItWorksPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-brand-navy">
          How FindIt Nearby Works
        </h1>
        <p className="text-brand-muted text-base leading-relaxed">
          Reuniting lost belongings through intelligent matching, transparent verification, and community trust.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-card space-y-3">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-primary-blue flex items-center justify-center font-bold text-lg">
            01
          </div>
          <h2 className="text-lg font-bold text-brand-navy">1. File a Report</h2>
          <p className="text-xs text-brand-muted leading-relaxed">
            Whether you lost a backpack or found wireless earbuds, enter public visual descriptors, location, and photos. Finders can add private verification details that stay hidden from public search.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-card space-y-3">
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold text-lg">
            02
          </div>
          <h2 className="text-lg font-bold text-brand-navy">2. Algorithmic Match</h2>
          <p className="text-xs text-brand-muted leading-relaxed">
            Our multi-factor matching algorithm evaluates description keywords, categories, geographical proximity, and time windows to generate an explainable similarity score (0–100).
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-card space-y-3">
          <div className="w-12 h-12 rounded-xl bg-green-50 text-green-600 flex items-center justify-center font-bold text-lg">
            03
          </div>
          <h2 className="text-lg font-bold text-brand-navy">3. Verify & Handover</h2>
          <p className="text-xs text-brand-muted leading-relaxed">
            The claimant answers private verification questions without exposing credentials. Once confirmed, both parties coordinate a safe handover at campus reception or public desks.
          </p>
        </div>
      </div>

      {/* Safety recommendations */}
      <div className="bg-pale-blue/60 rounded-2xl border border-blue-100 p-8 space-y-4">
        <h2 className="text-xl font-bold text-brand-navy flex items-center gap-2">
          <Shield className="w-6 h-6 text-primary-blue" />
          Safe Handover Guidelines
        </h2>
        <ul className="text-xs text-brand-text space-y-2.5 leading-relaxed">
          <li>
            • <strong>Meet in Public:</strong> Prefer campus security kiosks, department reception desks, or well-lit student centers.
          </li>
          <li>
            • <strong>Official Document Routing:</strong> For government IDs, passport booklets, or banking cards, handover directly to campus administration.
          </li>
          <li>
            • <strong>Zero Financial Transactions:</strong> FindIt Nearby does not ask for or require payments to recover belongings.
          </li>
        </ul>
      </div>

      <div className="text-center pt-4">
        <Link to="/browse">
          <Button variant="primary" size="lg">
            Browse Current Reports <ArrowRight className="w-5 h-5 ml-1.5" />
          </Button>
        </Link>
      </div>
    </div>
  )
}
