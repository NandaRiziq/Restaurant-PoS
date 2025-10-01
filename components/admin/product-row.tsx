"use client"

import { useState } from "react"
import type { Product } from "@/lib/types/product"
import { formatIDRCompact } from "@/lib/utils/currency"
import { Button } from "@/components/ui/button"
import { Pencil, Trash2 } from "lucide-react"
import Image from "next/image"
import { EditProductDialog } from "./edit-product-dialog"
import { deleteProduct } from "@/app/actions/admin"
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

interface ProductRowProps {
  product: Product
  onUpdate: () => void
}

export function ProductRow({ product, onUpdate }: ProductRowProps) {
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

  return (
    <>
      <tr className="hover:bg-gray-50">
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
            <span className="font-medium text-gray-900">{product.name}</span>
          </div>
        </td>
        <td className="px-4 py-4">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 capitalize">
            {product.category}
          </span>
        </td>
        <td className="px-4 py-4 text-gray-900 font-medium">{formatIDRCompact(product.price)}</td>
        <td className="px-4 py-4 text-right">
          <div className="flex items-center justify-end gap-2">
            <Button variant="ghost" size="icon" onClick={() => setShowEditDialog(true)} className="h-8 w-8">
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowDeleteDialog(true)}
              className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </td>
      </tr>

      <EditProductDialog product={product} open={showEditDialog} onOpenChange={setShowEditDialog} onUpdate={onUpdate} />

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Produk?</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus <strong>{product.name}</strong>? Tindakan ini tidak dapat dibatalkan.
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
