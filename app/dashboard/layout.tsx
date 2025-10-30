import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Dashboard • CELO Mexico',
  description: 'Tu progreso on-chain',
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  // Dashboard layout without duplicate providers - uses root layout providers
  return (
    <div className="dashboard-layout">
      {children}
    </div>
  )
}
