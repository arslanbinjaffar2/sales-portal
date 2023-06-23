import '/public/fonts/fonts.css'
import '@/assets/css/app.scss'

import { Providers } from "@/redux/providers/provider";

export const metadata = {
  title: 'Eventcenter - Sales agent',
  description: 'Eventbuizz sales agent portal.',
}

export default function RootLayout({ children}: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
