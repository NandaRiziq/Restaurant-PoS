"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createProduct, processImageWithAI } from "@/app/actions/admin"
import { useToast } from "@/hooks/use-toast"
import { Upload, X } from "lucide-react"

interface AddProductDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AddProductDialog({ open, onOpenChange }: AddProductDialogProps) {
  const [step, setStep] = useState<"upload" | "details">("upload")
  const [name, setName] = useState("")
  const [price, setPrice] = useState("")
  const [category, setCategory] = useState<"makanan" | "minuman">("makanan")
  const [description, setDescription] = useState("")
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleRemoveImage = () => {
    setImageFile(null)
    setImagePreview(null)
    setImageUrl(null)
  }

  const handleNext = async () => {
    if (imageFile) {
      setIsProcessing(true)
      try {
        console.log("[v0] Starting AI processing...")
        const result = await processImageWithAI(imageFile)
        console.log("[v0] AI processing result:", result)

        if (result.success && result.data) {
          // Pre-fill form with AI results
          console.log("[v0] Setting form data:", {
            name: result.data.name,
            price: result.data.price,
            category: result.data.category,
            description: result.data.description,
            image_url: result.data.image_url,
          })

          setName(result.data.name || "")
          setPrice(result.data.price?.toString() || "")
          setCategory(result.data.category || "makanan")
          setDescription(result.data.description || "")
          setImageUrl(result.data.image_url || null)

          console.log("[v0] State updated, moving to details step")

          toast({
            title: "Berhasil diproses",
            description: "Detail produk telah diisi oleh AI",
          })
          setStep("details")
        } else {
          // On error, still go to details page but with empty form (keep image)
          toast({
            title: "Gagal memproses",
            description:
              result.error || "Terjadi kesalahan saat memproses gambar. Silakan isi detail produk secara manual.",
            variant: "destructive",
          })
          setStep("details")
        }
      } catch (error) {
        console.error("[v0] Error in handleNext:", error)
        toast({
          title: "Gagal memproses",
          description: "Terjadi kesalahan. Silakan isi detail produk secara manual.",
          variant: "destructive",
        })
        setStep("details")
      } finally {
        setIsProcessing(false)
      }
    } else {
      // No image, go directly to details
      setStep("details")
    }
  }

  const handleSkip = () => {
    setStep("details")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate required fields
    if (!name.trim() || !price.trim()) {
      toast({
        title: "Validasi gagal",
        description: "Nama produk dan harga harus diisi",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const result = await createProduct({
        name: name.trim(),
        price: Number.parseInt(price),
        category,
        description: description.trim() || undefined,
        imageUrl: imageUrl || undefined, // Pass the pre-uploaded image URL
        imageFile: imageUrl ? undefined : imageFile || undefined, // Only upload if not already uploaded
      })

      if (result.success) {
        toast({
          title: "Produk ditambahkan",
          description: "Produk berhasil ditambahkan",
        })
        // Reset form
        handleReset()
        onOpenChange(false)
        // Reload page to show new product
        window.location.reload()
      } else {
        toast({
          title: "Gagal menambahkan",
          description: result.error || "Terjadi kesalahan",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("[v0] Error in handleSubmit:", error)
      toast({
        title: "Gagal menambahkan",
        description: "Terjadi kesalahan",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleReset = () => {
    setStep("upload")
    setName("")
    setPrice("")
    setCategory("makanan")
    setDescription("")
    setImageFile(null)
    setImagePreview(null)
    setImageUrl(null)
  }

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      handleReset()
    }
    onOpenChange(open)
  }

  const handleBack = () => {
    setStep("upload")
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Tambah Produk Baru</DialogTitle>
        </DialogHeader>

        {step === "upload" && (
          <div className="space-y-6">
            <div className="space-y-4">
              {/* Image dropzone */}
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-amber-500 transition-colors">
                <input type="file" id="image-upload" accept="image/*" onChange={handleImageChange} className="hidden" />
                {imagePreview ? (
                  <div className="relative">
                    <img
                      src={imagePreview || "/placeholder.svg"}
                      alt="Preview"
                      className="max-h-48 mx-auto rounded-lg object-cover"
                    />
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <label htmlFor="image-upload" className="cursor-pointer">
                    <Upload className="h-12 w-12 mx-auto text-gray-400 mb-3" />
                    <p className="text-sm font-medium text-gray-700 mb-1">Klik untuk upload gambar</p>
                    <p className="text-xs text-gray-500">PNG, JPG hingga 10MB</p>
                  </label>
                )}
              </div>

              {/* Description text */}
              <p className="text-sm text-gray-600 text-center">
                Masukkan gambar produk, detail produk akan diproses oleh AI
              </p>

              {/* Skip link */}
              <div className="text-center">
                <button
                  type="button"
                  onClick={handleSkip}
                  className="text-sm text-amber-600 hover:text-amber-700 underline"
                >
                  Atau lewati penambahan gambar
                </button>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex gap-3 pt-4">
              <Button type="button" variant="outline" onClick={() => handleOpenChange(false)} className="flex-1">
                Batal
              </Button>
              <Button
                type="button"
                onClick={handleNext}
                disabled={isProcessing}
                className="flex-1 bg-amber-500 hover:bg-amber-600 text-white"
              >
                {isProcessing ? "Memproses dengan AI..." : "Selanjutnya"}
              </Button>
            </div>
          </div>
        )}

        {step === "details" && (
          <form onSubmit={handleSubmit} className="space-y-4">
            {imagePreview && (
              <div className="space-y-2">
                <Label>Gambar Produk</Label>
                <div className="relative">
                  <img
                    src={imagePreview || "/placeholder.svg"}
                    alt="Preview"
                    className="w-full h-32 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}

            {!imagePreview && (
              <div className="space-y-2">
                <Label htmlFor="image">Gambar Produk</Label>
                <Input id="image" type="file" accept="image/*" onChange={handleImageChange} />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="name">Nama Produk</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nasi Goreng Spesial"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">Harga (IDR)</Label>
              <Input
                id="price"
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="25000"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Kategori</Label>
              <Select value={category} onValueChange={(value: any) => setCategory(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="makanan">Makanan</SelectItem>
                  <SelectItem value="minuman">Minuman</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Deskripsi</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Deskripsi produk..."
                rows={3}
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button type="button" variant="outline" onClick={handleBack} className="flex-1 bg-transparent">
                Kembali
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-amber-500 hover:bg-amber-600 text-white"
              >
                {isSubmitting ? "Menyimpan..." : "Simpan"}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
