import './globals.css';
import SpaceBackground from '../components/background/SpaceBackground';
import { ChatBot } from '../components/chatbot/ChatBot';
import { Header, Footer } from '../components/layout';
import { Providers } from '../components/providers';

export const metadata = {
  title: 'Portfolio | Developer',
  description: 'Personal portfolio showcasing skills, projects, and expertise',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans antialiased overflow-x-hidden">
        <Providers>
          {/* Background - lowest z-index */}
          <SpaceBackground />

          {/* Header - highest z-index for sticky behavior */}
          <Header />

          {/* Main content - between background and header */}
          <main className="relative z-[1] pt-16">{children}</main>

          {/* ChatBot - high z-index for overlay */}
          <ChatBot />

          <Footer />
        </Providers>
      </body>
    </html>
  );
}
