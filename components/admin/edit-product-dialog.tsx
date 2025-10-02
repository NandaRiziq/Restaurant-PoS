"use client"

import type React from "react"

import { useState, useEffect } from "react"
import type { Product } from "@/lib/types/product"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { updateProduct, uploadImageToSupabase } from "@/app/actions/admin"
import { useToast } from "@/hooks/use-toast"
import { Upload } from "lucide-react"

interface EditProductDialogProps {
  product: Product
  open: boolean
  onOpenChange: (open: boolean) => void
  onUpdate: () => void
}

export function EditProductDialog({ product, open, onOpenChange, onUpdate }: EditProductDialogProps) {
  const [name, setName] = useState(product.name)
  const [price, setPrice] = useState(product.price.toString())
  const [category, setCategory] = useState<"makanan" | "minuman">(product.category)
  const [description, setDescription] = useState(product.description || "")
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(product.image_url || null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    setName(product.name)
    setPrice(product.price.toString())
    setCategory(product.category)
    setDescription(product.description || "")
    setImagePreview(product.image_url || null)
    setImageFile(null)
  }, [product])

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      // Create preview URL
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      let imageUrl = product.image_url

      if (imageFile) {
        const base64 = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader()
          reader.onloadend = () => resolve(reader.result as string)
          reader.onerror = reject
          reader.readAsDataURL(imageFile)
        })

        const uploadResult = await uploadImageToSupabase(base64, imageFile.name)
        if (uploadResult.success && uploadResult.url) {
          imageUrl = uploadResult.url
        } else {
          toast({
            title: "Gagal upload gambar",
            description: uploadResult.error || "Terjadi kesalahan saat upload gambar",
            variant: "destructive",
          })
          setIsSubmitting(false)
          return
        }
      }

      const result = await updateProduct(product.id, {
        name,
        price: Number.parseInt(price),
        category,
        description: description || null,
        image_url: imageUrl,
      })

      if (result.success) {
        toast({
          title: "Produk diperbarui",
          description: "Produk berhasil diperbarui",
        })
        onUpdate()
        onOpenChange(false)
      } else {
        toast({
          title: "Gagal memperbarui",
          description: result.error || "Terjadi kesalahan",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Gagal memperbarui",
        description: "Terjadi kesalahan",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Produk</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="edit-name">Nama Produk</Label>
            <Input id="edit-name" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-price">Harga (IDR)</Label>
            <Input id="edit-price" type="number" value={price} onChange={(e) => setPrice(e.target.value)} required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-category">Kategori</Label>
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
            <Label htmlFor="edit-description">Deskripsi</Label>
            <Textarea
              id="edit-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Deskripsi produk..."
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-image">Gambar Produk</Label>
            {imagePreview && (
              <div className="relative w-full h-32 mb-2 rounded-lg overflow-hidden border">
                <img src={imagePreview || "/placeholder.svg"} alt="Preview" className="w-full h-full object-cover" />
              </div>
            )}
            <div className="flex items-center gap-2">
              <Input id="edit-image" type="file" accept="image/*" onChange={handleImageChange} className="flex-1" />
              <Upload className="h-4 w-4 text-gray-400" />
            </div>
            <p className="text-xs text-gray-500">Upload gambar baru untuk mengganti gambar lama</p>
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
              Batal
            </Button>
            <Button type="submit" disabled={isSubmitting} className="flex-1 bg-amber-500 hover:bg-amber-600 text-white">
              {isSubmitting ? "Menyimpan..." : "Simpan"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
