import './globals.css'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Next Auth',
  description: 'Next.js Authentication',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
