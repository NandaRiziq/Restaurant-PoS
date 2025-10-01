import { NextResponse } from "next/server"

// Xendit payment integration (stubbed for demo)
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { orderId, amount, customerName, customerPhone } = body

    // In production, this would call Xendit API
    // const xenditApiKey = process.env.XENDIT_API_KEY
    // const response = await fetch('https://api.xendit.co/v2/invoices', {
    //   method: 'POST',
    //   headers: {
    //     'Authorization': `Basic ${Buffer.from(xenditApiKey + ':').toString('base64')}`,
    //     'Content-Type': 'application/json'
    //   },
    //   body: JSON.stringify({
    //     external_id: orderId,
    //     amount: amount,
    //     payer_email: customerEmail,
    //     description: `Order ${orderId}`
    //   })
    // })

    // For demo purposes, return a mock payment URL
    const mockPaymentUrl = `/order/${orderId}?payment=success`

    return NextResponse.json({
      success: true,
      paymentUrl: mockPaymentUrl,
      invoiceId: `INV-${Date.now()}`,
    })
  } catch (error) {
    console.error("[v0] Xendit API error:", error)
    return NextResponse.json({ success: false, error: "Payment failed" }, { status: 500 })
  }
}
