import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { ShieldCheck, MapPin, Calendar, Lock, ArrowRight, CheckCircle2 } from 'lucide-react'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Textarea } from '../components/ui/Textarea'
import { Select } from '../components/ui/Select'
import { ImageUpload } from '../components/items/ImageUpload'
import { useReports } from '../context/ReportsContext'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { ITEM_CATEGORIES } from '../lib/utils'
import type { ItemCategory } from '../types/database'

const schema = z.object({
  item_name: z.string().min(3, 'Item name must be at least 3 characters'),
  category: z.string().min(1, 'Please select a category'),
  description: z.string().min(10, 'Please describe the found item (at least 10 chars)'),
  approximate_location: z.string().min(3, 'Please specify general location where found'),
  city: z.string().min(2, 'City is required'),
  campus: z.string().optional(),
  event_date: z.string().min(1, 'Please select approximate date found'),
  safe_handover: z.string().min(1, 'Please select preferred handover method'),
  private_detail: z.string().optional(),
})

type FormData = z.infer<typeof schema>

const HANDOVER_OPTIONS = [
  { value: 'security_desk', label: 'College / Building Security Desk' },
  { value: 'department_office', label: 'Department / Reception Office' },
  { value: 'public_place', label: 'In-person meeting at a public campus area' },
  { value: 'police_station', label: 'Local Police Station (High-value items)' },
]

export function ReportFoundPage() {
  const [images, setImages] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const { addReport } = useReports()
  const { user, demoLoggedIn } = useAuth()
  const { showSuccess, showError } = useToast()
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      event_date: new Date().toISOString().split('T')[0],
      city: 'Bangalore',
      safe_handover: 'security_desk',
    },
  })

  const onSubmit = async (data: FormData) => {
    setLoading(true)
    try {
      const reporterId = user?.id || (demoLoggedIn ? 'demo-user-001' : 'anonymous-finder')

      // Save public report
      const created = await addReport({
        reporter_id: reporterId,
        report_type: 'found',
        item_name: data.item_name,
        category: data.category as ItemCategory,
        description: data.description,
        photo_paths: images,
        approximate_location: data.approximate_location,
        city: data.city,
        campus: data.campus || null,
        event_date: new Date(data.event_date).toISOString(),
        status: 'open',
        is_demo: false,
      })

      showSuccess('Found report published!', 'We are scanning lost item reports for potential matches.')
      navigate(`/items/${created.id}`)
    } catch (err: unknown) {
      showError('Submission failed', err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <span className="badge badge-found mb-2 font-semibold">Found Item Report</span>
        <h1 className="text-2xl sm:text-3xl font-bold text-brand-navy">Report a Found Item</h1>
        <p className="text-sm text-brand-muted mt-1">
          Thank you for being a responsible community member! Let's get this item back to its owner.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-white p-6 sm:p-8 rounded-2xl border border-gray-100 shadow-card">
        {/* Section 1: Item Basic Info */}
        <div className="space-y-4">
          <h2 className="text-base font-semibold text-brand-text border-b border-gray-100 pb-2">
            1. Found Item Overview
          </h2>

          <Input
            label="General Item Name"
            placeholder="e.g. Blue Wildcraft Backpack or Wireless Earbuds"
            error={errors.item_name?.message}
            hint="Keep the name general so the owner can verify specific details."
            required
            {...register('item_name')}
          />

          <Select
            label="Category"
            error={errors.category?.message}
            required
            placeholder="Select a category"
            options={ITEM_CATEGORIES.map((c) => ({
              value: c.value,
              label: `${c.emoji} ${c.label}`,
            }))}
            {...register('category')}
          />

          <Textarea
            label="Public Description"
            placeholder="Describe what you found in general terms (color, general condition, where it was spotted)."
            error={errors.description?.message}
            required
            rows={3}
            {...register('description')}
          />

          <ImageUpload images={images} onChange={setImages} />
        </div>

        {/* Section 2: Location & Timing */}
        <div className="space-y-4 pt-4 border-t border-gray-100">
          <h2 className="text-base font-semibold text-brand-text border-b border-gray-100 pb-2">
            2. Where & When was it Found?
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="City"
              placeholder="e.g. Bangalore"
              error={errors.city?.message}
              required
              {...register('city')}
            />
            <Input
              label="Campus or Area (Optional)"
              placeholder="e.g. BMS College Campus"
              error={errors.campus?.message}
              {...register('campus')}
            />
          </div>

          <Input
            label="General Location Found"
            placeholder="e.g. Classroom 204 or Cafeteria food counter"
            leftIcon={<MapPin className="w-4 h-4" />}
            error={errors.approximate_location?.message}
            required
            {...register('approximate_location')}
          />

          <Input
            label="Date Found"
            type="date"
            leftIcon={<Calendar className="w-4 h-4" />}
            error={errors.event_date?.message}
            required
            {...register('event_date')}
          />
        </div>

        {/* Section 3: Safe Handover & Private Verification */}
        <div className="space-y-4 pt-4 border-t border-gray-100">
          <h2 className="text-base font-semibold text-brand-text border-b border-gray-100 pb-2">
            3. Safe Verification & Handover
          </h2>

          <Select
            label="Safe Handover Preference"
            options={HANDOVER_OPTIONS}
            error={errors.safe_handover?.message}
            required
            {...register('safe_handover')}
          />

          {/* Private Verification Field */}
          <div className="bg-amber-50/70 p-4 rounded-xl border border-amber-200 space-y-2">
            <div className="flex items-center gap-2 text-sm font-semibold text-amber-900">
              <Lock className="w-4 h-4 text-amber-700" />
              Private Verification Detail (Kept Hidden from Public)
            </div>
            <p className="text-xs text-amber-800 leading-relaxed">
              Enter a secret characteristic known only to the genuine owner (e.g. "small cat sticker on back", "contains a blue notebook", "initials RK engraved"). This is NEVER displayed publicly.
            </p>
            <Input
              placeholder="e.g. Sticker inside battery case or lockscreen wallpaper theme"
              {...register('private_detail')}
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-4 flex items-center justify-end gap-3 border-t border-gray-100">
          <Link to="/browse">
            <Button variant="ghost" type="button">Cancel</Button>
          </Link>
          <Button type="submit" variant="primary" loading={loading} className="gap-2">
            Publish Found Report <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </form>
    </div>
  )
}
