import { Suspense } from "react"
import { notFound } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { CheckCircle2, Home } from "lucide-react"
import { getOrder, getOrderItems } from "@/app/actions/checkout"
import { formatIDRCompact } from "@/lib/utils/currency"

interface OrderSuccessPageProps {
  searchParams: Promise<{ order_id?: string }>
}

async function OrderSuccessContent({ orderId }: { orderId: string }) {
  // Fetch order and order items in parallel
  const [order, orderItems] = await Promise.all([getOrder(orderId), getOrderItems(orderId)])

  if (!order) {
    notFound()
  }

  const orderDate = new Date(order.created_at)
  const formattedDate = orderDate.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Asia/Jakarta",
  })
  const formattedTime = orderDate.toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Asia/Jakarta",
  })

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Success Icon and Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 mb-4">
            <CheckCircle2 className="w-12 h-12 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Pembayaran Berhasil!</h1>
          <p className="text-gray-600">Terima kasih atas pesanan Anda</p>
        </div>

        {/* Order Details Card */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Detail Pesanan</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Order ID */}
            <div>
              <p className="text-sm text-gray-600 mb-1">ID Pesanan</p>
              <p className="text-sm font-mono text-gray-900 break-all">{order.id}</p>
            </div>

            <Separator />

            {/* Customer Info */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">Nama Pelanggan</p>
                <p className="font-medium text-gray-900">{order.customer_name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Nomor Meja</p>
                <p className="font-medium text-gray-900">Meja {order.table_number}</p>
              </div>
            </div>

            {order.customer_phone && (
              <div>
                <p className="text-sm text-gray-600 mb-1">Nomor Telepon</p>
                <p className="font-medium text-gray-900">{order.customer_phone}</p>
              </div>
            )}

            <Separator />

            {/* Order Items */}
            <div>
              <p className="text-sm text-gray-600 mb-3">Item Pesanan</p>
              <div className="space-y-3">
                {orderItems.map((item) => (
                  <div key={item.id} className="flex justify-between items-start">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{item.product_name}</p>
                      <p className="text-sm text-gray-600">
                        {item.quantity} x {formatIDRCompact(item.product_price)}
                      </p>
                    </div>
                    <p className="font-semibold text-gray-900">{formatIDRCompact(item.subtotal)}</p>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            {/* Total Amount */}
            <div className="flex justify-between items-center pt-2">
              <p className="text-lg font-bold text-gray-900">Total Pembayaran</p>
              <p className="text-2xl font-bold text-amber-600">{formatIDRCompact(order.total_amount)}</p>
            </div>

            <Separator />

            {/* Payment Status and Date */}
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-600 mb-1">Status Pembayaran</p>
                <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Lunas</Badge>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600 mb-1">Tanggal Pesanan</p>
                <p className="text-sm font-medium text-gray-900">{formattedDate}</p>
                <p className="text-sm text-gray-600">{formattedTime}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Return to Menu Button */}
        <Button asChild className="w-full bg-amber-500 hover:bg-amber-600 text-white" size="lg">
          <Link href="/">
            <Home className="w-5 h-5 mr-2" />
            Kembali ke Menu
          </Link>
        </Button>
      </main>
    </div>
  )
}

export default async function OrderSuccessPage({ searchParams }: OrderSuccessPageProps) {
  const params = await searchParams
  const orderId = params.order_id

  if (!orderId) {
    notFound()
  }

  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <p className="text-gray-500">Memuat detail pesanan...</p>
        </div>
      }
    >
      <OrderSuccessContent orderId={orderId} />
    </Suspense>
  )
}
