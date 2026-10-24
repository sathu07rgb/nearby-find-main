import { useState, useRef } from 'react'
import { Upload, X, Image as ImageIcon, AlertCircle } from 'lucide-react'
import { Button } from '../ui/Button'

interface ImageUploadProps {
  images: string[]
  onChange: (images: string[]) => void
  maxImages?: number
  maxSizeMB?: number
}

export function ImageUpload({
  images,
  onChange,
  maxImages = 4,
  maxSizeMB = 5,
}: ImageUploadProps) {
  const [error, setError] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null)
    const files = Array.from(e.target.files || [])
    if (!files.length) return

    if (images.length + files.length > maxImages) {
      setError(`You can only upload up to ${maxImages} images.`)
      return
    }

    const validFiles: File[] = []
    for (const file of files) {
      if (!file.type.startsWith('image/')) {
        setError('Only image files (JPG, PNG, WebP) are allowed.')
        return
      }
      if (file.size > maxSizeMB * 1024 * 1024) {
        setError(`Each image must be smaller than ${maxSizeMB}MB.`)
        return
      }
      validFiles.push(file)
    }

    setUploading(true)

    // Convert valid images to data URLs for immediate preview / demo storage
    const readers = validFiles.map((file) => {
      return new Promise<string>((resolve) => {
        const reader = new FileReader()
        reader.onloadend = () => resolve(reader.result as string)
        reader.readAsDataURL(file)
      })
    })

    Promise.all(readers).then((newUrls) => {
      onChange([...images, ...newUrls])
      setUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    })
  }

  const handleRemove = (index: number) => {
    const updated = images.filter((_, i) => i !== index)
    onChange(updated)
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-brand-text">
          Photos <span className="text-brand-muted font-normal">(Optional, max {maxImages})</span>
        </label>
        <span className="text-xs text-brand-muted">
          {images.length}/{maxImages} uploaded
        </span>
      </div>

      {/* Grid of uploaded images */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {images.map((img, idx) => (
            <div key={idx} className="relative aspect-square rounded-lg border border-gray-200 overflow-hidden group bg-gray-50">
              <img src={img} alt={`Upload ${idx + 1}`} className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => handleRemove(idx)}
                className="absolute top-1.5 right-1.5 p-1 bg-red-600 text-white rounded-full opacity-90 hover:opacity-100 transition-opacity"
                aria-label="Remove photo"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Upload button area */}
      {images.length < maxImages && (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-gray-200 hover:border-primary-blue rounded-xl p-6 text-center cursor-pointer transition-colors bg-white hover:bg-pale-blue/30"
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            multiple
            className="hidden"
          />
          <div className="flex flex-col items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-pale-blue flex items-center justify-center text-primary-blue">
              <Upload className="w-5 h-5" />
            </div>
            <div className="text-sm font-medium text-brand-text">
              {uploading ? 'Processing photos…' : 'Click to upload photos'}
            </div>
            <p className="text-xs text-brand-muted">
              JPG, PNG, or WebP up to {maxSizeMB}MB
            </p>
          </div>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 text-xs text-red-600 mt-1">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  )
}
