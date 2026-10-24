import { Link } from 'react-router-dom'
import { MapPin, Users, Heart, Sparkles, CheckCircle } from 'lucide-react'
import { Button } from '../components/ui/Button'

export function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      <div className="text-center space-y-3">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-brand-navy">
          About FindIt Nearby
        </h1>
        <p className="text-brand-muted text-base max-w-2xl mx-auto leading-relaxed">
          Building connected, trustworthy campuses and local communities where lost belongings find their way home.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-card space-y-4">
        <h2 className="text-xl font-bold text-brand-navy">Our Mission</h2>
        <p className="text-sm text-brand-text leading-relaxed">
          Every year, thousands of valuable personal items—laptops, identification cards, backpacks, prescription glasses, and notebooks—are misplaced across university campuses, hostels, transit hubs, and libraries. Most remain unclaimed in lost-and-found boxes because no unified, intelligent platform connects the person who lost an item with the person who found it.
        </p>
        <p className="text-sm text-brand-text leading-relaxed">
          FindIt Nearby solves this with transparent AI-assisted similarity matching, secure privacy controls, and a structured verification workflow that makes item recovery reliable, safe, and swift.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="p-6 bg-pale-blue/60 rounded-xl border border-blue-100 text-center space-y-2">
          <Heart className="w-8 h-8 text-primary-blue mx-auto" />
          <h3 className="font-bold text-brand-navy text-sm">Community First</h3>
          <p className="text-xs text-brand-muted">
            Designed for colleges, hostels, corporate campuses, and neighborhoods.
          </p>
        </div>

        <div className="p-6 bg-pale-blue/60 rounded-xl border border-blue-100 text-center space-y-2">
          <Sparkles className="w-8 h-8 text-primary-blue mx-auto" />
          <h3 className="font-bold text-brand-navy text-sm">Explainable AI</h3>
          <p className="text-xs text-brand-muted">
            Deterministic similarity scoring combining text, category, location, and time.
          </p>
        </div>

        <div className="p-6 bg-pale-blue/60 rounded-xl border border-blue-100 text-center space-y-2">
          <Users className="w-8 h-8 text-primary-blue mx-auto" />
          <h3 className="font-bold text-brand-navy text-sm">Privacy Centric</h3>
          <p className="text-xs text-brand-muted">
            Personal phone numbers and private serial details are never exposed to public search.
          </p>
        </div>
      </div>
    </div>
  )
}
