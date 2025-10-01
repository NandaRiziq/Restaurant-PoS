// Utility functions for Indonesian Rupiah formatting
export function formatIDR(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

export function formatIDRCompact(amount: number): string {
  // Format as "Rp 25.000" instead of "Rp25.000,00"
  return `Rp ${amount.toLocaleString("id-ID")}`
}
