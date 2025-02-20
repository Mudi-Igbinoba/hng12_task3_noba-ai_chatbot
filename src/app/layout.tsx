import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '@/components/ui/theme-provider';
import { ChatProvider } from '@/lib/ChatContext';
import Navbar from '@/components/ui/Navbar';
import { geistMono, geistSans, monty } from '@/lib/fonts';

export const metadata: Metadata = {
  title: 'NOBA AI',
  description: 'A word processing AI chatbot'
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <head>
        <meta charSet='UTF-8' />
        <meta name='viewport' content='width=device-width, initial-scale=1.0' />
        <meta
          httpEquiv='origin-trial'
          content={process.env.LANGUAGE_DETECTOR_TOKEN}
        />
        <meta httpEquiv='origin-trial' content={process.env.SUMMARIZER_TOKEN} />
        <meta httpEquiv='origin-trial' content={process.env.TRANSLATOR_TOKEN} />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${monty.className} antialiased max-h-screen flex flex-col`}
      >
        <ThemeProvider
          attribute='class'
          defaultTheme='system'
          enableSystem
          disableTransitionOnChange
        >
          <ChatProvider>
            <Navbar />
            <main className='flex-1'>{children}</main>
          </ChatProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
