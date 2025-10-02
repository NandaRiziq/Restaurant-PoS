"use client"

import { useState } from "react"
import type { Product } from "@/lib/types/product"
import { formatIDRCompact } from "@/lib/utils/currency"
import { Button } from "@/components/ui/button"
import { Pencil, Trash2, Eye, EyeOff } from "lucide-react"
import Image from "next/image"
import { EditProductDialog } from "./edit-product-dialog"
import { deleteProduct, toggleProductVisibility } from "@/app/actions/admin"
import { useToast } from "@/hooks/use-toast"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Switch } from "@/components/ui/switch"

interface ProductRowProps {
  product: Product
  onUpdate: () => void
  showVisibility?: boolean
}

export function ProductRow({ product, onUpdate, showVisibility = false }: ProductRowProps) {
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const { toast } = useToast()

  const handleDelete = async () => {
    const result = await deleteProduct(product.id)

    if (result.success) {
      toast({
        title: "Produk dihapus",
        description: "Produk berhasil dihapus",
      })
      onUpdate()
    } else {
      toast({
        title: "Gagal menghapus",
        description: result.error || "Terjadi kesalahan",
        variant: "destructive",
      })
    }
    setShowDeleteDialog(false)
  }

  const handleToggleVisibility = async (checked: boolean) => {
    const result = await toggleProductVisibility(product.id, checked)

    if (result.success) {
      toast({
        title: checked ? "Produk ditampilkan" : "Produk disembunyikan",
        description: checked ? "Produk sekarang terlihat oleh pelanggan" : "Produk disembunyikan dari pelanggan",
      })
      onUpdate()
    } else {
      toast({
        title: "Gagal mengubah visibilitas",
        description: result.error || "Terjadi kesalahan",
        variant: "destructive",
      })
    }
  }

  const isInactive = product.is_active === false

  return (
    <>
      <tr className={isInactive ? "hover:bg-gray-50 opacity-50" : "hover:bg-gray-50"}>
        <td className="px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="relative h-12 w-12 flex-shrink-0 rounded-md overflow-hidden bg-gray-100">
              <Image
                src={product.image_url || "/placeholder.svg"}
                alt={product.name}
                fill
                className="object-cover"
                sizes="48px"
              />
            </div>
            <div className="flex flex-col">
              <span className="font-medium text-gray-900">{product.name}</span>
              {isInactive && <span className="text-xs text-red-600 font-medium">Tidak Aktif</span>}
            </div>
          </div>
        </td>
        <td className="px-4 py-4">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 capitalize">
            {product.category}
          </span>
        </td>
        <td className="px-4 py-4 text-gray-900 font-medium">{formatIDRCompact(product.price)}</td>
        {showVisibility && (
          <td className="px-4 py-4">
            <div className="flex items-center gap-2">
              <Switch checked={product.is_visible !== false} onCheckedChange={handleToggleVisibility} />
              <span className="text-sm text-gray-600">
                {product.is_visible !== false ? (
                  <span className="flex items-center gap-1 text-green-600">
                    <Eye className="h-4 w-4" />
                    Terlihat
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-gray-500">
                    <EyeOff className="h-4 w-4" />
                    Tersembunyi
                  </span>
                )}
              </span>
            </div>
          </td>
        )}
        <td className="px-4 py-4 text-right">
          <div className="flex items-center justify-end gap-2">
            <Button variant="ghost" size="icon" onClick={() => setShowEditDialog(true)} className="h-8 w-8">
              <Pencil className="h-4 w-4" />
            </Button>
            {!isInactive && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowDeleteDialog(true)}
                className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        </td>
      </tr>

      <EditProductDialog product={product} open={showEditDialog} onOpenChange={setShowEditDialog} onUpdate={onUpdate} />

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Produk?</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus <strong>{product.name}</strong>? Produk akan dipindahkan ke tab "Tidak
              Aktif" dan disembunyikan dari pelanggan, tetapi tetap tersimpan dalam riwayat pesanan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
