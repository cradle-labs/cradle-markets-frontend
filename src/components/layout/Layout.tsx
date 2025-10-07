import React from 'react'
import Header from '../Header'
import Footer from '../Footer'

const Layout = ({children}: {children: React.ReactNode}) => {
  return (
    <div className="min-h-screen trading-bg">
          <Header />

          {/* Main Content Area */}
          <main className="pt-16 pb-16 md:pb-12 px-4 relative">
            {/* Volcanic Ember Background */}
            <div
              className="absolute inset-0 z-0 pointer-events-none"
              style={{
                background: `
                  radial-gradient(ellipse 120% 70% at 70% 80%, rgba(87, 24, 69, 0.20), transparent 52%),
                  radial-gradient(ellipse 160% 45% at 30% 30%, rgba(153, 27, 27, 0.16), transparent 58%),
                  radial-gradient(ellipse 85% 100% at 10% 60%, rgba(69, 26, 3, 0.22), transparent 46%)
                `,
              }}
            />
            
            <div className="max-w-full mx-auto relative z-10">
              <div className="flex gap-4 h-[calc(100vh-8rem)] md:h-[calc(100vh-7rem)]">
                <div className="font-dm-sans w-full ">
                  {children}
                </div>
              </div>
            </div>
          </main>
          <Footer />
        </div>
  )
}

export default Layout
