import '/public/fonts/fonts.css'
import '@/assets/css/app.scss'
import {NextIntlClientProvider} from 'next-intl';
import {notFound} from 'next/navigation';
 
import { Providers } from "@/redux/providers/provider";

export const metadata = {
  title: 'Eventcenter - Sales agent',
  description: 'Eventbuizz sales agent portal.',
}

// export function generateStaticParams() {
//   return [{locale: 'en'}, {locale: 'de'}];
// }

export default async function RootLayout({ children, params: {locale}}: { children: React.ReactNode, params: {locale:string} }) {
  let lang;
  try {
    lang = (await import(`../../lang/${locale}.json`)).default;
  } catch (error) {
    notFound();
  }
  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider locale={locale} messages={lang}>
          <Providers>
            {children}
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}