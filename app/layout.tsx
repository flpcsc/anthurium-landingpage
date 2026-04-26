import type { Metadata } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
import './globals.css'

const geistSans = Inter({
  variable: '--font-body',
  subsets: ['latin'],
  display: 'swap',
})

const geistMono = JetBrains_Mono({
  variable: '--font-display',
  subsets: ['latin'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Anthurium — Consultoria em automação',
  description: 'Facilitamos o uso de ferramentas de IA no ganho de produtividade.',
  openGraph: {
    title: 'Anthurium',
    description: 'Where Nature Meets Craft',
    type: 'website',
  },
}

import ContactModal from '@/components/ui/ContactModal'

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // IP Protection Layer
              document.addEventListener('contextmenu', event => event.preventDefault());
              document.addEventListener('dragstart', event => event.preventDefault());
              document.addEventListener('keydown', event => {
                // Prevent F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U
                if (event.keyCode === 123) {
                  event.preventDefault();
                }
                if (event.ctrlKey && event.shiftKey && (event.keyCode === 73 || event.keyCode === 74)) {
                  event.preventDefault();
                }
                if (event.ctrlKey && event.keyCode === 85) {
                  event.preventDefault();
                }
              });
            `,
          }}
        />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        {children}
        <ContactModal />
      </body>
    </html>
  )
}
