import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Eco City',
  description: 'Eco City Transport Game',
  generator: 'Eco City',
  applicationName: 'Eco City',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
