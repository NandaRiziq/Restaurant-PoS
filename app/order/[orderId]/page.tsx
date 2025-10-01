import { getOrder, getOrderItems } from "@/app/actions/checkout"
import { formatIDRCompact } from "@/lib/utils/currency"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { CheckCircle2, Package } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"

export default async function OrderConfirmationPage({ params }: { params: Promise<{ orderId: string }> }) {
  const { orderId } = await params
  const order = await getOrder(orderId)
  const orderItems = await getOrderItems(orderId)

  if (!order) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-900">Warung Makan</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-3xl">
        {/* Success Message */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <CheckCircle2 className="h-8 w-8 text-green-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Pesanan Berhasil!</h2>
          <p className="text-gray-600">Terima kasih atas pesanan Anda</p>
        </div>

        {/* Order Details */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Detail Pesanan
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-500 mb-1">Nomor Pesanan</p>
                <p className="font-mono font-medium">{order.id.slice(0, 8).toUpperCase()}</p>
              </div>
              <div>
                <p className="text-gray-500 mb-1">Status</p>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 capitalize">
                  {order.status === "pending" ? "Menunggu Pembayaran" : order.status}
                </span>
              </div>
              <div>
                <p className="text-gray-500 mb-1">Nama</p>
                <p className="font-medium">{order.customer_name}</p>
              </div>
              <div>
                <p className="text-gray-500 mb-1">Telepon</p>
                <p className="font-medium">{order.customer_phone}</p>
              </div>
              <div className="col-span-2">
                <p className="text-gray-500 mb-1">Alamat Pengiriman</p>
                <p className="font-medium">{order.customer_address}</p>
              </div>
            </div>

            <Separator />

            {/* Order Items */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Item Pesanan</h3>
              <div className="space-y-3">
                {orderItems.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{item.product_name}</p>
                      <p className="text-gray-500">
                        {item.quantity} x {formatIDRCompact(item.product_price)}
                      </p>
                    </div>
                    <p className="font-semibold text-gray-900">{formatIDRCompact(item.subtotal)}</p>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            {/* Total */}
            <div className="flex justify-between text-lg font-bold">
              <span>Total Pembayaran</span>
              <span className="text-amber-600">{formatIDRCompact(order.total_amount)}</span>
            </div>
          </CardContent>
        </Card>

        {/* Payment Instructions */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Instruksi Pembayaran</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm text-gray-600">
              <p>Silakan lakukan pembayaran melalui metode yang tersedia:</p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>Transfer Bank</li>
                <li>E-Wallet (GoPay, OVO, Dana)</li>
                <li>Virtual Account</li>
                <li>QRIS</li>
              </ul>
              <p className="text-amber-600 font-medium">Pesanan Anda akan diproses setelah pembayaran dikonfirmasi.</p>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex gap-3">
          <Button asChild variant="outline" className="flex-1 bg-transparent">
            <Link href="/">Kembali ke Toko</Link>
          </Button>
          <Button asChild className="flex-1 bg-amber-500 hover:bg-amber-600 text-white">
            <Link href={`/order/${orderId}`}>Lihat Status Pesanan</Link>
          </Button>
        </div>
      </main>
    </div>
  )
}
