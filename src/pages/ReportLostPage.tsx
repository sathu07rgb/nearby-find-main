import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { AlertCircle, MapPin, Calendar, Clock, ShieldCheck, ArrowRight } from 'lucide-react'
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
  description: z.string().min(10, 'Please provide a descriptive explanation (at least 10 chars)'),
  approximate_location: z.string().min(3, 'Please specify approximate location or landmark'),
  city: z.string().min(2, 'City is required'),
  campus: z.string().optional(),
  event_date: z.string().min(1, 'Please select the approximate date lost'),
})

type FormData = z.infer<typeof schema>

export function ReportLostPage() {
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
    },
  })

  const onSubmit = async (data: FormData) => {
    setLoading(true)
    try {
      const reporterId = user?.id || (demoLoggedIn ? 'demo-user-001' : 'anonymous-reporter')

      const created = await addReport({
        reporter_id: reporterId,
        report_type: 'lost',
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

      showSuccess('Report submitted successfully!', 'We are scanning for potential matches.')
      navigate(`/items/${created.id}`)
    } catch (err: unknown) {
      showError('Failed to submit report', err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <span className="badge badge-lost mb-2 font-semibold">Lost Item Report</span>
        <h1 className="text-2xl sm:text-3xl font-bold text-brand-navy">Report a Lost Item</h1>
        <p className="text-sm text-brand-muted mt-1">
          Provide as much detail as possible to help our AI engine find compatible matches.
        </p>
      </div>

      {/* Safety Notice */}
      <div className="mb-6 p-4 rounded-xl bg-blue-50/70 border border-blue-100 flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-primary-blue flex-shrink-0 mt-0.5" />
        <div className="text-xs text-blue-900 leading-relaxed">
          <strong>Privacy Protected:</strong> Never enter sensitive secrets such as banking PINs, full credit card numbers, passwords, or house keys codes. Only enter public visual descriptions.
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-white p-6 sm:p-8 rounded-2xl border border-gray-100 shadow-card">
        {/* Section 1: Item Basic Info */}
        <div className="space-y-4">
          <h2 className="text-base font-semibold text-brand-text border-b border-gray-100 pb-2">
            1. Item Information
          </h2>

          <Input
            label="Item Name"
            placeholder="e.g. Black Sony Wireless Earbuds WF-1000XM4"
            error={errors.item_name?.message}
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
            label="Description & Distinguishing Features"
            placeholder="Describe color, size, stickers, scratches, brand, or markings. (Do NOT share private security details)."
            hint="Detailed descriptions improve matching accuracy significantly."
            error={errors.description?.message}
            required
            rows={4}
            {...register('description')}
          />

          <ImageUpload images={images} onChange={setImages} />
        </div>

        {/* Section 2: Location & Timing */}
        <div className="space-y-4 pt-4 border-t border-gray-100">
          <h2 className="text-base font-semibold text-brand-text border-b border-gray-100 pb-2">
            2. Where & When was it Lost?
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
              label="Campus or Institution (Optional)"
              placeholder="e.g. BMS College of Engineering"
              error={errors.campus?.message}
              {...register('campus')}
            />
          </div>

          <Input
            label="Approximate Landmark or Area"
            placeholder="e.g. 2nd floor library reading room, desk next to window"
            leftIcon={<MapPin className="w-4 h-4" />}
            error={errors.approximate_location?.message}
            required
            {...register('approximate_location')}
          />

          <Input
            label="Date Lost (Approximate)"
            type="date"
            leftIcon={<Calendar className="w-4 h-4" />}
            error={errors.event_date?.message}
            required
            {...register('event_date')}
          />
        </div>

        {/* Submit Button */}
        <div className="pt-4 flex items-center justify-end gap-3 border-t border-gray-100">
          <Link to="/browse">
            <Button variant="ghost" type="button">Cancel</Button>
          </Link>
          <Button type="submit" variant="primary" loading={loading} className="gap-2">
            Publish Lost Report <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </form>
    </div>
  )
}
