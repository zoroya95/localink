import React from 'react'
import Header from '@/components/layout/Header'

type Props = {
  children: React.ReactNode;
}

const LandingLayout = ({children}: Props) => {
  return (
    <div>
        <Header />
      <main className="min-h-screen bg-background">
        {children}
      </main>
      
    </div>
  )
}

export default LandingLayout